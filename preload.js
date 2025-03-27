const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  configurarRoteador: (modelo, loja, operador) =>
    ipcRenderer.send("configurar-roteador", { modelo, loja, operador }),
  escreverLogs: (mensagem) => ipcRenderer.send("enviar-log", mensagem),
  receberLogs: (callback) =>
    ipcRenderer.on("mostrar-log", (_event, mensagem) => {
      callback(mensagem);
    }),
  voltarMenu: () => ipcRenderer.send("voltarMenu"), 
});
