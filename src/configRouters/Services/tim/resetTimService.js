const { ipcMain } = require("electron");
const { escreverTxt } = require("../../utils/escreverTxt");
const refresh = require("../../utils/refreshPage");

/**
 * Tem a função de resetar o roteador para as configurações de fábrica
 * @param {string} page Aba do navegador que utliza a biblioteca Playwright
 */

const reset = async (page) => {
  const url = "http://10.200.0.1/system/restoreDefaults.html";

  await refresh(page, url);

  await page.locator('input[id="system_restore_defaults"]').click();
  await page.keyboard.press("Enter");

  ipcMain.emit(
    "enviar-log",
    null,
    "Aguarde 60 segundos para o reset das configurações de fábrica"
  );
  escreverTxt("Aguarde 60 segundos para o reset das configurações de fábrica");
  await page.waitForTimeout(60000);

  await page.keyboard.press("Enter");

  return;
};

module.exports = { reset };
