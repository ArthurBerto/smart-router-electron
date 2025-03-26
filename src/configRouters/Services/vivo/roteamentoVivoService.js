const { ipcMain } = require("electron");
const { escreverTxt } = require("../../utils/escreverTxt");
const refresh = require("../../utils/refreshPage");

/**
 * Tem a função de ativar as configurações de roteamento estatico
 * @param {string} page Aba do navegador que utliza a biblioteca Playwright
 */

const roteamentoEstatico = async (page) => {

  const url = "http://10.200.0.1/settings_static_routing.asp";

  await refresh(page, url);

  const iframe = page.frameLocator("#main_frame");

  await page.click('td[id="add_btn"]');
  await page.click('td[id="add_btn"]');

  await iframe.locator('select[id="IF_0"]').selectOption("LAN");
  await iframe.locator('input[id="D_IP0_1"]').fill("172");
  await iframe.locator('input[id="D_IP0_2"]').fill("16");
  await iframe.locator('input[id="D_IP0_3"]').fill("0");
  await iframe.locator('input[id="D_IP0_4"]').fill("0");

  await iframe.locator('input[id="MASK0_1"]').fill("255");
  await iframe.locator('input[id="MASK0_2"]').fill("240");
  await iframe.locator('input[id="MASK0_3"]').fill("0");
  await iframe.locator('input[id="MASK0_4"]').fill("0");

  await iframe.locator('input[id="GW0_4"]').fill("2");

  await iframe.locator('select[id="IF_1"]').selectOption("LAN");
  await iframe.locator('input[id="D_IP1_1"]').fill("192");
  await iframe.locator('input[id="D_IP1_2"]').fill("168");
  await iframe.locator('input[id="D_IP1_3"]').fill("0");
  await iframe.locator('input[id="D_IP1_4"]').fill("0");

  await iframe.locator('input[id="MASK1_1"]').fill("255");
  await iframe.locator('input[id="MASK1_2"]').fill("255");
  await iframe.locator('input[id="MASK1_3"]').fill("0");
  await iframe.locator('input[id="MASK1_4"]').fill("0");

  await iframe.locator('input[id="GW1_4"]').fill("2");

  await page.click('td[id="apply_btn"]');
  // Espera 2 seg
  await page.waitForTimeout(2000);
  ipcMain.emit(
    "enviar-log",
    null,
    "Ativado e configurado opções de Roteamento Estático"
  );
  escreverTxt("Ativado e configurado opções de Roteamento Estático");
  return;
};

module.exports = { roteamentoEstatico };
