const { ipcMain } = require("electron");
const { chromium } = require("playwright");

const { fazerLogin } = require("./Services/vivo/loginVivoService.js");
const { alterarSenha } = require("./Services/vivo/alterarSenhaVivoService.js");
const { alterarSSID } = require("./Services/vivo/ssidServiceVivo.js");
const {
  gerenciamentoPerfil,
} = require("./Services/vivo/gereciamentoPerfilVivoService.js");
const {
  configRedeLocal,
} = require("./Services/vivo/configRedeLocalVivoService.js");
const {
  configFirewall,
} = require("./Services/vivo/configFirewallVivoService.js");
const {
  roteamentoEstatico,
} = require("./Services/vivo/roteamentoVivoService.js");
const { ativarDMZ } = require("./Services/vivo/ativarDmzVivoService.js");
const { configDDNS } = require("./Services/vivo/ddnsVivoService.js");
const {
  desativarDDNS,
} = require("./Services/vivo/desativarDdnsVivoService.js");
const {
  reiniciarConexao,
} = require("./Services/vivo/reinicioDiarioVivoService.js");
const { antena } = require("./Services/vivo/antenaVivoService.js");
const { planoDados } = require("./Services/vivo/planoDadosVivoService.js");

const scriptVivo = async (loja) => {
  // Inicializando as variáveis
  const roteadorIP = "http://192.168.1.1";
  const usuario = "admin";
  const senha = "vivo";
  const novaSenha = "@VivoBox#2022";
  const novoIP = "http://10.200.0.1";

  // Abrindo o navegador chrome com o uso da biblioteca playwright
  const navegador = await chromium.launch({
    headless: false,
    slowMo: 500,
  });

  // Abrindo uma nova página no navegador
  const page = await navegador.newPage();

  try {
    ipcMain.emit("enviar-log", null, "Acessando o roteador");
    try {
      await page.goto(roteadorIP, {
        waitUntil: "domcontentloaded",
        timeout: 10000,
      });
      ipcMain.emit("enviar-log", null, "Interface web carregada!");
    } catch (err) {
      ipcMain.emit(
        "enviar-log",
        null,
        `ERRO: Não foi possível carregar '${roteadorIP}', verifique se a Tim Box está com as configurações de fábrica ou com o cabo de rede conectado.`
      );
      await navegador.close();
    }

    await fazerLogin(page, usuario, senha); // Função que realiza o login
    await alterarSenha(page, senha, novaSenha); // Função para alterar a senha

    // Devido a alteração de senha é necessário logar novamente
    await fazerLogin(page, usuario, novaSenha);
    await alterarSSID(page, loja); // Função que altera o SSID e senha de acesso
    await gerenciamentoPerfil(page); // Função que altera as configs de APN
    await configRedeLocal(page); // Função que altera as configurações de DHCP, muda o IP para 10.200.0.1

    await page.goto(novoIP, { waitUntil: "domcontentloaded" });
    await fazerLogin(page, usuario, novaSenha);
    await configFirewall(page);
    await roteamentoEstatico(page);
    await ativarDMZ(page);
    await configDDNS(page, loja);
    await reiniciarConexao(page);
    await antena(page);
    await planoDados(page);
    await desativarDDNS(page);
  } catch (err) {
    ipcMain.emit("enviar-log", null, `ERRO: ${err}`);
  } finally {
    await navegador.close();
    ipcMain.emit("enviar-log", null, "FIM DA CONFIGURAÇÃO!");
    return;
  }
};

module.exports = { scriptVivo };
