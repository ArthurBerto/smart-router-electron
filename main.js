const path = require("node:path"); // Corrigindo a importação do módulo `path`
const { scriptTim } = require("./src/configRouters/configTim.js"); // Importando as funções Playwright
const { scriptVivo } = require("./src/configRouters/configVivo.js");
const { app, BrowserWindow, nativeTheme, ipcMain } = require("electron");

let win;

// Janela principal
const createWindow = () => {
  nativeTheme.themeSource = "system"; // Abre a cor da janela de acordo com o configurado pelo sistema
  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: "./src/public/img/icone.png",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
      sandbox: false,
    },
    resizable: false, // Impede o redimensionamento da janela
    //autoHideMenuBar: true, // Esconde o menu
  });

  win.loadFile("./src/views/index.html");
};

app.whenReady().then(() => {
  createWindow();

  ipcMain.on("enviar-log", (event, mensagem) => {
    if(win) {
      win.webContents.send("mostrar-log", mensagem)
    }
  })

  // Manipula a configuração do roteador via IPC
  ipcMain.on("configurar-roteador", async (e, { modelo, loja }) => {

    if (win) {
      win.loadFile("./src/views/configuracao.html")
    }

    try {
      if (modelo === "Vivo Box") {
        await scriptVivo(loja);
      } else if (modelo === "Tim Box") {
        await scriptTim(loja);
      } else if (modelo === "Claro Box") {
        await ConfigClaro(loja);
      } else {
        throw new Error("Modelo de roteador inválido.");
      }
    } catch (err) {
      console.error("Erro ao configurar o roteador:", err);
    }
  });

  ipcMain.on("voltarMenu", () => {
    if (win) {
      win.loadFile("./src/views/index.html")
    }
  })

});

// Quando ele identifica que a janela foi fechada, ele encerra a aplicação
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
