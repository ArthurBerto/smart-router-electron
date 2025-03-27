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
const { escreverTxt } = require("./utils/escreverTxt.js");
const { operacaoTicket } = require("../tickets/index.js");
const { reset } = require("./Services/tim/resetTimService.js");
const { acessarRoteador } = require("./utils/acessoRoteador.js");
const refresh = require("./utils/refreshPage.js");

const scriptTim = async (modelo, loja, operador) => {
  // Inicializando as variáveis
  const roteadorIP = "http://192.168.1.1/normal";
  const usuario = "livetim";
  const senha = "L1vt1m";
  const novaSenha = "@LiveTim#2023";
  const novoIP = "http://10.200.0.1/normal";

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
      await reset(page);
    } else { // Em caso de 2 erros, o programa finaliza
      await navegador.close()
      ipcMain.emit("enviar-log", null, "ERRO: Verifique sua conexão com o roteador. Tente novamente!");
      return;
    }

    await refresh(page, roteadorIP);
    //await page.goto(roteadorIP, { waitUntil: "load" }); // Entra no novo IP configurado no DHCP
    await fazerLogin(page, usuario, senha, novaSenha); // Função que realiza o login
    await alterarSSID(page, loja); // Função que altera o SSID e senha de acesso
    await alterarConfigAPN(page); // Função que altera as configs de APN
    await ativarDMZ(page); // Função que ativa as configurações de DMZ
    await configDDNS(page, loja); // Função que altera as configurações de DDNS
    await alterarDHCP(page); // Função que altera as configurações de DHCP

    await refresh(page, novoIP);
    //await page.goto(novoIP, { waitUntil: "load" }); // Entra no novo IP configurado no DHCP
    await fazerLogin(page, usuario, senha, novaSenha); // Realiza um novo login
    await estatistica(page); // Função que altera os planos de dados
    await antena(page); // Função que altera para antena externa
    await alterarSenha(page, senha, novaSenha); // Função para alterar a senha

    await refresh(page, novoIP);
    //await page.goto(novoIP, { waitUntil: "load" }); // Entra no novo IP configurado no DHCP
    await fazerLogin(page, usuario, senha, novaSenha); // Realiza um novo login
    await desabilitarHorarioVerao(page); // Desabilita a opção de horário de verão
    await agendamentoDiario(page); // Aplica as configurações para reiniciar conexões
  
    ipcMain.emit("enviar-log", null, "Fim do fluxo de configuração!");
    escreverTxt("Fim do fluxo de configuração!");
    
    await navegador.close();

    await operacaoTicket(modelo, loja, operador);
  } catch (err) {
    console.log(err)
    await navegador.close();
    ipcMain.emit("enviar-log", null, `ERRO: Verifique sua conexão com o roteador. Tente novamente!`);
  }
};

module.exports = { scriptTim };
