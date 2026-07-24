const app = require("premierepro");
const {
  createCutSequenceNames,
  createMasterSequenceName,
  findSequenceNameConflicts,
  hasSequenceNameConflict,
} = require("../domain/sequence-name");

function normalizeMediaPath(mediaPath) {
  return mediaPath.replace(/\//g, "\\").toLowerCase();
}

function isClipLikeProjectItem(item) {
  return (
    item.type === app.ProjectItem.TYPE_CLIP ||
    item.type === app.ProjectItem.TYPE_FILE ||
    item.type === app.ProjectItem.TYPE_COMPOUND
  );
}

async function findClipInFolder(folder, mediaPath) {
  const items = await folder.getItems();
  const expectedPath = normalizeMediaPath(mediaPath);

  for (const item of items) {
    if (item.type === app.ProjectItem.TYPE_BIN) {
      const childFolder = app.FolderItem.cast(item);
      const nestedClip = await findClipInFolder(childFolder, mediaPath);
      if (nestedClip) {
        return nestedClip;
      }
      continue;
    }

    if (!isClipLikeProjectItem(item)) {
      continue;
    }

    try {
      const clip = app.ClipProjectItem.cast(item);
      const candidatePath = await clip.getMediaFilePath();
      if (normalizeMediaPath(candidatePath) === expectedPath) {
        return clip;
      }
    } catch (error) {
      console.warn(
        `Não foi possível verificar o item candidato "${item.name}".`,
        error,
      );
    }
  }

  return null;
}

async function getActiveProject() {
  const project = await app.Project.getActiveProject();
  if (!project) {
    throw new Error("Nenhum projeto ativo. Abra um projeto no Premiere e tente novamente.");
  }

  return project;
}

async function getRootItem(project) {
  const rootItem = await project.getRootItem();
  if (!rootItem) {
    throw new Error("Não foi possível acessar o bin raiz do projeto ativo.");
  }

  return rootItem;
}

async function ensureMedia(project, rootItem, mediaPath) {
  const existingClip = await findClipInFolder(rootItem, mediaPath);
  if (existingClip) {
    return { clip: existingClip, imported: false };
  }

  const imported = await project.importFiles([mediaPath], true, rootItem, false);
  if (!imported) {
    throw new Error("O Premiere não conseguiu importar o vídeo selecionado.");
  }

  const refreshedRootItem = await project.getRootItem();
  const importedClip = await findClipInFolder(refreshedRootItem, mediaPath);
  if (!importedClip) {
    throw new Error(
      "O Premiere informou sucesso na importação, mas o item não foi localizado pelo caminho da mídia.",
    );
  }

  return { clip: importedClip, imported: true };
}

async function assertMasterNameAvailable(project, masterName) {
  const sequences = await project.getSequences();
  const conflict = hasSequenceNameConflict(
    sequences.map((sequence) => sequence.name),
    masterName,
  );

  if (conflict) {
    throw new Error(
      `Já existe uma sequência chamada "${masterName}". Nenhuma master foi criada.`,
    );
  }
}

async function createMasterSequence(mediaPath, projectName) {
  if (typeof mediaPath !== "string" || !mediaPath) {
    throw new Error("O caminho nativo do vídeo selecionado não está disponível.");
  }

  const masterName = createMasterSequenceName(projectName);
  const project = await getActiveProject();
  await assertMasterNameAvailable(project, masterName);

  const rootItem = await getRootItem(project);
  const media = await ensureMedia(project, rootItem, mediaPath);
  const sequence = await project.createSequenceFromMedia(
    masterName,
    [media.clip],
    rootItem,
  );

  if (!sequence) {
    throw new Error("O Premiere não retornou a sequência master criada.");
  }

  return {
    projectName: project.name,
    itemName: media.clip.name,
    mediaPath,
    imported: media.imported,
    masterSequenceName: sequence.name,
  };
}

function executeActions(project, addActions, undoText) {
  let executed = false;

  project.lockedAccess(() => {
    executed = project.executeTransaction((compoundAction) => {
      addActions(compoundAction);
    }, undoText);
  });

  if (!executed) {
    throw new Error(`O Premiere recusou a transação: ${undoText}.`);
  }
}

function findSequenceByName(sequences, expectedName) {
  const normalizedName = expectedName.toLowerCase();
  return sequences.find(
    (sequence) => sequence.name.toLowerCase() === normalizedName,
  );
}

async function getTrackItems(project, sequenceGuid, mediaType, trackIndex) {
  const sequence = await project.getSequence(sequenceGuid);
  const track = mediaType === "video"
    ? await sequence.getVideoTrack(trackIndex)
    : await sequence.getAudioTrack(trackIndex);
  return await track.getTrackItems(app.Constants.TrackItemType.CLIP, false);
}

async function trimTrackGroup(
  project,
  sequenceGuid,
  mediaType,
  trackCount,
  startSeconds,
  endSeconds,
) {
  let processedItems = 0;

  for (let trackIndex = 0; trackIndex < trackCount; trackIndex += 1) {
    const initialItems = await getTrackItems(
      project,
      sequenceGuid,
      mediaType,
      trackIndex,
    );

    for (let itemIndex = 0; itemIndex < initialItems.length; itemIndex += 1) {
      const currentItems = await getTrackItems(
        project,
        sequenceGuid,
        mediaType,
        trackIndex,
      );
      const itemToTrim = currentItems[itemIndex];
      if (!itemToTrim) {
        throw new Error(`O item de ${mediaType} não foi localizado para recorte.`);
      }
      executeActions(
        project,
        (compoundAction) => {
          const startTime = app.TickTime.createWithSeconds(startSeconds);
          const endTime = app.TickTime.createWithSeconds(endSeconds);
          compoundAction.addAction(itemToTrim.createSetStartAction(startTime));
          compoundAction.addAction(itemToTrim.createSetEndAction(endTime));
        },
        `Aparar ${mediaType} do corte atual`,
      );

      const refreshedItems = await getTrackItems(
        project,
        sequenceGuid,
        mediaType,
        trackIndex,
      );
      const itemToMove = refreshedItems[itemIndex];
      if (!itemToMove) {
        throw new Error(
          `O item de ${mediaType} não foi relocalizado após o recorte.`,
        );
      }

      executeActions(
        project,
        (compoundAction) => {
          const offset = app.TickTime.createWithSeconds(-startSeconds);
          compoundAction.addAction(itemToMove.createMoveAction(offset));
        },
        `Mover ${mediaType} do corte atual para zero`,
      );
      processedItems += 1;
    }
  }

  return processedItems;
}

async function createCutSequence(
  project,
  masterGuid,
  masterName,
  cut,
  cutNumber,
  cutName,
) {
  const masterForSettings = await project.getSequence(masterGuid);
  const settings = await masterForSettings.getSettings();
  const frameRate = await settings.getVideoFrameRate();
  const alignedStart = app.TickTime.createWithSeconds(
    cut.startSeconds,
  ).alignToNearestFrame(frameRate);
  const alignedEnd = app.TickTime.createWithSeconds(
    cut.endSeconds,
  ).alignToNearestFrame(frameRate);

  if (alignedEnd.seconds <= alignedStart.seconds) {
    throw new Error("O intervalo ficou vazio após o alinhamento aos frames.");
  }

  const alignedStartSeconds = alignedStart.seconds;
  const alignedEndSeconds = alignedEnd.seconds;
  const masterForSubsequence = await project.getSequence(masterGuid);
  const subsequence = await masterForSubsequence.createSubsequence(true);
  if (!subsequence) {
    throw new Error("O Premiere não retornou a subsequência criada.");
  }
  const subsequenceGuid = subsequence.guid;

  const sequenceForTrackCounts = await project.getSequence(subsequenceGuid);
  const videoTrackCount = await sequenceForTrackCounts.getVideoTrackCount();
  const sequenceForAudioCount = await project.getSequence(subsequenceGuid);
  const audioTrackCount = await sequenceForAudioCount.getAudioTrackCount();
  const videoItemsProcessed = await trimTrackGroup(
    project,
    subsequenceGuid,
    "video",
    videoTrackCount,
    alignedStartSeconds,
    alignedEndSeconds,
  );
  const audioItemsProcessed = await trimTrackGroup(
    project,
    subsequenceGuid,
    "audio",
    audioTrackCount,
    alignedStartSeconds,
    alignedEndSeconds,
  );

  if (videoItemsProcessed === 0 || audioItemsProcessed === 0) {
    throw new Error(
      "A subsequência não continha itens de vídeo e áudio para recortar.",
    );
  }

  const subsequenceForProjectItem = await project.getSequence(subsequenceGuid);
  const sequenceItem = await subsequenceForProjectItem.getProjectItem();
  if (!sequenceItem) {
    throw new Error("Não foi possível acessar o item da subsequência criada.");
  }

  executeActions(
    project,
    (compoundAction) => {
      compoundAction.addAction(sequenceItem.createSetNameAction(cutName));
    },
    "Nomear o corte atual",
  );

  const subsequenceForEnd = await project.getSequence(subsequenceGuid);
  const actualEnd = await subsequenceForEnd.getEndTime();
  const subsequenceForZero = await project.getSequence(subsequenceGuid);
  const zeroPoint = await subsequenceForZero.getZeroPoint();
  const alignedDurationSeconds = alignedEndSeconds - alignedStartSeconds;
  const actualDurationSeconds = actualEnd.seconds - zeroPoint.seconds;

  return {
    sequenceName: cutName,
    masterSequenceName: masterName,
    cutNumber,
    sourceStartSeconds: cut.startSeconds,
    sourceEndSeconds: cut.endSeconds,
    alignedStartSeconds,
    alignedEndSeconds,
    expectedDurationSeconds: alignedDurationSeconds,
    actualDurationSeconds,
    deviationSeconds: Math.abs(actualDurationSeconds - alignedDurationSeconds),
    zeroPointSeconds: zeroPoint.seconds,
  };
}

function createExecutionError(message, report) {
  const error = new Error(message);
  error.report = report;
  return error;
}

async function createCutSequences(projectName, cuts, onProgress = () => {}) {
  const requested = cuts.length;
  const report = {
    requested,
    created: [],
    failed: [],
    masterSequenceName: createMasterSequenceName(projectName),
  };

  if (requested === 0) {
    throw createExecutionError("O JSON não contém cortes.", report);
  }

  const project = await getActiveProject();
  const sequences = await project.getSequences();
  const masterSequence = findSequenceByName(
    sequences,
    report.masterSequenceName,
  );
  if (!masterSequence) {
    throw createExecutionError(
      `A sequência master "${report.masterSequenceName}" não foi encontrada.`,
      report,
    );
  }

  const cutNames = createCutSequenceNames(cuts);
  const conflicts = findSequenceNameConflicts(
    sequences.map((sequence) => sequence.name),
    cutNames,
  );
  if (conflicts.length > 0) {
    report.failed = conflicts.map((sequenceName) => ({
      sequenceName,
      message: "Conflito de nome detectado antes da execução.",
    }));
    throw createExecutionError(
      `Conflitos detectados: ${conflicts.join(", ")}. Nenhuma sequência foi criada.`,
      report,
    );
  }

  const masterGuid = masterSequence.guid;
  onProgress({ current: 0, total: requested, sequenceName: null });

  for (let index = 0; index < cuts.length; index += 1) {
    const cut = cuts[index];
    const sequenceName = cutNames[index];
    try {
      const result = await createCutSequence(
        project,
        masterGuid,
        report.masterSequenceName,
        cut,
        index + 1,
        sequenceName,
      );
      report.created.push(result);
      onProgress({
        current: index + 1,
        total: requested,
        sequenceName,
      });
    } catch (error) {
      report.failed.push({
        cutNumber: index + 1,
        sequenceName,
        message: error.message || "Falha inesperada.",
      });
      throw createExecutionError(
        `Falha no corte ${index + 1}/${requested} ("${sequenceName}"): ${error.message || "erro inesperado"}`,
        report,
      );
    }
  }

  return report;
}

module.exports = { createCutSequences, createMasterSequence };
