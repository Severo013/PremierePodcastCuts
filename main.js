const {
  selectJsonFile,
  selectVideoFile,
} = require("./src/infrastructure/file-picker");
const { parseCutsJson } = require("./src/domain/cuts-parser");
const {
  createMasterSequence,
} = require("./src/infrastructure/premiere-adapter");
const {
  PHASES,
  createInitialState,
  finishExecution,
  startExecution,
  withError,
  withJsonInput,
  withVideoInput,
} = require("./src/application/input-state");

const elements = {
  selectJsonButton: document.querySelector("#select-json-button"),
  selectVideoButton: document.querySelector("#select-video-button"),
  createCutsButton: document.querySelector("#create-cuts-button"),
  status: document.querySelector("#status"),
  phase: document.querySelector("#phase"),
  selectedJsonName: document.querySelector("#selected-json-name"),
  selectedVideoName: document.querySelector("#selected-video-name"),
  summary: document.querySelector("#summary"),
  fileName: document.querySelector("#json-file-name"),
  projectName: document.querySelector("#project-name"),
  cutsCount: document.querySelector("#cuts-count"),
  cutsList: document.querySelector("#cuts-list"),
  errors: document.querySelector("#errors"),
  errorsList: document.querySelector("#errors-list"),
  logList: document.querySelector("#log-list"),
};

let state = createInitialState();

function replaceListItems(list, values) {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }

  values.forEach((value) => {
    const item = document.createElement("li");
    item.textContent = value;
    list.appendChild(item);
  });
}

function formatDuration(seconds) {
  return `${seconds.toFixed(3)} s`;
}

function getStatusText(currentState) {
  if (currentState.phase === PHASES.RUNNING) {
    return "Criando a sequência master...";
  }

  if (currentState.phase === PHASES.ERROR) {
    return "Corrija o erro para continuar.";
  }

  if (currentState.phase === PHASES.READY) {
    return "JSON e vídeo selecionados. Pronto para criar a master.";
  }

  if (currentState.phase === PHASES.PARTIAL) {
    return currentState.jsonInput
      ? "JSON válido. Selecione o vídeo MP4."
      : "Vídeo selecionado. Selecione um JSON válido.";
  }

  return "Selecione um JSON e um vídeo MP4.";
}

function renderSummary(jsonInput) {
  elements.summary.hidden = !jsonInput;
  elements.selectedJsonName.textContent = jsonInput ? jsonInput.name : "Nenhum";

  if (!jsonInput) {
    replaceListItems(elements.cutsList, []);
    return;
  }

  elements.fileName.textContent = jsonInput.name;
  elements.projectName.textContent = jsonInput.projectName;
  elements.cutsCount.textContent = String(jsonInput.cuts.length);
  replaceListItems(
    elements.cutsList,
    jsonInput.cuts.map(
      (cut) =>
        `${cut.id} — ${cut.name}: ${cut.startText} até ${cut.endText} ` +
        `(${formatDuration(cut.durationSeconds)})`,
    ),
  );
}

function render() {
  const isRunning = state.phase === PHASES.RUNNING;
  const isReady = state.phase === PHASES.READY;

  elements.phase.textContent = state.phase;
  elements.status.textContent = getStatusText(state);
  elements.selectJsonButton.disabled = isRunning;
  elements.selectVideoButton.disabled = isRunning;
  elements.createCutsButton.disabled = isRunning || !isReady;
  elements.selectedVideoName.textContent = state.videoInput
    ? state.videoInput.name
    : "Nenhum";

  renderSummary(state.jsonInput);
  replaceListItems(elements.errorsList, state.errors);
  replaceListItems(elements.logList, state.logs);
  elements.errors.hidden = state.errors.length === 0;
}

async function handleJsonSelection() {
  try {
    const selectedFile = await selectJsonFile();
    if (!selectedFile) {
      return;
    }

    const result = parseCutsJson(selectedFile.text);
    if (result.errors.length > 0) {
      state = withError(state, result.errors, { clearJson: true });
      render();
      return;
    }

    state = withJsonInput(state, {
      entry: selectedFile.entry,
      nativePath: selectedFile.nativePath,
      name: selectedFile.name,
      projectName: result.projectName,
      cuts: result.cuts,
    });
  } catch (error) {
    console.error("Falha ao selecionar ou ler o JSON.", error);
    state = withError(state, [
      "Não foi possível abrir ou ler o arquivo JSON.",
    ]);
  }

  render();
}

async function handleVideoSelection() {
  try {
    const selectedFile = await selectVideoFile();
    if (!selectedFile) {
      return;
    }

    state = withVideoInput(state, selectedFile);
  } catch (error) {
    console.error("Falha ao selecionar o vídeo MP4.", error);
    state = withError(state, ["Não foi possível selecionar o vídeo MP4."]);
  }

  render();
}

async function handleCreateCuts() {
  state = startExecution(state);
  render();

  try {
    if (state.phase === PHASES.ERROR) {
      return;
    }

    const result = await createMasterSequence(
      state.videoInput.nativePath,
      state.jsonInput.projectName,
    );
    state = finishExecution(state, [
      `Projeto ativo: ${result.projectName}.`,
      result.imported
        ? `Mídia importada: ${result.itemName}.`
        : `Mídia já existente reutilizada: ${result.itemName}.`,
      `Caminho confirmado: ${result.mediaPath}.`,
      `Sequência master criada: ${result.masterSequenceName}.`,
      "O projeto não foi salvo automaticamente.",
    ]);
  } catch (error) {
    console.error("Falha ao criar a sequência master.", error);
    state = withError(
      state,
      [error.message || "Falha inesperada ao criar a sequência master."],
      { logs: [...state.logs, "A criação da master falhou."] },
    );
  } finally {
    render();
  }
}

elements.selectJsonButton.addEventListener("click", handleJsonSelection);
elements.selectVideoButton.addEventListener("click", handleVideoSelection);
elements.createCutsButton.addEventListener("click", handleCreateCuts);

render();
