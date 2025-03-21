const { ipcMain } = require("electron");
const { escreverTxt } = require("../../utils/escreverTxt");

/**
 * Tem a função de alterar o SSID do roteador e sua senha de acesso a rede WI-FI
 * @param {string} page Aba do navegador que utliza a biblioteca Playwright
 * @param {string} loja Número da loja para alterar o SSID
 */

const alterarSSID = async (page, loja) => {
  await page.goto("http://192.168.1.1/wifi_basic.asp", {
    waitUntil: "domcontentloaded",
  });

  const iframe = page.frameLocator("#main_frame");
  await iframe
    .locator('input[name="wifi_iface0_ssid"]')
    .fill(`Vivo-Box-${loja}`); // Altera o nome da rede WI-FI
  await iframe.locator('input[name="wifi_iface0_key_psk"]').fill("@raujo#2022"); // Altera a senha
  await page.click('td[id="apply_btn"]'); // Salva as configurações
  await page.keyboard.press("Enter");
  await page.waitForTimeout(20000);
  ipcMain.emit("enviar-log", null, "SSID e Senha de acesso alterada!");
  escreverTxt("SSID e Senha de acesso alterada!");
  return;
};

module.exports = { alterarSSID };
