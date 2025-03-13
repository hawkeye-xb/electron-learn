const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  // 发送消息到其他窗口
  sendMessage: (message) => ipcRenderer.send('window-message', message),
  
  // 接收其他窗口的消息
  onMessageReceived: (callback) => {
    ipcRenderer.on('message-received', (event, data) => callback(data))
  }
})