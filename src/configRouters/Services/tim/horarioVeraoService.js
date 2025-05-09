const { ipcMain } = require("electron");
const refresh = require("../../utils/refreshPage");
const { escreverTxt } = require("../../utils/escreverTxt");

/**
 * Tem a função de desativar a opção de horário de verão do roteador
 * @param {string} page Aba do navegador que utliza a biblioteca Playwright
 */

const desabilitarHorarioVerao = async (page) => {

    const url = "http://10.200.0.1/system/DateAndTime.html";

    await refresh(page, url);

    await page.locator('input[id="system_date_and_time_daylight_saving_time_enable"]').uncheck(); // Desmarca o horário de verão
    await page.click('input[value="Salvar"]'); // Salva as configurações
    await page.waitForTimeout(6000); // Aguarda 6 seg para salvar
    ipcMain.emit("enviar-log", null, "Desabilitado horário de verão");
    escreverTxt("Desabilitado horário de verão");
    return
}

module.exports = { desabilitarHorarioVerao }