"use strict";
var _documentCurrentScript = typeof document !== "undefined" ? document.currentScript : null;
const { app, BrowserWindow, ipcMain, Notification } = require("electron");
const { fileURLToPath } = require("node:url");
const path = require("node:path");
if (process.platform === "win32") {
  app.disableHardwareAcceleration();
}
ipcMain.handle("set-progress-bar", (_event, progress) => {
  const win2 = BrowserWindow.getAllWindows()[0];
  if (win2) {
    try {
      win2.setProgressBar(progress);
    } catch (error) {
      console.error("Taskbar progress error:", error);
    }
  }
});
const __dirname$1 = path.dirname(fileURLToPath(typeof document === "undefined" ? require("url").pathToFileURL(__filename).href : _documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === "SCRIPT" && _documentCurrentScript.src || new URL("main.js", document.baseURI).href));
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
});
process.env.APP_ROOT = path.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win = null;
function createWindow() {
  try {
    win = new BrowserWindow({
      width: 800,
      height: 600,
      title: "番茄时钟",
      icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
      skipTaskbar: false,
      frame: false,
      // Add background color for better Windows 7 rendering
      backgroundColor: "#333",
      webPreferences: {
        preload: path.join(__dirname$1, "preload.mjs"),
        // Disable sandbox for better Windows 7 compatibility
        sandbox: false,
        // Enable context isolation for security
        contextIsolation: true,
        // Disable hardware acceleration for better compatibility with older systems
        backgroundThrottling: false,
        // Enable native modules support
        nodeIntegration: true,
        nodeIntegrationInWorker: true
      }
    });
  } catch (error) {
    console.error("Window creation failed:", error);
  }
  if (win) {
    win.webContents.on("did-finish-load", () => {
      win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
    });
    if (VITE_DEV_SERVER_URL) {
      win.loadURL(VITE_DEV_SERVER_URL);
    } else {
      win.loadFile(path.join(RENDERER_DIST, "index.html"));
    }
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
ipcMain.on("notification", (_event, message) => {
  if (Notification.isSupported()) {
    new Notification({ title: "番茄时钟", body: message }).show();
  } else {
    console.log("Notifications not supported on this system:", message);
  }
});
app.whenReady().then(() => {
  createWindow();
});
