const { selectJsonFile } = require("./src/infrastructure/file-picker");
const { parseCutsJson } = require("./src/domain/cuts-parser");

const elements = {
  selectButton: document.querySelector("#select-json-button"),
  status: document.querySelector("#status"),
  summary: document.querySelector("#summary"),
  fileName: document.querySelector("#json-file-name"),
  projectName: document.querySelector("#project-name"),
  cutsCount: document.querySelector("#cuts-count"),
  cutsList: document.querySelector("#cuts-list"),
  errors: document.querySelector("#errors"),
  errorsList: document.querySelector("#errors-list"),
};

function replaceListItems(list, values) {
  while (list.firstChild) {
    list.removeChild(list.firstChild);
  }
  values.forEach((value) => {
    const item = document.createElement("li");
    item.textContent = value;
    list.appendChild(item);
  });
}

function formatDuration(seconds) {
  return `${seconds.toFixed(3)} s`;
}

function showSummary(fileName, result) {
  elements.fileName.textContent = fileName;
  elements.projectName.textContent = result.projectName;
  elements.cutsCount.textContent = String(result.cuts.length);
  replaceListItems(
    elements.cutsList,
    result.cuts.map(
      (cut) =>
        `${cut.id} — ${cut.name}: ${cut.startText} até ${cut.endText} ` +
        `(${formatDuration(cut.durationSeconds)})`,
    ),
  );
  elements.errors.hidden = true;
  elements.summary.hidden = false;
  elements.status.textContent = "JSON válido e pronto para a próxima etapa.";
}

function showErrors(fileName, errors) {
  replaceListItems(elements.errorsList, errors);
  elements.summary.hidden = true;
  elements.errors.hidden = false;
  elements.status.textContent = `Não foi possível validar ${fileName}.`;
}

async function handleJsonSelection() {
  elements.selectButton.disabled = true;

  try {
    const selectedFile = await selectJsonFile();
    if (!selectedFile) {
      return;
    }

    const result = parseCutsJson(selectedFile.text);
    if (result.errors.length > 0) {
      showErrors(selectedFile.name, result.errors);
      return;
    }

    showSummary(selectedFile.name, result);
  } catch (error) {
    console.error("Falha ao selecionar ou ler o JSON.", error);
    showErrors("o arquivo selecionado", [
      "Não foi possível abrir ou ler o arquivo JSON.",
    ]);
  } finally {
    elements.selectButton.disabled = false;
  }
}

elements.selectButton.addEventListener("click", handleJsonSelection);
