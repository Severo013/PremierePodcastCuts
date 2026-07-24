const { validateCutsDocument } = require("./cuts-validator");

function parseCutsJson(text) {
  if (typeof text !== "string") {
    return {
      projectName: "",
      cuts: [],
      errors: ["O conteúdo do arquivo JSON deve ser texto."],
    };
  }

  let document;
  try {
    document = JSON.parse(text);
  } catch {
    return {
      projectName: "",
      cuts: [],
      errors: ["O arquivo não contém um JSON válido. Verifique a sintaxe."],
    };
  }

  return validateCutsDocument(document);
}

module.exports = { parseCutsJson };
