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

function hasSequenceNameConflict(sequenceNames, expectedName) {
  const normalizedExpectedName = expectedName.toLowerCase();
  return sequenceNames.some(
    (sequenceName) => sequenceName.toLowerCase() === normalizedExpectedName,
  );
}

module.exports = {
  createMasterSequenceName,
  hasSequenceNameConflict,
  sanitizeSequenceName,
};
