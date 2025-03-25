const voltar = document.querySelector("#btnVoltar");

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
  window.api.receberLogs((mensagem) => {
    escreverLogs(mensagem);
    if (mensagem === "Fim da configuração, roteador pronto para ser enviado!" || mensagem === "ERRO: Verifique sua conexão com o roteador. Tente novamente!") {
      const voltar = document.querySelector("#btnVoltar");
      voltar.classList.remove("hidden");
    }
  });
});
