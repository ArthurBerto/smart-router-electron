const frm = document.getElementById("config-form");
const mensagem = document.getElementById("mensagem");

frm.addEventListener("submit", (e) => {
  e.preventDefault();
  const loja = document.getElementById("inLoja").value;
  const modelo = document.getElementById("inModelo").value;

  mensagem.innerText = `Configuração iniciada para a LJ${loja} com o modelo ${modelo}.`;
});
