const INVALID_NAME_CHARACTERS = /[\u0000-\u001f<>:"/\\|?*]/g;

function sanitizeSequenceName(value) {
  const sanitized = String(value)
    .replace(INVALID_NAME_CHARACTERS, " ")
    .replace(/\s+/g, " ")
    .replace(/[. ]+$/g, "")
    .trim();

  return sanitized || "Projeto";
}

function createMasterSequenceName(projectName) {
  return `00_MASTER - ${sanitizeSequenceName(projectName)}`;
}

function createCutSequenceName(cutName, cutNumber = 1) {
  const prefix = String(cutNumber).padStart(2, "0");
  return `${prefix} - ${sanitizeSequenceName(cutName)}`;
}

function hasSequenceNameConflict(sequenceNames, expectedName) {
  const normalizedExpectedName = expectedName.toLowerCase();
  return sequenceNames.some(
    (sequenceName) => sequenceName.toLowerCase() === normalizedExpectedName,
  );
}

module.exports = {
  createCutSequenceName,
  createMasterSequenceName,
  hasSequenceNameConflict,
  sanitizeSequenceName,
};
