const { ipcMain } = require("electron");
const { chromium } = require("playwright");

const scripTim = async (loja) => {
  // Inicia um navegador Chromium
  await ipcMain.emit("enviar-log", null, "Testeaaaaaaaaa");
  const browser = await chromium.launch({ headless: false }); // Altere para 'true' para rodar em segundo plano
  const page = await browser.newPage();
  await ipcMain.emit("enviar-log", null, "Navegador aberto");
  // Navega até o Google
  await ipcMain.emit("enviar-log", null, "Acessando o google.com");
  await page.goto("https://www.google.com");

  // Aguarda 3 segundos para visualização
  await ipcMain.emit("enviar-log", null, "Esperando 3 seg");
  await page.waitForTimeout(3000);

  // Fecha o navegador
  await browser.close();
  await ipcMain.emit("enviar-log", null, "Navegador fechado.");
};

module.exports = { scripTim };
