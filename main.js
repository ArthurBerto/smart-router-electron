const path = require("node:path"); // Corrigindo a importação do módulo `path`
const { scripTim } = require("./src/configRouters/configTim.js"); // Importando as funções Playwright
const { app, BrowserWindow, nativeTheme } = require('electron')

// Janela principal
const createWindow = () => {
  nativeTheme.themeSource = "system"; // Abre a cor da janela de acordo com o configurado pelo sistema
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: './src/public/img/icone.png',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      enableRemoteModule: false,
      sandbox: false,
    },
    resizable: false, // Impede o redimensionamento da janela
    //autoHideMenuBar: true, // Esconde o menu
  });

  win.loadFile('./src/views/index.html')
}

app.whenReady().then(() => {
  createWindow();
});

// Quando ele identifica que a janela foi fechada, ele encerra a aplicação
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

/* Manipula a configuração do roteador via IPC
ipcMain.on("configurar-roteador", async (e, { modelo, loja }) => {
  console.log(`Configuração solicitada: ${modelo} para Loja ${loja}`);

  try {
    if (modelo === "Vivo Box") {
      await ConfigVivo(loja);
    } else if (modelo === "Tim Box") {
      await scripTim(loja);
    } else if (modelo === "Claro Box") {
      await ConfigClaro(loja);
    } else {
      throw new Error("Modelo de roteador inválido.");
    }
  } catch (err) {
    console.error("Erro ao configurar o roteador:", err);
  }
});*/
