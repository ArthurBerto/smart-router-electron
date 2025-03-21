const { ipcMain } = require("electron");

/**
 * Tem a função de alterar as configurações de DDNS do roteador
 * @param {string} page Aba do navegador que utliza a biblioteca Playwright
 * @param {string} loja Número da filial para configuração
 */

const configDDNS = async (page, loja) => {

  await page.goto("http://192.168.1.1/settings/security_ddns.html", {
    waitUntil: "domcontentloaded",
  });

  await page.locator('input[id="ddnsEnable_on"]').check(); // Marca a checkbox
  await page.locator('select[id="ddns_server_pref"]').selectOption("Dhs"); // Seleciona a opção Dhs
  await page.fill(
    'input[id="ddns_domain_name"]',
    `lj${loja}-4g.fortiddns.com` // Preenche com o número da loja
  );
  await page.fill('input[id="ddns_username"]', `a`); // Preenche com um valor qualquer
  await page.fill('input[id="ddns_password"]', `a`); // Preenche com um valor qualquer
  await page.click('input[value="Salvar"]'); // Salva as configurações

  await page.waitForTimeout(2000); // Aguarda 2 seg após salvar
  ipcMain.emit("enviar-log", null, `Configurações de DDNS ajustadas para lj${loja}-4g.fortiddns.com!`);
  return
};

module.exports = { configDDNS }
