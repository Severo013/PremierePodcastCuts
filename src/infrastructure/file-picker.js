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
    entry: file,
    name: file.name,
    nativePath: localFileSystem.getNativePath(file),
    text: await file.read(),
  };
}

async function selectVideoFile() {
  const file = await localFileSystem.getFileForOpening({
    allowMultiple: false,
    types: ["mp4"],
  });

  if (!file) {
    return null;
  }

  return {
    entry: file,
    name: file.name,
    nativePath: localFileSystem.getNativePath(file),
  };
}

module.exports = { selectJsonFile, selectVideoFile };
