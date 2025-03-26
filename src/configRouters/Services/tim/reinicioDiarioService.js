const { ipcMain } = require("electron");
const refresh = require("../../utils/refreshPage");
const { escreverTxt } = require("../../utils/escreverTxt");

/**
 * Tem a função de alterar as configuraçõs de reinicio diário do navegador
 * @param {string} page Aba do navegador que utliza a biblioteca Playwright
 */

const agendamentoDiario = async (page) => {

    const url = "http://10.200.0.1/system/reboot.html";

    await refresh(page, url);

    await page.locator('select[id="reboot_hour"]').selectOption("3");
    await page.locator('select[id="reboot_minute"]').selectOption("2");
    await page.locator('input[id="autoRebootMode1"]').check(); // Marca a chekbox
    await page.click('input[value="Salvar"]'); // Salva as configurações
    await page.waitForTimeout(5000); // Aguarda 5 seg para aplicar todas as configurações
    ipcMain.emit("enviar-log", null, "Aplicado configurações para Reiniciar conexões");
    escreverTxt("Aplicado configurações para Reiniciar conexões");
    await page.waitForTimeout(2000);
    return
}

module.exports = { agendamentoDiario }