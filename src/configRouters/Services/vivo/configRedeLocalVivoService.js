const { ipcMain } = require("electron");
const { escreverTxt } = require("../../utils/escreverTxt");

/**
 * Tem a função de alterar as configurações de DHCP do roteador
 * @param {string} page Aba do navegador que utliza a biblioteca Playwright
 */

const configRedeLocal = async (page) => {
  await page.goto("http://192.168.1.1/settings_lan_setup.asp", {
    waitUntil: "domcontentloaded",
  });

  const iframe = page.frameLocator("#main_frame");
  await iframe.locator('input[id="DHCPSer_ipaddr_1"]').fill("10");
  await iframe.locator('input[id="DHCPSer_ipaddr_2"]').fill("200");
  await iframe.locator('input[id="DHCPSer_ipaddr_3"]').fill("0");
  await iframe.locator('input[id="DHCPSer_ipaddr_4"]').fill("1");

  await iframe.locator('input[id="DHCPSer_Str_ipaddr_4"]').fill("50");
  await iframe.locator('input[id="DHCPSer_End_ipaddr_4"]').fill("55");
  await page.click('td[id="apply_btn"]');
  await page.keyboard.press("Enter");

  ipcMain.emit(
    "enviar-log",
    null,
    "Alterado ip para 10.200.0.1, aguardando 60 seg para novo acesso..."
  );
  escreverTxt(
    "Alterado ip para 10.200.0.1, aguardando 60 seg para novo acesso..."
  );
  await page.waitForTimeout(65000); // Espera 60 seg para salvar as configurações
  return;
};

module.exports = { configRedeLocal };
