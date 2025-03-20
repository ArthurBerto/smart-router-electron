const frm = document.getElementById("config-form");
const mensagem = document.getElementById("mensagem");

frm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const loja = document.getElementById("inLoja").value;
  const modelo = document.getElementById("inModelo").value;

  mensagem.innerText = `Configuração iniciada para a LJ${loja} com o modelo ${modelo}.`;

  // Manda via API qual o modelo de roteador deve ser executado
  setTimeout(() => {
    api.configurarRoteador(modelo, loja);
  }, 3000);
});
