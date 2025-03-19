document.addEventListener("DOMContentLoaded", () => {
  const log = document.getElementById("logs");

  if (!log) {
    console.error("Elemento #logs não encontrado!");
    return;
  }

  // Função para exibir logs na tela
  const escreverLogs = (mensagem) => {
    const dataHora = new Date().toLocaleString();
    log.innerHTML += `[${dataHora}] ${mensagem} <br>`;
  };

  // Escuta mensagens do Main Process
  window.api.receberLogs( async (mensagem) => {
    await escreverLogs(mensagem);
  });
});
