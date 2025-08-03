"use strict";
const electron = require("electron");
const minimizeWindow = () => {
  return electron.ipcRenderer.invoke("minimize-window");
};
const maximizeWindow = () => {
  return electron.ipcRenderer.invoke("maximize-window");
};
const closeWindow = () => {
  return electron.ipcRenderer.invoke("close-window");
};
const electronAPI = {
  sendNotification: (message) => electron.ipcRenderer.send("notification", message),
  setProgressBar: (progress) => electron.ipcRenderer.invoke("set-progress-bar", progress),
  setTaskbarIcon: (iconPath) => electron.ipcRenderer.invoke("set-taskbar-icon", iconPath),
  minimizeWindow,
  maximizeWindow,
  closeWindow
};
try {
  electron.contextBridge.exposeInMainWorld("electronAPI", electronAPI);
  console.log("Electron API exposed successfully");
} catch (error) {
  console.error("Failed to expose Electron API:", error);
}
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(channel, listener) {
    return electron.ipcRenderer.on(channel, (event, ...args) => listener(event, ...args));
  },
  off(channel, listener) {
    return electron.ipcRenderer.off(channel, listener);
  },
  send(channel, ...args) {
    return electron.ipcRenderer.send(channel, ...args);
  },
  invoke(channel, ...args) {
    return electron.ipcRenderer.invoke(channel, ...args);
  }
  // You can expose other APTs you need here.
  // ...
});
electron.contextBridge.exposeInMainWorld("electronAPI", {
  sendNotification: (message) => {
    console.log("发送通知:", message);
    return electron.ipcRenderer.send("notification", message);
  },
  setProgressBar: (progress) => {
    console.log("设置进度条:", progress);
    return electron.ipcRenderer.invoke("set-progress-bar", progress);
  },
  setTaskbarIcon: async (iconPath) => {
    console.log("设置任务栏图标:", iconPath);
    try {
      const result = await electron.ipcRenderer.invoke("set-taskbar-icon", iconPath);
      console.log("任务栏图标设置结果:", result);
      return result;
    } catch (error) {
      console.error("任务栏图标设置失败:", error);
      return { success: false, error: error.message || "未知错误" };
    }
  }
});
