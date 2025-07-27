"use strict";
const { ipcRenderer, contextBridge } = require("electron");
contextBridge.exposeInMainWorld("ipcRenderer", {
  /**
   * @param {string} channel 
   * @param {any[]} args 
   */
  on(channel, ...args) {
    const [listener] = args;
    return ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  /**
   * @param {string} channel 
   * @param {any[]} args 
   */
  off(channel, ...args) {
    return ipcRenderer.off(channel, ...args);
  },
  /**
   * @param {string} channel 
   * @param {any[]} args 
   */
  send(channel, ...args) {
    return ipcRenderer.send(channel, ...args);
  },
  /**
   * @param {string} channel 
   * @param {any[]} args 
   */
  invoke(channel, ...args) {
    return ipcRenderer.invoke(channel, ...args);
  }
  // You can expose other APTs you need here.
  // ...
});
contextBridge.exposeInMainWorld("electronAPI", {
  /**
   * @param {string} message 
   */
  sendNotification: (message) => {
    try {
      ipcRenderer.send("notification", message);
    } catch (error) {
      console.error("Failed to send notification:", error);
    }
  },
  /**
   * @param {number} progress 
   */
  setProgressBar: (progress) => {
    try {
      return ipcRenderer.invoke("set-progress-bar", progress);
    } catch (error) {
      console.error("Failed to set progress bar:", error);
      return Promise.resolve();
    }
  }
});
