const { ipcMain } = require("electron");
const { escreverTxt } = require("./escreverTxt");

/**
 * Tem a função de acessar o roteador no ip de configuração
 * @param {string} page Aba do navegador que utliza a biblioteca Playwright
 * @param {string} ip Endereço ip que será conectado
 */

const acessarRoteador = async (page, ip) => {
  try {
    ipcMain.emit(
      "enviar-log",
      null,
      `Tentando acessar o roteador pela url ${ip}`
    );
    escreverTxt(`Tentando acessar o roteador pela url ${ip}`);
    await page.waitForTimeout(2000);
    await page.goto(ip, {
      waitUntil: "load",
      timeout: 10000,
    });

    ipcMain.emit("enviar-log", null, "Interface wer carregada!");
    escreverTxt("Interface web carregada");

    return true; // Se a conexão for bem sucedida, retorna true
  } catch {
    ipcMain.emit("enviar-log", null, `Falha ao acessar a url ${ip}`);
    return false; // Se a conexão falhar, retorna false
  }
};

module.exports = { acessarRoteador };
