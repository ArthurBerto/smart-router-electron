const { ipcMain } = require("electron");

/**
 * Tem a função de alterar as configurações de DHCP do roteador
 * @param {string} page Aba do navegador que utliza a biblioteca Playwright
 */

const alterarDHCP = async (page) => {
  await page.goto("http://192.168.1.1/settings/dhcp.html", {
    waitUntil: "domcontentloaded",
  });

  await page.fill('input[id="dhcp_ip"]', `10.200.0.1`); // Preenche com o ip
  await page.fill('input[id="dhcp_range_end"]', `55`); // Preenche com o range final
  await page.fill('input[id="dhcp_lease"]', `3600`);
  await page.click('input[value="Salvar"]'); // Clica para salvar as configurações

  ipcMain.emit(
    "enviar-log",
    null,
    "Alterado ip para 10.200.0.1, aguardando 10 seg para novo acesso..."
  );
  await page.waitForTimeout(10000); // Espera 10 seg para salvar as configurações
  return;
};

module.exports = { alterarDHCP };
