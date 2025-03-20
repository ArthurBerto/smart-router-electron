const { ipcMain } = require("electron");

/**
 * Executa o login na interface gráfica do navegador
 * @param {string} page caminho do navegador para executar os métodos do playwright
 * @param {string} usuario usuário usado para realizar o login
 * @param {string} senha senha de acesso do usuário
 */

const fazerLogin = async (page, usuario, senha) => {
  try {
    ipcMain.emit("enviar-log", null, "Fazendo login...");
    await page.fill('input[id="login_name"]', usuario); // Preenche o campo de usuário
    await page.fill('input[id="login_passwd"]', senha); // Preenche o campo de senha
    await page.click('input[id="set_system_user_login"]'); // Clica no botão de fazer login
    await page.waitForTimeout(3000); // Aguarda 3 seg antes de prosseguir (tempo para a página carregar)
    ipcMain.emit("enviar-log", null, "Login efetuado com sucesso!");
    return
  } catch (err) {
    console.log(err);
    ipcMain.emit("enviar-log", null, "ERRO: Falha ao realizar o login");
    return
  }
};

module.exports = { fazerLogin };
