const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

function createWindows() {
  // 创建两个窗口
  const win1 = new BrowserWindow({
    width: 800,
    height: 600,
    title: '窗口 1',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  const win2 = new BrowserWindow({
    width: 800,
    height: 600,
    title: '窗口 2',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win1.loadFile('window1.html')
  win2.loadFile('window2.html')

  // 主进程作为消息代理
  ipcMain.on('window-message', (event, data) => {
    // 获取所有窗口
    const windows = BrowserWindow.getAllWindows()
    // 转发消息给其他窗口
    windows.forEach(win => {
      if (win.webContents !== event.sender) {
        win.webContents.send('message-received', data)
      }
    })
  })
}

app.whenReady().then(createWindows)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})