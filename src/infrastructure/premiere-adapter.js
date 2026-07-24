const app = require("premierepro");

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

function createMediaResult(project, clip, mediaPath, imported) {
  return {
    projectName: project.name,
    itemName: clip.name,
    mediaPath,
    imported,
  };
}

async function prepareMedia(mediaPath) {
  if (typeof mediaPath !== "string" || !mediaPath) {
    throw new Error("O caminho nativo do vídeo selecionado não está disponível.");
  }

  const project = await app.Project.getActiveProject();
  if (!project) {
    throw new Error("Nenhum projeto ativo. Abra um projeto no Premiere e tente novamente.");
  }

  const rootItem = await project.getRootItem();
  if (!rootItem) {
    throw new Error("Não foi possível acessar o bin raiz do projeto ativo.");
  }

  const existingClip = await findClipInFolder(rootItem, mediaPath);
  if (existingClip) {
    return createMediaResult(project, existingClip, mediaPath, false);
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

  return createMediaResult(project, importedClip, mediaPath, true);
}

module.exports = { prepareMedia };
