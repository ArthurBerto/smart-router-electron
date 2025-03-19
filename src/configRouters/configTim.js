import { chromium } from "playwright";

export const scripTim = async (loja) => {
  // Inicia um navegador Chromium
  console.log("Abrindo o navegador")
  const browser = await chromium.launch({ headless: false }); // Altere para 'true' para rodar em segundo plano
  const page = await browser.newPage();

  // Navega até o Google
  await page.goto("https://www.google.com");

  // Aguarda 3 segundos para visualização
  await page.waitForTimeout(3000);

  // Fecha o navegador
  await browser.close();
};

scripTim