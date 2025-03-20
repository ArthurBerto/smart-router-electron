const { ipcMain } = require("electron");

/**
 * Tem a função de alterar o SSID do roteador e sua senha de acesso a rede WI-FI
 * @param {string} page Aba do navegador que utliza a biblioteca Playwright
 * @param {string} loja Número da loja para alterar o SSID
 */

const alterarSSID = async (page, loja) => {

  await page.goto("http://192.168.1.1/wifi/wifi_settings.html", {
    waitUntil: "domcontentloaded",
  });

  await page.fill('input[id="SSID_name"]', `LIVE_TIM_${loja}`); // Altera o nome da rede WI-FI
  await page.fill('input[id="SSID_password"]', `@raujo#2022`); // Altera a senha
  await page.click('input[value="Salvar"]'); // Salva as configurações
  ipcMain.emit("enviar-log", null, "Aguarde 15 seg para sincronizar os dados...");
  await page.waitForTimeout(17000); // Aguarda 17 seg para salvar
  await page.keyboard.press("Enter"); // Pressiona enter para fechar o pop-up
  ipcMain.emit("enviar-log", null, "SSID e Senha de acesso alterada!");
  return
};

module.exports = { alterarSSID }
