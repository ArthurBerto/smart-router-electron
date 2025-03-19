const { contextBridge, ipcRenderer } = require("electron");

console.log("Preload carregado!");

contextBridge.exposeInMainWorld("api", {
  verElectron: () => process.versions.electron,
  configurarRoteador: (modelo, loja) =>
    ipcRenderer.send("configurar-roteador", { modelo, loja }),
  escreverLogs: (mensagem) => ipcRenderer.send("enviar-log", mensagem),
  receberLogs: (callback) =>
    ipcRenderer.on("mostrar-log", (_event, mensagem) => {
      callback(mensagem);
    }),
});
