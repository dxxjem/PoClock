"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const electron = require("electron");
const node_url = require("node:url");
const path = require("node:path");
var _documentCurrentScript = typeof document !== "undefined" ? document.currentScript : null;
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const path__namespace = /* @__PURE__ */ _interopNamespaceDefault(path);
electron.ipcMain.handle("set-progress-bar", (_event, progress) => {
  const win2 = electron.BrowserWindow.getAllWindows()[0];
  if (win2) {
    win2.setProgressBar(progress);
  }
});
electron.ipcMain.handle("set-taskbar-icon", async (_event, iconPath) => {
  console.log("接收到设置任务栏图标请求:", iconPath);
  const win2 = electron.BrowserWindow.getAllWindows()[0];
  if (win2) {
    try {
      let fullPath = iconPath;
      if (!path__namespace.isAbsolute(iconPath)) {
        fullPath = path__namespace.join(process.env.VITE_PUBLIC || __dirname$1, iconPath);
      }
      console.log("图标完整路径:", fullPath);
      const fs = await import("node:fs");
      if (fs.existsSync(fullPath)) {
        win2.setIcon(fullPath);
        console.log("任务栏图标设置成功");
        return { success: true };
      } else {
        console.error("图标文件不存在:", fullPath);
        return { success: false, error: "图标文件不存在" };
      }
    } catch (error) {
      console.error("设置任务栏图标失败:", error);
      return { success: false, error: error.message || "未知错误" };
    }
  } else {
    console.log("未找到窗口");
    return { success: false, error: "未找到窗口" };
  }
});
electron.ipcMain.handle("minimize-window", () => {
  const win2 = electron.BrowserWindow.getAllWindows()[0];
  if (win2) {
    win2.minimize();
  }
});
electron.ipcMain.handle("maximize-window", () => {
  const win2 = electron.BrowserWindow.getAllWindows()[0];
  if (win2) {
    if (win2.isMaximized()) {
      win2.unmaximize();
    } else {
      win2.maximize();
    }
  }
});
electron.ipcMain.handle("close-window", () => {
  const win2 = electron.BrowserWindow.getAllWindows()[0];
  if (win2) {
    win2.close();
  }
});
const __dirname$1 = path__namespace.dirname(node_url.fileURLToPath(typeof document === "undefined" ? require("url").pathToFileURL(__filename).href : _documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === "SCRIPT" && _documentCurrentScript.src || new URL("main.js", document.baseURI).href));
process.env.APP_ROOT = path__namespace.join(__dirname$1, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path__namespace.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path__namespace.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path__namespace.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  const isDev = !!VITE_DEV_SERVER_URL;
  win = new electron.BrowserWindow({
    width: 800,
    height: 600,
    title: "番茄时钟",
    icon: path__namespace.join(process.env.VITE_PUBLIC, "work.ico"),
    skipTaskbar: false,
    frame: false,
    webPreferences: {
      preload: path__namespace.join(__dirname$1, "preload.js"),
      // 修改为.js扩展名
      // 添加安全设置
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      // 设置更严格的安全策略
      webSecurity: true,
      allowRunningInsecureContent: false,
      // 开发环境特殊配置
      ...isDev && {
        webSecurity: false
        // 开发环境中禁用webSecurity以便热重载
      }
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path__namespace.join(RENDERER_DIST, "index.html"));
  }
}
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
    win = null;
  }
});
electron.app.on("activate", () => {
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
electron.ipcMain.on("notification", (_event, message) => {
  new electron.Notification({ title: "番茄时钟", body: message }).show();
});
electron.app.whenReady().then(createWindow);
exports.MAIN_DIST = MAIN_DIST;
exports.RENDERER_DIST = RENDERER_DIST;
exports.VITE_DEV_SERVER_URL = VITE_DEV_SERVER_URL;
