const { ipcMain } = require("electron");
const { escreverTxt } = require("../../utils/escreverTxt");
const refresh = require("../../utils/refreshPage");

/**
 * Tem a função de resetar o roteador para as configurações de fábrica
 * @param {string} page Aba do navegador que utliza a biblioteca Playwright
 */

const reset = async (page) => {

  const url = "http://10.200.0.1/systems_restore_settings.asp";

  await refresh(page, url);

  const iframe = page.frameLocator("#main_frame");

  await iframe.locator('div[id="reset"]').click();
  await page.keyboard.press("Enter");

  ipcMain.emit("enviar-log", null, "Aguarde 90 segundos para o reset das configurações de fábrica");
  escreverTxt("Aguarde 90 segundos para o reset das configurações de fábrica");
  await page.waitForTimeout(90000);
  
  return;
};

module.exports = { reset };
