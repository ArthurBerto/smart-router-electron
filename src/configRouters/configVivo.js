const { ipcMain } = require("electron");
const { chromium } = require("playwright");

const { fazerLogin } = require("./Services/vivo/loginVivoService.js");
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


const scriptVivo = async (modelo, loja) => {
  // Inicializando as variáveis
  const roteadorIP = "http://192.168.1.1/login.asp";
  const usuario = "admin";
  const senha = "vivo";
  const novaSenha = "@VivoBox#2022";
  const novoIP = "http://10.200.0.1/login.asp";

  // Abrindo o navegador chrome com o uso da biblioteca playwright
  const navegador = await chromium.launch({
    headless: false,
    slowMo: 500,
  });

  // Abrindo uma nova página no navegador
  const page = await navegador.newPage();

  ipcMain.emit("enviar-log", null, "INÍCIO DA CONFIGURAÇÃO");
  escreverTxt("INÍCIO DA CONFIGURAÇÃO")

  try {
    ipcMain.emit("enviar-log", null, "Acessando o roteador pelo ip 192.168.1.1");
    escreverTxt("Acessando o roteador pelo ip 192.168.1.1")

    try {
      // Tenta logar no 192.168.1.1
      await page.goto(roteadorIP, {
        waitUntil: "load",
        timeout: 10000,
      });
      ipcMain.emit("enviar-log", null, "Interface web carregada!");
      escreverTxt("Interface web carregada!")
    } catch (err) {
      // Se não conseguir, tenta logar no 10.200.0.1
      try {
        ipcMain.emit("enviar-log", null, "Falha de acesso! Acessando o roteador pelo ip 10.200.0.1");
        escreverTxt("Falha de acesso! Acessando o roteador pelo ip 10.200.0.1")
        await page.goto(novoIP, {
        waitUntil: "load",
        timeout: 10000,
        });
        ipcMain.emit("enviar-log", null, "Interface web carregada!");
        escreverTxt("Interface web carregada!")

        await fazerLogin(page, usuario, senha, novaSenha);
        await reset(page)

        await page.goto(roteadorIP, {
          waitUntil: "load",
          timeout: 10000,
        });

      } catch (err) {
        // Erro caso os dois ip's não conectem
        ipcMain.emit("enviar-log", null, "ERRO: Verifique sua conexão com o roteador. Finalize o programa e tente novamente!");
        return
      }
    }


    await fazerLogin(page, usuario, senha, novaSenha);
    // await alterarSenha(page, senha, novaSenha); <------

    //await fazerLogin(page, usuario, novaSenha); <------
    await alterarSSID(page, loja);
    await gerenciamentoPerfil(page);
    await configRedeLocal(page);

    await page.goto(novoIP, { waitUntil: "load" });
    // await fazerLogin(page, usuario, novaSenha); <------
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

    // await criarChamado(modelo, loja);
  } catch (err) {
    console.log(err)
    ipcMain.emit("enviar-log", null, `ERRO: Reinicie o processo de configuração!`);
  } finally {
    await navegador.close();
    ipcMain.emit("enviar-log", null, "FIM DA CONFIGURAÇÃO!");
    escreverTxt("FIM DA CONFIGURAÇÃO!");
    // await operacaoTicket(modelo, loja);
    return;
  }
};

module.exports = { scriptVivo };
