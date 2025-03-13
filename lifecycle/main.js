const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

let mainWindow = null

function someHeavyComputation() {
	console.log('开始耗时计算...')
	const startTime = Date.now()
	// 模拟耗时计算
	let result = 0
	for(let i = 0; i < 1000000000; i++) {
		result += Math.sqrt(i)
	}
	const endTime = Date.now()
	console.log(`计算耗时: ${endTime - startTime}ms`)
	return result
}

// 1. app 生命周期
app.on('will-finish-launching', () => {
  // 在 ready 事件前触发，主要用于 macOS
  console.log('1. will-finish-launching')
  console.log('app.isReady(): ', app.isReady())

	console.log('同步计算开始')
  someHeavyComputation()
  console.log('同步计算结束')
  
  // 可以进行文件读取
  const fs = require('fs')
  try {
    const config = fs.readFileSync('config.json', 'utf8')
    console.log('配置文件读取成功:', config)
  } catch (err) {
    console.log('配置文件读取失败:', err)
  }

  // 可以发起 HTTP 请求
  // const https = require('https')
  // https.get('https://api.github.com', (res) => {
  //   console.log('HTTP 请求状态:', res.statusCode)
  // }).on('error', (err) => {
  //   console.log('HTTP 请求失败:', err)
  // })
})

app.on('ready', () => {
  console.log('on ready triggered')
})
app.whenReady().then(() => {
  // 2. Electron 完成初始化时触发
  console.log('2. app ready')
  createWindow()
  
  app.on('activate', () => {
    // macOS 特有：点击 dock 图标时重新创建窗口
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // 3. BrowserWindow 生命周期事件
  mainWindow.on('ready-to-show', () => {
    // 窗口已完成首次渲染，可以显示了
    console.log('3. window ready-to-show')
    mainWindow.show()
  })

  mainWindow.on('focus', () => {
    console.log('window focused')
  })

  mainWindow.on('blur', () => {
    console.log('window blurred')
  })

  mainWindow.on('close', (e) => {
    console.log('window closing')
    // 可以在这里阻止窗口关闭
    // e.preventDefault()
  })

  mainWindow.on('closed', () => {
    console.log('window closed')
    mainWindow = null
  })

  // WebContents 导航生命周期事件
  mainWindow.webContents.on('did-start-loading', () => {
    console.log('31. 网页开始加载')
  })

  mainWindow.webContents.on('will-navigate', (event, url) => {
    console.log('32. 即将导航到新页面:', url)
  })

  mainWindow.webContents.on('did-start-navigation', (event, url, isInPlace, isMainFrame) => {
    console.log('33. 开始导航:', url, isMainFrame ? '主框架' : '子框架')
  })

  mainWindow.webContents.on('will-frame-navigate', (event, url) => {
    console.log('34. 框架即将导航:', url)
  })

  mainWindow.webContents.on('did-frame-navigate', (event, url, httpResponseCode, httpStatusText) => {
    console.log('35. 框架完成导航:', url, httpStatusText)
  })

  mainWindow.webContents.on('will-redirect', (event, url) => {
    console.log('36. 即将重定向到:', url)
  })

  mainWindow.webContents.on('did-navigate', (event, url, httpResponseCode, httpStatusText) => {
    console.log('37. 导航完成:', url, httpStatusText)
  })

  mainWindow.webContents.on('dom-ready', () => {
    console.log('38. DOM 准备就绪')
  })

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('39. 页面加载完成')
  })

  mainWindow.webContents.on('did-create-window', (window, details) => {
    console.log('310. 创建新窗口:', details.url)
  })

  mainWindow.loadFile('index.html')
}

// 4. 应用退出相关事件
app.on('window-all-closed', () => {
  console.log('all windows closed')
  // macOS 中除非用户按下 Cmd + Q，否则不会完全退出
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', (event) => {
  // 在应用退出前触发，可以在这里做一些清理工作
  console.log('before-quit')
})

app.on('will-quit', (event) => {
  // 在所有窗口关闭后，应用即将退出时触发
  console.log('will-quit')
})

app.on('quit', (event, exitCode) => {
  // 应用退出时触发
  console.log('quit, exit code:', exitCode)
})