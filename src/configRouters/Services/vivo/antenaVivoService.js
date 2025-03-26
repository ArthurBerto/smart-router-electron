const { ipcMain } = require("electron");
const { escreverTxt } = require("../../utils/escreverTxt");
const refresh = require("../../utils/refreshPage");

/**
 * Tem a função de alterar para antena externa do roteador
 * @param {string} page Aba do navegador que utliza a biblioteca Playwright
 */

const antena = async (page) => {

  const url = "http://10.200.0.1/systems_antenna_settings.asp";

  await refresh(page, url);

  const iframe = page.frameLocator("#main_frame");

  await iframe.locator('select[id="sys_antenna"]').selectOption("Externa");

  await page.click('td[id="apply_btn"]');
  await page.waitForTimeout(5000);
  ipcMain.emit("enviar-log", null, "Ajustado para antena externa");
  escreverTxt("Ajustado para antena externa");
  return;
};

module.exports = { antena };
