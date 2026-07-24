const { validateCutsDocument } = require("./cuts-validator");

const MAX_JSON_CHARACTERS = 5_000_000;

function parseCutsJson(text) {
  if (typeof text !== "string") {
    return {
      projectName: "",
      cuts: [],
      errors: ["O conteúdo do arquivo JSON deve ser texto."],
    };
  }

  if (text.length > MAX_JSON_CHARACTERS) {
    return {
      projectName: "",
      cuts: [],
      errors: ["O arquivo JSON excede o limite de 5 milhões de caracteres."],
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
