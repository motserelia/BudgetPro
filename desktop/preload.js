"use strict";

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("budgetPRODesktopVoice", {
  getModelStatus: () => ipcRenderer.invoke("voice:model-status"),
  installModel: () => ipcRenderer.invoke("voice:install-model"),
  transcribe: ({ wav, language, audioMetrics }) => ipcRenderer.invoke("voice:transcribe", { wav, language, audioMetrics }),
  onModelProgress: (listener) => {
    const handler = (_event, progress) => listener(progress);
    ipcRenderer.on("voice:model-progress", handler);
    return () => ipcRenderer.removeListener("voice:model-progress", handler);
  },
});
