const PHASES = Object.freeze({
  IDLE: "idle",
  PARTIAL: "partial",
  READY: "ready",
  RUNNING: "running",
  ERROR: "error",
});

function derivePhase(jsonInput, videoInput) {
  if (jsonInput && videoInput) {
    return PHASES.READY;
  }

  if (jsonInput || videoInput) {
    return PHASES.PARTIAL;
  }

  return PHASES.IDLE;
}

function createInitialState() {
  return {
    phase: PHASES.IDLE,
    jsonInput: null,
    videoInput: null,
    errors: [],
    logs: [],
    progress: null,
  };
}

function withJsonInput(state, jsonInput) {
  return {
    ...state,
    phase: derivePhase(jsonInput, state.videoInput),
    jsonInput,
    errors: [],
    progress: null,
  };
}

function withVideoInput(state, videoInput) {
  return {
    ...state,
    phase: derivePhase(state.jsonInput, videoInput),
    videoInput,
    errors: [],
    progress: null,
  };
}

function withError(state, errors, options = {}) {
  return {
    ...state,
    phase: PHASES.ERROR,
    jsonInput: options.clearJson ? null : state.jsonInput,
    videoInput: options.clearVideo ? null : state.videoInput,
    errors,
    logs: options.logs || state.logs,
  };
}

function startExecution(state) {
  if (!state.jsonInput || !state.videoInput) {
    return withError(state, [
      "Selecione um JSON válido e um vídeo MP4 antes de criar os cortes.",
    ]);
  }

  return {
    ...state,
    phase: PHASES.RUNNING,
    errors: [],
    logs: [
      "Iniciando criação dos cortes em ordem.",
      `JSON: ${state.jsonInput.name} (${state.jsonInput.cuts.length} cortes).`,
      `Vídeo: ${state.videoInput.name}.`,
      "Estado de entrada validado.",
    ],
    progress: { current: 0, total: state.jsonInput.cuts.length },
  };
}

function updateExecutionProgress(state, current, total, logMessage) {
  return {
    ...state,
    progress: { current, total },
    logs: logMessage ? [...state.logs, logMessage] : state.logs,
  };
}

function finishExecution(state, operationLogs) {
  return {
    ...state,
    phase: derivePhase(state.jsonInput, state.videoInput),
    logs: [...state.logs, ...operationLogs, "Criação dos cortes concluída."],
  };
}

module.exports = {
  PHASES,
  createInitialState,
  finishExecution,
  startExecution,
  updateExecutionProgress,
  withError,
  withJsonInput,
  withVideoInput,
};
