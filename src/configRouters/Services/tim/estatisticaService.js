const { ipcMain } = require("electron");

/**
 * Tem a função de alterar o plano de dados do roteador
 * @param {string} page Aba do navegador que utliza a biblioteca Playwright
 */

const estatistica = async (page) => {
  await page.goto("http://10.200.0.1/settings/statistics.html", {
    waitUntil: "domcontentloaded",
  });

  await page.fill('input[id="wwan_network_quota"]', `100`); // Preenche com 100 GB
  await page.fill('input[id="wwan_network_percent"]', `100`); // Preenche com 100% de uso dos dados
  await page.click('input[id="set_wwan_network_data_limit"]');

  ipcMain.emit("enviar-log", null, "Configurado plano de dados para 100GB");
  return
};

module.exports = { estatistica };
