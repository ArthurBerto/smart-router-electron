const { ipcMain } = require("electron");
const { escreverTxt } = require("../../utils/escreverTxt");

/**
 * Tem a função de alterar as configurações de APN do roteador
 * @param {string} page Aba do navegador que utliza a biblioteca Playwright
 */

const gerenciamentoPerfil = async (page) => {
  await page.goto("http://192.168.1.1/settings_profile_management.asp", {
    waitUntil: "load",
  });
  const iframe = page.frameLocator("#main_frame");

  await page.click('td[id="add_btn"]'); // Cria um novo perfil

  await iframe.locator('input[id="pdn_profile_name_en"]').fill("");
  await iframe.locator('input[id="pdn_profile_name_en"]').type("VIVO");

  await iframe
    .locator('select[id="pdn_profile_pdp_type"]')
    .selectOption("IPv4");

  await iframe.locator('input[id="pdn_profile_apn_name"]').fill("");
  await iframe
    .locator('input[id="pdn_profile_apn_name"]')
    .type("zap.vivo.com.br");

  await iframe
    .locator('select[id="pdn_profile_auth_type"]')
    .selectOption("PAP");

  await iframe.locator('input[id="pdn_profile_auth_name"]').fill("");
  await iframe.locator('input[id="pdn_profile_auth_name"]').type("vivo");

  await iframe.locator('input[id="pdn_profile_auth_pwd"]').fill("");
  await iframe.locator('input[id="pdn_profile_auth_pwd"]').type("vivo");

  await page.click('td[id="del_btn"]');
  await page.waitForTimeout(20000);
  ipcMain.emit("enviar-log", null, "Parâmetros de APN alterados");
  escreverTxt("Parâmetros de APN alterados");
  return;
};

module.exports = { gerenciamentoPerfil };
