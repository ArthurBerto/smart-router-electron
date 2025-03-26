const { ipcMain } = require("electron");
const refresh = require("../../utils/refreshPage");
const { escreverTxt } = require("../../utils/escreverTxt");

/**
 * Tem a função de alterar as configurações de APN do roteador
 * @param {string} page Aba do navegador que utliza a biblioteca Playwright
 */

const alterarConfigAPN = async (page) => {

  const url = "http://192.168.1.1/settings/dialup_apn.html"

  await refresh(page, url)

  await page.click('input[value="Novo perfil"]'); // Cria um novo perfil
  await page.locator('input[id="profile_name_dialog"]').type(`TIM2`);
  await page.locator('select[id="auth_type_dialog"]').selectOption("PAP");
  await page.locator('input[id="apn_user_name_dialog"]').type(`tim`);
  await page.locator('input[id="apn_password_dialog"]').type(`tim`);
  await page.locator('input[id="apn_name_dialog"]').type(`timbrasil.br`);
  await page.click('input[id="dailup_save"]'); // Salva as configurações do novo perfil
  await page.waitForTimeout(2000); // Aguarda 2 seg para salvar as configurações
  await page.click('input[id="dailup_submit"]'); // Salva novamente
  await page.waitForTimeout(2000); // Aguarda 2 seg para salvar as configurações
  ipcMain.emit("enviar-log", null, "Parâmetros de APN alterados");
  escreverTxt("Parâmetros de APN alterados");
  return
};

module.exports = { alterarConfigAPN }