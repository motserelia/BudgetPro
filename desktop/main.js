"use strict";

const path = require("node:path");
const { app, BrowserWindow, ipcMain, session } = require("electron");
const { WhisperEngine } = require("./voice/whisper-engine");

let mainWindow = null;
let whisperEngine = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1220,
    height: 820,
    minWidth: 390,
    minHeight: 640,
    backgroundColor: "#17142e",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });
  mainWindow.loadFile(path.join(__dirname, "..", "www", "index.html"));
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function registerVoiceIpc() {
  whisperEngine = new WhisperEngine({
    app,
    isPackaged: app.isPackaged,
    onProgress(progress) {
      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send("voice:model-progress", progress);
      }
    },
  });
  ipcMain.handle("voice:model-status", () => whisperEngine.status());
  ipcMain.handle("voice:install-model", () => whisperEngine.installModel());
  ipcMain.handle("voice:transcribe", (_event, payload) => whisperEngine.transcribe(payload || {}));
}

app.whenReady().then(() => {
  session.defaultSession.setPermissionCheckHandler((_webContents, permission) => permission === "media");
  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback, details) => {
    callback(permission === "media" && details.mediaTypes?.includes("audio"));
  });
  registerVoiceIpc();
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => whisperEngine?.dispose());
