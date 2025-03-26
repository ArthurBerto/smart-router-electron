const { ipcMain } = require("electron");
const { escreverTxt } = require("../../utils/escreverTxt");
const refresh = require("../../utils/refreshPage");

/**
 * Tem a função de alterar o plano de dados do roteador
 * @param {string} page Aba do navegador que utliza a biblioteca Playwright
 */

const planoDados = async (page) => {

  const url = "http://10.200.0.1/systems_data_plan.asp";

  await refresh(page, url);

  const iframe = page.frameLocator("#main_frame");

  await iframe.locator('input[value="enable"]').check();
  await iframe.locator('input[id="dp_alert_percent"]').fill("100");
  await iframe.locator('input[id="dp_max_num"]').fill("100");
  await iframe.locator('select[id="dp_max_unit"]').selectOption("GB");

  await page.click('td[id="apply_btn"]');

  ipcMain.emit("enviar-log", null, "Configurado plano de dados para 100GB");
  escreverTxt("Configurado plano de dados para 100GB");
  return;
};

module.exports = { planoDados };
