const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  configurarRoteador: (modelo, loja) =>
    ipcRenderer.send("configurar-roteador", { modelo, loja }),
  escreverLogs: (mensagem) => ipcRenderer.send("enviar-log", mensagem),
  receberLogs: (callback) =>
    ipcRenderer.on("mostrar-log", (_event, mensagem) => {
      callback(mensagem);
    }),
  voltarMenu: () => ipcRenderer.send("voltarMenu"), 
});
