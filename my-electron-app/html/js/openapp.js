/**
 * 打开微信应用函数
 * 尝试通过URL Scheme启动微信应用
 */
function openWeChat() {
    // 尝试打开微信
    window.location.href = "weixin://";
    console.log('打开微信');
}

/**
 * 打开开发者工具函数
 * 通过Electron API打开开发者工具
 */
function openDevTools() {
  // 检查是否在Electron环境中运行
  if (typeof window.electronAPI !== 'undefined') {
    window.electronAPI.openDevTools();
     console.log('打开开发者工具');
  } else {
    console.error('Electron API not available');
  }
}