const statusText = document.querySelector("#status");
const testButton = document.querySelector("#test-button");

testButton.addEventListener("click", () => {
  statusText.textContent = "Teste concluído: o painel está respondendo.";
});
