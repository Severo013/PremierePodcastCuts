const INVALID_NAME_CHARACTERS = /[\u0000-\u001f<>:"/\\|?*]/g;
const MAX_SANITIZED_NAME_LENGTH = 100;

function sanitizeSequenceName(value) {
  const sanitized = String(value)
    .replace(INVALID_NAME_CHARACTERS, " ")
    .replace(/\s+/g, " ")
    .replace(/[. ]+$/g, "")
    .trim();

  if (!sanitized) {
    return "Projeto";
  }

  return Array.from(sanitized)
    .slice(0, MAX_SANITIZED_NAME_LENGTH)
    .join("")
    .replace(/[. ]+$/g, "")
    .trim() || "Projeto";
}

function createMasterSequenceName(projectName) {
  return `00_MASTER - ${sanitizeSequenceName(projectName)}`;
}

function createCutSequenceName(cutName, cutNumber = 1) {
  const prefix = String(cutNumber).padStart(2, "0");
  return `${prefix} - ${sanitizeSequenceName(cutName)}`;
}

function createCutSequenceNames(cuts) {
  return cuts.map((cut, index) => createCutSequenceName(cut.name, index + 1));
}

function findSequenceNameConflicts(sequenceNames, expectedNames) {
  const normalizedExistingNames = new Set(
    sequenceNames.map((name) => name.toLowerCase()),
  );
  return expectedNames.filter((name) =>
    normalizedExistingNames.has(name.toLowerCase()),
  );
}

module.exports = {
  createCutSequenceName,
  createCutSequenceNames,
  createMasterSequenceName,
  findSequenceNameConflicts,
  sanitizeSequenceName,
};
