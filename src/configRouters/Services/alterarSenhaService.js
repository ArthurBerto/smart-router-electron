const { ipcMain } = require("electron");

/**
 * Tem a função de alterar a senha do roteador
 * @param {string} page Aba do navegador que utliza a biblioteca Playwright
 * @param {string} senhaAntiga Senha antiga do usuário
 * @param {string} senhaNova Senha nova do usuário
 */

const alterarSenha = async (page, senhaAntiga, senhaNova) => {
  await page.goto("http://10.200.0.1/system/modifyPassword.html", {
    waitUntil: "domcontentloaded",
  });

  await page.fill(
    'input[id="system_modify_password_old_password"]',
    senhaAntiga
  ); // Preenche com a senha antiga
  await page.fill('input[id="system_modify_password_new_password"]', senhaNova); // Preenche com a senha nova
  await page.fill(
    'input[id="system_modify_password_confirm_password"]',
    senhaNova
  ); // Confirma a senha antiga

  await page.click('input[id="system_modify_password_submit"]'); // Salva a configuração
  ipcMain.emit("enviar-log", null, "Senha alterada conforme o 'Key Pass'.");
  await page.waitForTimeout(2000); // Aguarda 2 seg para não prejudicar as configurações
  return
};

module.exports = { alterarSenha }
