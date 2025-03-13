const { app, BrowserWindow, ipcMain, MessageChannelMain } = require('electron')
const path = require('path')

let win1, win2

function createWindows() {
  win1 = new BrowserWindow({
    width: 800,
    height: 600,
    title: '窗口 1',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload-messageport.js')
    }
  })

  win2 = new BrowserWindow({
    width: 800,
    height: 600,
    title: '窗口 2',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload-messageport.js')
    }
  })

  win1.loadFile('window1-messageport.html')
  win2.loadFile('window2-messageport.html')

  // 等待两个窗口都加载完成
  Promise.all([
    win1.webContents.loaded,
    win2.webContents.loaded
  ]).then(setupMessageChannel)
}

async function setupMessageChannel() {
  // 使用 MessageChannelMain 创建通道
  const { port1, port2 } = new MessageChannelMain()

  // 将端口发送给各自的渲染进程
  win1.webContents.postMessage('port', null, [port1])
  win2.webContents.postMessage('port', null, [port2])
}

app.whenReady().then(createWindows)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindows()
  }
})