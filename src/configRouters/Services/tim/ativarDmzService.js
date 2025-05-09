const { ipcMain } = require("electron");
const refresh = require("../../utils/refreshPage");
const { escreverTxt } = require("../../utils/escreverTxt");

/**
 * Tem a função de ativar as configurações de DMZ do roteador
 * @param {string} page Aba do navegador que utliza a biblioteca Playwright
 */

const ativarDMZ = async (page) => {

  const url = "http://192.168.1.1/settings/security_dmz.html";

  await refresh(page, url);

  await page.locator('input[id="dmzEnable_on"]').check(); // Marca o checkbox
  await page.fill('input[id="dmz_ip"]', `10.200.0.2`); // Preenche com as informações de ip
  await page.click('input[value="Salvar"]'); // Salva as alterações
  ipcMain.emit("enviar-log", null, "Ativado DMZ");
  escreverTxt("Ativado DMZ")
  return
};

module.exports = { ativarDMZ };
