const { ipcMain } = require("electron");
const { escreverTxt } = require("../../utils/escreverTxt");

/**
 * Executa o login na interface gráfica do navegador
 * @param {string} page caminho do navegador para executar os métodos do playwright
 * @param {string} usuario usuário usado para realizar o login
 * @param {string} senha senha de acesso do usuário
 * @param {string} senhaNova senha nova de acesso do usuário
 */

const fazerLogin = async (page, usuario, senha, senhaNova) => {
  try {
    ipcMain.emit("enviar-log", null, "Fazendo login...");
    escreverTxt("Fazendo login...");

    // Função para tentar o login
    const tentarLogin = async (senha) => {
      await page.fill('input[id="login_name"]', usuario); // Preenche o campo de usuário
      await page.fill('input[id="login_passwd"]', senha); // Preenche o campo de senha
      await page.click('input[id="set_system_user_login"]'); // Clica no botão de fazer login
      await page.waitForTimeout(3000); // Aguarda 3 seg antes de prosseguir (tempo para a página carregar)

      // Verifica se há mensagem de erro (sem travar a execução)
      const mensagemErro = await page.locator("xpath=//div[@id='ui-id-1']").isVisible();

      await page.keyboard.press("Enter");

      if (mensagemErro) {
        return false; // Retorna falso para indicar falha
      }

      return true; // Login bem-sucedido
    };

    // Primeira tentativa com senha padrão
    let loginSucesso = await tentarLogin(senha);

    // Se falhar, tenta com senha nova
    if (!loginSucesso) {
      escreverTxt("Tentando login novamente com a segunda senha...");
      loginSucesso = await tentarLogin(senhaNova);
    }

    if (loginSucesso) {
      ipcMain.emit("enviar-log", null, "Login efetuado com sucesso!");
      escreverTxt("Login efetuado com sucesso!");
    } else {
      console.log("Todas as tentativas de login falharam!");
    }
  } catch (err) {
    console.log("Erro no processo de login:", err);
  }
};

module.exports = { fazerLogin };
