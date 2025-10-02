// 预加载脚本在渲染进程加载之前运行
// 它可以访问 Node.js API 和 Electron API
window.addEventListener('DOMContentLoaded', () => {
  /**
   * 替换指定元素的文本内容
   * @param {string} selector - 元素的选择器
   * @param {string} text - 要设置的文本内容
   */
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  // 遍历并显示依赖版本信息
  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});

// 引入 Electron 的 contextBridge 和 ipcRenderer 模块
const { contextBridge, ipcRenderer } = require('electron');

/**
 * 安全地暴露窗口控制方法到渲染进程
 * 通过 contextBridge 将 API 方法暴露给渲染进程
 */
contextBridge.exposeInMainWorld('electronAPI', {
  // 最小化窗口方法
  minimizeWindow: () => ipcRenderer.send('minimize-window'),
  // 最大化/还原窗口方法
  maximizeWindow: () => ipcRenderer.send('maximize-window'),
  // 关闭窗口方法
  closeWindow: () => ipcRenderer.send('close-window'),
  // 打开子窗口方法
  openChildWindow: () => ipcRenderer.send('open-child-window'),
  // 关闭子窗口方法
  closeChildWindow: () => ipcRenderer.send('close-child-window'),
  // 检查子窗口是否打开
  isChildWindowOpen: () => ipcRenderer.invoke('is-child-window-open'),
  // 发送系统通知方法
  sendNotification: (title, body) => {
    console.log('发送通知请求到主进程:', { title, body });
    ipcRenderer.send('send-notification', { title, body });
  },
  // 写入项目文件方法
  writeToProjectFile: (filename, content) => ipcRenderer.invoke('write-to-project-file', filename, content),
  // 显示保存文件对话框方法
  showSaveDialog: (options) => ipcRenderer.invoke('show-save-dialog', options),
  // 打开开发者工具方法
  openDevTools: () => ipcRenderer.send('open-dev-tools')
});