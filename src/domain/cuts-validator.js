const { parseTimestamp } = require("./timestamp");

const SUPPORTED_SCHEMA_VERSION = 1;
const MAX_CUTS = 1000;

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validateRoot(value) {
  const errors = [];

  if (!isRecord(value)) {
    return ["A raiz do JSON deve ser um objeto."];
  }

  if (value.schemaVersion !== SUPPORTED_SCHEMA_VERSION) {
    errors.push("schemaVersion deve ser o número inteiro 1.");
  }

  if (typeof value.projectName !== "string" || !value.projectName.trim()) {
    errors.push("projectName deve ser um texto não vazio.");
  }

  if (!Array.isArray(value.cuts)) {
    errors.push("cuts deve ser uma lista.");
  } else if (value.cuts.length === 0) {
    errors.push("cuts deve conter pelo menos um corte.");
  } else if (value.cuts.length > MAX_CUTS) {
    errors.push(`cuts deve conter no máximo ${MAX_CUTS} cortes.`);
  }

  return errors;
}

function normalizeId(id) {
  return typeof id === "string" ? id.trim() : String(id);
}

function validateId(id, label) {
  if (Number.isInteger(id)) {
    return null;
  }

  if (typeof id === "string" && id.trim()) {
    return null;
  }

  return `${label}: id deve ser um inteiro ou texto não vazio.`;
}

function validateAndNormalizeCut(value, index, ids) {
  const label = `Corte ${index + 1}`;
  const errors = [];

  if (!isRecord(value)) {
    return { cut: null, errors: [`${label} deve ser um objeto.`] };
  }

  const idError = validateId(value.id, label);
  if (idError) {
    errors.push(idError);
  } else {
    const normalizedId = normalizeId(value.id);
    if (ids.has(normalizedId)) {
      errors.push(`${label}: id duplicado (${normalizedId}).`);
    } else {
      ids.add(normalizedId);
    }
  }

  const name = typeof value.name === "string" ? value.name.trim() : "";
  if (!name) {
    errors.push(`${label}: name deve ser um texto não vazio.`);
  }

  const startSeconds = parseTimestamp(value.start);
  if (startSeconds === null) {
    errors.push(`${label}: start possui um timestamp inválido.`);
  }

  const endSeconds = parseTimestamp(value.end);
  if (endSeconds === null) {
    errors.push(`${label}: end possui um timestamp inválido.`);
  }

  if (
    startSeconds !== null &&
    endSeconds !== null &&
    endSeconds <= startSeconds
  ) {
    errors.push(`${label}: end deve ser posterior a start.`);
  }

  if (errors.length > 0) {
    return { cut: null, errors };
  }

  return {
    cut: {
      id: typeof value.id === "string" ? value.id.trim() : value.id,
      name,
      startText: value.start,
      endText: value.end,
      startSeconds,
      endSeconds,
      durationSeconds: endSeconds - startSeconds,
    },
    errors: [],
  };
}

function validateCutsDocument(value) {
  const rootErrors = validateRoot(value);
  if (rootErrors.length > 0) {
    return { projectName: "", cuts: [], errors: rootErrors };
  }

  const ids = new Set();
  const cuts = [];
  const errors = [];

  value.cuts.forEach((cut, index) => {
    const result = validateAndNormalizeCut(cut, index, ids);
    errors.push(...result.errors);
    if (result.cut) {
      cuts.push(result.cut);
    }
  });

  return {
    projectName: value.projectName.trim(),
    cuts: errors.length === 0 ? cuts : [],
    errors,
  };
}

module.exports = { validateCutsDocument };
