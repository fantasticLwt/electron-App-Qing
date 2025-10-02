// 渲染进程脚本 - Electron 应用的前端逻辑入口点
console.log('Renderer process loaded');

// DOM内容加载完成后执行的回调函数
document.addEventListener('DOMContentLoaded', () => {
  // 确保DOM完全加载和解析完成
  console.log('DOM fully loaded and parsed');
});