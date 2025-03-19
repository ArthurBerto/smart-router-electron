import { contextBridge, ipcRenderer } from "electron";

console.log("Preload carregado!");

contextBridge.exposeInMainWorld("electronAPI", {
    configurarRoteador: (modelo, loja) => ipcRenderer.send("configurar-roteador", { modelo, loja }),
});