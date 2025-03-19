const { contextBridge, ipcRenderer } = require("electron");

console.log("Preload carregado!");

contextBridge.exposeInMainWorld("api", {
  verElectron: () => process.versions.electron,
  configurarRoteador: (modelo, loja) => ipcRenderer.send("configurar-roteador", { modelo, loja }),
  mudarParaConfiguracao: () => ipcRenderer.send("abrir-configuracao"),
});
