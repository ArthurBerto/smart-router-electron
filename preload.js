const { contextBridge } = require("electron");

console.log("Preload carregado!");

contextBridge.exposeInMainWorld("api", {
  verElectron: () => process.versions.electron,
  //configurarRoteador: (modelo, loja) => ipcRenderer.send("configurar-roteador", { modelo, loja }),
});
