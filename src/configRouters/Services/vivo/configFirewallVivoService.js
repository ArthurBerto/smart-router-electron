const { ipcMain } = require("electron");
const { escreverTxt } = require("../../utils/escreverTxt");
const refresh = require("../../utils/refreshPage");

/**
 * Tem a função de ativar as configurações de gerenciamento remoto
 * @param {string} page Aba do navegador que utliza a biblioteca Playwright
 */

const configFirewall = async (page) => {

  const url = "http://10.200.0.1/settings_firewall.asp";

  await refresh(page, url);

  const iframe = page.frameLocator("#main_frame");

  await iframe.locator('input[id="checkbox2"]').check();
  await page.click('td[id="apply_btn"]');
  // Espera 1 seg
  await page.waitForTimeout(1000);
  ipcMain.emit("enviar-log", null, "Ativado gerenciamento remoto da Web");
  escreverTxt("Ativado gerenciamento remoto da Web");
  return;
};

module.exports = { configFirewall };
