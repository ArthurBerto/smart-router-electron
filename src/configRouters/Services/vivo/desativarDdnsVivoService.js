const { ipcMain } = require("electron");
const { escreverTxt } = require("../../utils/escreverTxt");
const refresh = require("../../utils/refreshPage");

/**
 * Tem a função de desativar as configurações de DDNS do roteador
 * @param {string} page Aba do navegador que utliza a biblioteca Playwright
 *
 */

const desativarDDNS = async (page) => {

  const url = "http://10.200.0.1/settings_ddns.asp";

  await refresh(page, url);

  const iframe = page.frameLocator("#main_frame");
  await iframe.locator('input[id="DDNSEnable"]').uncheck();
  await page.click('td[id="apply_btn"]');
  await page.waitForTimeout(2000);
  ipcMain.emit("enviar-log", null, `Desativado o DDNS`);
  escreverTxt("Desativado o DDNS");
  return;
};

module.exports = { desativarDDNS };
