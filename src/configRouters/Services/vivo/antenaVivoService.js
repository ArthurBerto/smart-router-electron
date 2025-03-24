const { ipcMain } = require("electron");
const { escreverTxt } = require("../../utils/escreverTxt");

/**
 * Tem a função de alterar para antena externa do roteador
 * @param {string} page Aba do navegador que utliza a biblioteca Playwright
 */

const antena = async (page) => {
  await page.goto("http://10.200.0.1/systems_antenna_settings.asp", {
    waitUntil: "load",
  });

  const iframe = page.frameLocator("#main_frame");

  await iframe.locator('select[id="sys_antenna"]').selectOption("Externa");

  await page.click('td[id="apply_btn"]');
  ipcMain.emit("enviar-log", null, "Ajustado para antena externa");
  escreverTxt("Ajustado para antena externa");
  return;
};

module.exports = { antena };
