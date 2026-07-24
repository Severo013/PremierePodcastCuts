const { localFileSystem } = require("uxp").storage;

async function selectJsonFile() {
  const file = await localFileSystem.getFileForOpening({
    allowMultiple: false,
    types: ["json"],
  });

  if (!file) {
    return null;
  }

  return {
    name: file.name,
    text: await file.read(),
  };
}

module.exports = { selectJsonFile };
