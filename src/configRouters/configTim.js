const { ipcMain } = require("electron");
const { chromium } = require("playwright");

const { fazerLogin } = require("./Services/tim/loginService.js");
const { alterarSSID } = require("./Services/tim/ssidService.js");
const { alterarConfigAPN } = require("./Services/tim/configApnService.js");
const { ativarDMZ } = require("./Services/tim/ativarDmzService.js");
const { configDDNS } = require("./Services/tim/ddnsService.js");
const { alterarDHCP } = require("./Services/tim/dhcpService.js");
const { estatistica } = require("./Services/tim/estatisticaService.js");
const { antena } = require("./Services/tim/alterarAntenaService.js");
const { alterarSenha } = require("./Services/tim/alterarSenhaService.js");
const { desabilitarHorarioVerao } = require("./Services/tim/horarioVeraoService.js");
const { agendamentoDiario } = require("./Services/tim/reinicioDiarioService.js");

const scriptTim = async (loja) => {
  // Inicializando as variáveis
  const roteadorIP = "http://192.168.1.1/normal";
  const usuario = "livetim";
  const senha = "L1vt1m";
  const novaSenha = "@LiveTim#2023";
  const novoIP = "http://10.200.0.1/normal";

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
      ipcMain.emit("enviar-log", null, "Interface gráfica carregada!");
    } catch (err) {
      ipcMain.emit(
        "enviar-log",
        null,
        `ERRO: Não foi possível carregar '${roteadorIP}', verifique se a Tim Box está com as configurações de fábrica ou com o cabo de rede conectado.`
      );
      await navegador.close();
    }

    await fazerLogin(page, usuario, senha); // Função que realiza o login
    await alterarSSID(page, loja); // Função que altera o SSID e senha de acesso
    await alterarConfigAPN(page); // Função que altera as configs de APN
    await ativarDMZ(page); // Função que ativa as configurações de DMZ
    await configDDNS(page, loja); // Função que altera as configurações de DDNS
    await alterarDHCP(page); // Função que altera as configurações de DHCP

    await page.goto(novoIP, { waitUntil: "domcontentloaded" }); // Entra no novo IP configurado no DHCP
    await fazerLogin(page, usuario, senha); // Realiza um novo login
    await estatistica(page); // Função que altera os planos de dados
    await antena(page); // Função que altera para antena externa
    await alterarSenha(page, senha, novaSenha); // Função para alterar a senha

    await page.goto(novoIP, { waitUntil: "domcontentloaded" }); // Entra no novo IP configurado no DHCP
    await fazerLogin(page, usuario, novaSenha); // Realiza um novo login
    await desabilitarHorarioVerao(page); // Desabilita a opção de horário de verão
    await agendamentoDiario(page); // Aplica as configurações para reiniciar conexões
  } catch (err) {
    ipcMain.emit("enviar-log", null, `ERRO: ${err}`);
  } finally {
    await navegador.close();
    ipcMain.emit("enviar-log", null, "FIM DA CONFIGURAÇÃO!");
    return;
  }
};

module.exports = { scriptTim };
