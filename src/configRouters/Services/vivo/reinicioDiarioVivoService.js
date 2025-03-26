const { ipcMain } = require("electron");
const { escreverTxt } = require("../../utils/escreverTxt");
const refresh = require("../../utils/refreshPage");

/**
 * Tem a função de alterar as configuraçõs de reinicio diário do navegador
 * @param {string} page Aba do navegador que utliza a biblioteca Playwright
 */

const reiniciarConexao = async (page) => {

  const url = "http://10.200.0.1/systems_connection_reset.asp";

  await refresh(page, url);

  const iframe = page.frameLocator("#main_frame");

  await iframe.locator('select[id="hour_start"]').selectOption("2");
  await iframe.locator('select[id="hour_end"]').selectOption("3");
  await iframe.locator('input[value="daily"]').check();

  await page.click('td[id="apply_btn"]');
  ipcMain.emit(
    "enviar-log",
    null,
    "Aplicado configurações para Reiniciar conexões"
  );
  escreverTxt("Aplicado configurações para Reiniciar conexões");
  return;
};

module.exports = { reiniciarConexao };
