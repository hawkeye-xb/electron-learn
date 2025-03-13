const { contextBridge, ipcRenderer } = require('electron')

let messagePort = null

contextBridge.exposeInMainWorld('electronAPI', {
  // 发送消息
  sendMessage: (message) => {
    if (messagePort) {
      messagePort.postMessage(message)
    }
  },
  
  // 接收消息
  onMessageReceived: (callback) => {
    // 监听端口设置
    ipcRenderer.on('port', (event) => {
      messagePort = event.ports[0]
      messagePort.onmessage = (event) => callback(event.data)
      messagePort.start()
    })
  }
})