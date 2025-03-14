const { app, BrowserWindow, session } = require('electron');
const path = require('path');
// GPU 相关配置
// app.commandLine.appendSwitch('ignore-gpu-blacklist');
// app.commandLine.appendSwitch('use-angle', 'opengl');
app.commandLine.appendSwitch('js-flags', '--max-old-space-size=2048');

// 创建窗口函数
function createWindow() {
	console.log(process.memoryUsage());
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
    }
  });

  // 修改 User-Agent
  mainWindow.webContents.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36');

  // 加载HTML文件
  mainWindow.loadURL('https://hawkeye-xb.xyz/zh/series/electron-%E5%AD%A6%E4%B9%A0/');
}

// 应用准备好后创建窗口
app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 关闭所有窗口时退出应用
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});