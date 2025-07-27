"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  }
  // You can expose other APTs you need here.
  // ...
});
electron.contextBridge.exposeInMainWorld("electronAPI", {
  sendNotification: (message) => {
    try {
      electron.ipcRenderer.send("notification", message);
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  },
  setProgressBar: (progress) => {
    try {
      return electron.ipcRenderer.invoke("set-progress-bar", progress);
    } catch (error) {
      console.error("Failed to set progress bar:", error);
      return Promise.resolve();
    }
  }
});
