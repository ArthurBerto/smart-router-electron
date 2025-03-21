const { ipcMain } = require("electron");

/**
 * Tem a função de alterar as configurações de DDNS do roteador
 * @param {string} page Aba do navegador que utliza a biblioteca Playwright
 * @param {string} loja Número da filial para configuração
 */

const configDDNS = async (page, loja) => {
  await page.goto("http://10.200.0.1/settings_ddns.asp", {
    waitUntil: "domcontentloaded",
  });
  const iframe = page.frameLocator("#main_frame");

  await iframe.locator('input[id="DDNSEnable"]').check();
  await iframe.locator('select[id="DDNSSrvProvider"]').selectOption("duckdns");
  await iframe.locator('input[id="ddns_token"]').type("qualquer");
  await iframe
    .locator('input[id="DDNSDomainname"]')
    .fill(`lj${loja}-4g.fortiddns.com`);

  await page.click('td[id="apply_btn"]');
  ipcMain.emit(
    "enviar-log",
    null,
    `Configurações de DDNS ajustadas para lj${loja}-4g.fortiddns.com!`
  );
  // Espera 10 seg
  await page.waitForTimeout(10000);
  return;
};

module.exports = { configDDNS };
