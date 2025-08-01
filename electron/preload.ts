import { ipcRenderer, contextBridge, IpcRendererEvent } from 'electron'

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('ipcRenderer', {
  on(
    channel: string, 
    listener: (event: IpcRendererEvent, ...args: any[]) => void
  ) {
    return ipcRenderer.on(channel, (event, ...args) => listener(event, ...args))
  },
  off(
    channel: string, 
    listener: (event: IpcRendererEvent, ...args: any[]) => void
  ) {
    return ipcRenderer.off(channel, listener)
  },
  send(channel: string, ...args: any[]) {
    return ipcRenderer.send(channel, ...args)
  },
  invoke(channel: string, ...args: any[]) {
    return ipcRenderer.invoke(channel, ...args)
  },

  // You can expose other APTs you need here.
  // ...
})

// ------------------------------------------------------------

contextBridge.exposeInMainWorld('electronAPI', {
  sendNotification: (message: string) => {
    console.log('发送通知:', message)
    return ipcRenderer.send('notification', message)
  },
  setProgressBar: (progress: number) => {
    console.log('设置进度条:', progress)
    return ipcRenderer.invoke('set-progress-bar', progress)
  },
  setTaskbarIcon: async (iconPath: string) => {
    console.log('设置任务栏图标:', iconPath)
    try {
      const result = await ipcRenderer.invoke('set-taskbar-icon', iconPath)
      console.log('任务栏图标设置结果:', result)
      return result
    } catch (error: any) {
      console.error('任务栏图标设置失败:', error)
      return { success: false, error: error.message || '未知错误' }
    }
  }
})