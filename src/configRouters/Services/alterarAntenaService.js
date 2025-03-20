const { ipcMain } = require("electron");

/**
 * Tem a função de alterar para antena externa do roteador
 * @param {string} page Aba do navegador que utliza a biblioteca Playwright
 */

const antena = async (page) => {
  await page.goto("http://10.200.0.1/settings/antenna.html", {
    waitUntil: "domcontentloaded",
  });

  await page.locator('input[id="antType_ex"]').check(); // Marca a checkbox para a antena externa
  await page.click('input[value="Salvar"]'); // Salva as configurações
  ipcMain.emit("enviar-log", null, "Ajustado para antena externa");
  return
};

module.exports = { antena }
