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
  };
}

function withJsonInput(state, jsonInput) {
  return {
    ...state,
    phase: derivePhase(jsonInput, state.videoInput),
    jsonInput,
    errors: [],
  };
}

function withVideoInput(state, videoInput) {
  return {
    ...state,
    phase: derivePhase(state.jsonInput, videoInput),
    videoInput,
    errors: [],
  };
}

function withError(state, errors, options = {}) {
  return {
    ...state,
    phase: PHASES.ERROR,
    jsonInput: options.clearJson ? null : state.jsonInput,
    videoInput: options.clearVideo ? null : state.videoInput,
    errors,
  };
}

function startSimulation(state) {
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
      "Iniciando simulação.",
      `JSON: ${state.jsonInput.name} (${state.jsonInput.cuts.length} cortes).`,
      `Vídeo: ${state.videoInput.name}.`,
      "Estado validado. Nenhuma alteração foi feita no projeto.",
    ],
  };
}

function finishSimulation(state) {
  return {
    ...state,
    phase: derivePhase(state.jsonInput, state.videoInput),
    logs: [...state.logs, "Simulação concluída."],
  };
}

module.exports = {
  PHASES,
  createInitialState,
  finishSimulation,
  startSimulation,
  withError,
  withJsonInput,
  withVideoInput,
};
