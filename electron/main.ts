import { app, BrowserWindow, ipcMain, Notification } from 'electron'
import { fileURLToPath } from 'node:url'
import * as path from 'node:path'
// 任务栏进度条 handler
ipcMain.handle('set-progress-bar', (_event, progress) => {
  const win = BrowserWindow.getAllWindows()[0]
  if (win) {
    win.setProgressBar(progress)
  }
})

// 任务栏图标 handler
ipcMain.handle('set-taskbar-icon', async (_event, iconPath) => {
  console.log('接收到设置任务栏图标请求:', iconPath)
  const win = BrowserWindow.getAllWindows()[0]
  if (win) {
    try {
      // 确保图标路径是绝对路径
      let fullPath = iconPath;
      if (!path.isAbsolute(iconPath)) {
        fullPath = path.join(process.env.VITE_PUBLIC || __dirname, iconPath);
      }
      
      console.log('图标完整路径:', fullPath)
      // 检查文件是否存在
      const fs = await import('node:fs');
      if (fs.existsSync(fullPath)) {
        win.setIcon(fullPath)
        console.log('任务栏图标设置成功')
        return { success: true }
      } else {
        console.error('图标文件不存在:', fullPath)
        return { success: false, error: '图标文件不存在' }
      }
    } catch (error: any) {
      console.error('设置任务栏图标失败:', error)
      return { success: false, error: error.message || '未知错误' }
    }
  } else {
    console.log('未找到窗口')
    return { success: false, error: '未找到窗口' }
  }
})

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, '..')

// ? Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null


function createWindow() {
  // 根据是否为开发环境设置不同的安全策略
  const isDev = !!VITE_DEV_SERVER_URL;
  
  win = new BrowserWindow({
    width: 800,
    height: 600,
    title: '番茄时钟',
    icon: path.join(process.env.VITE_PUBLIC, 'work.ico'),
    skipTaskbar: false,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // 修改为.js扩展名
      // 添加安全设置
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      // 设置更严格的安全策略
      webSecurity: true,
      allowRunningInsecureContent: false,
      // 开发环境特殊配置
      ...(isDev && {
        webSecurity: false // 开发环境中禁用webSecurity以便热重载
      })
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// 监听通知事件
ipcMain.on('notification', (_event, message) => {
  new Notification({ title: '番茄时钟', body: message }).show()
})

app.whenReady().then(createWindow)