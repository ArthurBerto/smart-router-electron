const { ipcMain } = require("electron");
const { escreverTxt } = require("./escreverTxt");

const refresh = async (page, url, tentativaMax = 3) => {
  for (let tentativa = 1; tentativa <= tentativaMax; tentativa++) {
    try {
      await page.goto(url, {
        waitUntil: "load",
        timeout: 20000,
      });

      if (tentativa === 2) {
        ipcMain.emit(
          "enviar-log",
          null,
          `Acessando: ${url} (Tentativa ${tentativa}/${tentativaMax})`
        );
        escreverTxt(
          `Acessando: ${url} (Tentativa ${tentativa}/${tentativaMax})`
        );

        ipcMain.emit("enviar-log", null, `Sucesso ao acessar.`);
        escreverTxt("Sucesso ao acessar.");
      }

      return true;
    } catch (err) {
      if (
        err.message.includes("ERR_CONNECTION_TIMED_OUT") ||
        err.message.includes("ERR_ABORTED")
      ) {
        ipcMain.emit(
          "enviar-log",
          null,
          `Falha ao acessar: ${url} (Timeout). Tentativa ${tentativa}/${tentativaMax}`
        );
        escreverTxt(
          `Falha ao acessar: ${url} (Timeout). Tentativa ${tentativa}/${tentativaMax}`
        );

        if (tentativa < tentativaMax) {
          ipcMain.emit(
            "enviar-log",
            null,
            `Aguardando 4 segundos antes da próxima tentativa...`
          );
          escreverTxt(`Aguardando 4 segundos antes da próxima tentativa...`);
          await new Promise((resolve) => setTimeout(resolve, 4000));
        }
      } else {
        ipcMain.emit("enviar-log", null, `Erro inesperado ao acessar ${url}`);
        console.log(`Erro inesperado ao acessar ${url}: ${err.message}`);
        return false;
      }
    }
  }
  ipcMain.emit(
    "enviar-log",
    null,
    `ERRO: Todas as tentativas falharam para a url: ${url}.`
  );
  escreverTxt(`ERRO: Todas as tentativas falharam para a url: ${url}.`);
  return false;
};

module.exports = refresh;
