const { ipcMain } = require("electron");
const { chromium } = require("playwright");

const { fazerLogin } = require("./Services/vivo/fazerLoginVivoService.js");
const { alterarSenha } = require("./Services/vivo/alterarSenhaVivoService.js");
const { alterarSSID } = require("./Services/vivo/ssidServiceVivo.js");
const { gerenciamentoPerfil } = require("./Services/vivo/gereciamentoPerfilVivoService.js");
const { configRedeLocal } = require("./Services/vivo/configRedeLocalVivoService.js");
const { configFirewall } = require("./Services/vivo/configFirewallVivoService.js");
const { roteamentoEstatico } = require("./Services/vivo/roteamentoVivoService.js");
const { ativarDMZ } = require("./Services/vivo/ativarDmzVivoService.js");
const { configDDNS } = require("./Services/vivo/ddnsVivoService.js");
const { desativarDDNS } = require("./Services/vivo/desativarDdnsVivoService.js");
const { reiniciarConexao } = require("./Services/vivo/reinicioDiarioVivoService.js");
const { antena } = require("./Services/vivo/antenaVivoService.js");
const { planoDados } = require("./Services/vivo/planoDadosVivoService.js");
const { escreverTxt } = require("./utils/escreverTxt.js");
const { operacaoTicket } = require("../tickets/index.js");
const { reset } = require("./Services/vivo/resetVivoService.js");
const { acessarRoteador } = require("./utils/acessoRoteador.js");


const scriptVivo = async (modelo, loja) => {
  // Inicializando as variáveis
  const roteadorIP = "http://192.168.1.1/login.asp";
  const usuario = "admin";
  const senha = "vivo";
  const novaSenha = "@VivoBox#2022";
  const novoIP = "http://10.200.0.1/login.asp";

  // Abrindo o navegador chrome com o uso da biblioteca playwright
  const navegador = await chromium.launch({
    headless: true,
    slowMo: 500,
  });

  // Abrindo uma nova página no navegador
  const page = await navegador.newPage();

  ipcMain.emit("enviar-log", null, "Inciando processo de configuração");
  escreverTxt("Inciando processo de configuração")

  try {

    let ipEscolhido = null;

    if (await acessarRoteador(page, roteadorIP)) { // Tenta conectar no 192.168.1.1
      ipEscolhido = roteadorIP;
    } else if (await acessarRoteador(page, novoIP)) { // Se não der certo, conecata a 10.200.0.1
      ipEscolhido = novoIP;
      await fazerLogin(page, usuario, senha, novaSenha);
      await reset(page)
    } else { // Em caso de 2 erros, o programa finaliza
      await navegador.close()
      ipcMain.emit("enviar-log", null, "ERRO: Verifique sua conexão com o roteador. Tente novamente!");
      return;
    }

    await fazerLogin(page, usuario, senha, novaSenha);

    await alterarSSID(page, loja);
    await gerenciamentoPerfil(page);
    await configRedeLocal(page);

    await page.goto(novoIP, { waitUntil: "load" });
    await fazerLogin(page, usuario, senha, novaSenha);
    await configFirewall(page);
    await roteamentoEstatico(page);
    await ativarDMZ(page);
    await configDDNS(page, loja);
    await reiniciarConexao(page);
    await antena(page);
    await planoDados(page);
    await desativarDDNS(page);
    await alterarSenha(page, senha, novaSenha);

    ipcMain.emit("enviar-log", null, "Fim do fluxo de configuração!");
    escreverTxt("Fim do fluxo de configuração!");

    await navegador.close();
    
    await operacaoTicket(modelo, loja);
  } catch (err) {
    console.log(err)
    await navegador.close();
    ipcMain.emit("enviar-log", null, `ERRO: Verifique sua conexão com o roteador. Tente novamente!`);
  }
};

module.exports = { scriptVivo };
