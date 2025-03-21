const { ipcMain } = require("electron");

/**
 * Tem a função de desativar as configurações de DDNS do roteador
 * @param {string} page Aba do navegador que utliza a biblioteca Playwright
 *
 */

const desativarDDNS = async (page) => {
  await page.goto("http://10.200.0.1/settings_ddns.asp", {
    waitUntil: "domcontentloaded",
    timeout: 10000, // 10 segundos para garantir tempo suficiente
  });
  const iframe = page.frameLocator("#main_frame");
  await iframe.locator('input[id="DDNSEnable"]').uncheck();
  await page.click('td[id="apply_btn"]');
  await page.waitForTimeout(2000);
  ipcMain.emit("enviar-log", null, `Desativado o DDNS`);
  return;
};

module.exports = { desativarDDNS };
