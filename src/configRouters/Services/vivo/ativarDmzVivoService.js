const { ipcMain } = require("electron");

/**
 * Tem a função de ativar as configurações de DMZ do roteador
 * @param {string} page Aba do navegador que utliza a biblioteca Playwright
 */

const ativarDMZ = async (page) => {
  await page.goto("http://10.200.0.1/settings_dmz.asp", {
    waitUntil: "domcontentloaded",
  });
  const iframe = page.frameLocator("#main_frame");

  await iframe.locator('input[id="sys_dmz"]').check();
  await iframe.locator('input[id="ui_dmz_ip"]').fill("2");

  await page.click('td[id="apply_btn"]');
  ipcMain.emit("enviar-log", null, "Ativado DMZ");
  return;
};

module.exports = { ativarDMZ };
