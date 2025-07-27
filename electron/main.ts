const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const { fileURLToPath } = require('node:url');
const path = require('node:path');

// Disable hardware acceleration for better Windows 7 compatibility
if (process.platform === 'win32') {
  app.disableHardwareAcceleration();
}

// 任务栏进度条 handler
ipcMain.handle('set-progress-bar', (_event, /** @type {number} */ progress) => {
  const win = BrowserWindow.getAllWindows()[0];
  if (win) {
    // Windows 7 taskbar progress requires specific handling
    try {
      win.setProgressBar(progress);
    } catch (error) {
      console.error('Taskbar progress error:', error);
    }
  }
});

// 获取当前模块的目录路径
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 添加错误处理
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

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

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

/** @type {BrowserWindow | null} */
let win = null

function createWindow() {
  try {
    win = new BrowserWindow({
      width: 800,
      height: 600,
      title: '番茄时钟',
      icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
      skipTaskbar: false,
      frame: false,
      // Add background color for better Windows 7 rendering
      backgroundColor: '#333',
      webPreferences: {
        preload: path.join(__dirname, 'preload.mjs'),
        // Disable sandbox for better Windows 7 compatibility
        sandbox: false,
        // Enable context isolation for security
        contextIsolation: true,
        // Disable hardware acceleration for better compatibility with older systems
        backgroundThrottling: false,
        // Enable native modules support
        nodeIntegration: true,
        nodeIntegrationInWorker: true
      },
    });
  } catch (error) {
    console.error('Window creation failed:', error);
  }

  // Test active push message to Renderer-process.
  if (win) {
    win.webContents.on('did-finish-load', () => {
      win.webContents.send('main-process-message', (new Date).toLocaleString())
    })

    if (VITE_DEV_SERVER_URL) {
      win.loadURL(VITE_DEV_SERVER_URL)
    } else {
      // win.loadFile('dist/index.html')
      win.loadFile(path.join(RENDERER_DIST, 'index.html'))
    }
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
ipcMain.on('notification', (_event, /** @type {string} */ message) => {
  // Check if notifications are supported on current system
  if (Notification.isSupported()) {
    new Notification({ title: '番茄时钟', body: message }).show()
  } else {
    console.log('Notifications not supported on this system:', message)
  }
})

// Add Windows 7 specific handling
app.whenReady().then(() => {
  createWindow();
})