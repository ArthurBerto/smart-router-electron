const { ipcMain } = require("electron");
const { escreverTxt } = require("../../utils/escreverTxt");

/**
 * Tem a função de alterar a senha do roteador
 * @param {string} page Aba do navegador que utliza a biblioteca Playwright
 * @param {string} senhaAntiga Senha antiga do usuário
 * @param {string} senhaNova Senha nova do usuário
 */

const alterarSenha = async (page, senhaAntiga, senhaNova) => {
  await page.goto("http://10.200.0.1/systems_change_password.asp", {
    waitUntil: "load",
  });

  const iframe = page.frameLocator("#main_frame");
  await iframe.locator('input[name="Old_Passwd"]').fill(senhaAntiga);
  await iframe.locator('input[name="New_Passwd"]').fill(senhaNova);
  await iframe.locator('input[name="Confirm_New_Passwd"]').fill(senhaNova);
  await page.click('td[id="apply_btn"]');
  ipcMain.emit("enviar-log", null, "Senha alterada conforme o 'Key Pass'.");
  escreverTxt("Senha alterada conforme o 'Key Pass'.");
  escreverTxt("Fim do fluxo de configuração!")
  return;
};

module.exports = { alterarSenha };
