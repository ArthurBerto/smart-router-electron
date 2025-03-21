const { ipcMain } = require("electron");
const { escreverTxt } = require("../../utils/escreverTxt");

/**
 * Executa o login na interface gráfica do navegador
 * @param {string} page caminho do navegador para executar os métodos do playwright
 * @param {string} usuario usuário usado para realizar o login
 * @param {string} senha senha de acesso do usuário
 */

const fazerLogin = async (page, usuario, senha) => {
  try {
    ipcMain.emit("enviar-log", null, "Fazendo login...");
    escreverTxt("Fazendo login...");
    await page.fill('input[name="user_name_plaintext"]', usuario); // Preenche o campo de usuário
    await page.fill('input[name="user_passwd_plaintext"]', senha); // Preenche o campo de senha
    await page.click('input[id="login_btn"]'); // Clica no botão de fazer login
    await page.waitForTimeout(3000); // Aguarda 3 seg antes de prosseguir (tempo para a página carregar)
    ipcMain.emit("enviar-log", null, "Login efetuado com sucesso!");
    escreverTxt("Login efetuado com sucesso!");
    return;
  } catch (err) {
    console.log(err);
    ipcMain.emit("enviar-log", null, "ERRO: Falha ao realizar o login");
    return;
  }
};

module.exports = { fazerLogin };
