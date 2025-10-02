// 引入 Electron 模块和 Node.js 内置模块
const { app, BrowserWindow, Menu, ipcMain, Notification, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// 设置AppUserModelID以确保Windows通知正常工作
if (process.platform === 'win32') {
  app.setAppUserModelId('轻-通知');
}

// 存储子窗口引用
let childWindow = null;

/**
 * 创建浏览器窗口函数
 * 创建并配置应用的主窗口
 * @returns {BrowserWindow} 创建的主窗口对象
 */
function createWindow () {
  // 创建主窗口对象并设置窗口属性
  const mainWindow = new BrowserWindow({
    width: 1200,
    minWidth: 550,           // 窗口宽度
    height: 800,   
    minHeight: 200,       // 窗口高度
    frame: false,         // 禁用默认标题栏
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),  // 预加载脚本路径
      nodeIntegration: false,                       // 禁用Node.js集成
      contextIsolation: true,                       // 启用上下文隔离
      
      scrollBounce: false,      // 禁用弹性滚动效果
      scrollbarOverlay: true    // 使用覆盖滚动条（适用于 macOS）
    }
  });

  // 加载应用的 index.html，并添加错误处理
  mainWindow.loadFile('html/index.html').catch(err => {
    console.error('Failed to load index.html:', err);
    // 如果加载失败，尝试加载错误页面
    mainWindow.loadFile('html/error.html').catch(error => {
      console.error('Failed to load error.html:', error);
    });
  });
  
  // 监听页面加载失败事件
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Page failed to load:', errorCode, errorDescription, validatedURL);
    // 加载错误页面
    mainWindow.loadFile('html/error.html').catch(error => {
      console.error('Failed to load error.html:', error);
    });
  });

  // 开发环境下打开开发者工具
 //  if (!app.isPackaged) {
//     mainWindow.webContents.openDevTools();
 //  }
  
  
  return mainWindow;
}

/**
 * 创建子窗口函数
 * 创建并配置应用的子窗口
 * @param {BrowserWindow} parentWindow - 父窗口对象
 * @returns {BrowserWindow} 创建的子窗口对象
 */
function createChildWindow (parentWindow) {
  // 创建子窗口对象并设置窗口属性
  childWindow = new BrowserWindow({
    width: 800,           // 子窗口宽度
    height: 1000,          // 子窗口高度
    frame: false,         // 禁用默认标题栏
    backgroundColor: '#36393F', // 设置背景颜色以减少视觉闪烁
    fullscreenable: true,  // 允许全屏
    // 移除 parent 属性，使窗口能够显示在任务栏上
    // parent: parentWindow,
    skipTaskbar: false,   // 确保窗口在任务栏中显示
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),  // 预加载脚本路径
      nodeIntegration: false,                       // 禁用Node.js集成
      contextIsolation: true,                       // 启用上下文隔离

      scrollBounce: false,      // 禁用弹性滚动效果
      scrollbarOverlay: true    // 使用覆盖滚动条（适用于 macOS）
    }
  });

  // 监听窗口关闭事件
  childWindow.on('closed', () => {
    childWindow = null;
  });
  

  // 加载子窗口的 HTML 文件，并添加错误处理
  childWindow.loadFile('html/child1.html').catch(err => {
    console.error('Failed to load chil1.html:', err);
    // 如果加载失败，尝试加载错误页面
    childWindow.loadFile('html/error.html').catch(error => {
      console.error('Failed to load error.html:', error);
    });
  });
  
  // 监听页面加载失败事件
  childWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Page failed to load:', errorCode, errorDescription, validatedURL);
    // 加载错误页面
    childWindow.loadFile('html/error.html').catch(error => {
      console.error('Failed to load error.html:', error);
    });
  });

  return childWindow;
}

// 在这里添加子窗口管理的IPC处理器
// 处理打开子窗口事件
ipcMain.on('open-child-window', (event) => {
  console.log('收到打开子窗口请求');
  const parentWindow = BrowserWindow.fromWebContents(event.sender);
  // 如果子窗口已存在，则聚焦到该窗口而不是创建新窗口
  if (childWindow) {
    childWindow.focus();
  } else {
    createChildWindow(parentWindow);
  }
});

// 处理关闭子窗口事件
ipcMain.on('close-child-window', () => {
  console.log('收到关闭子窗口请求');
  if (childWindow) {
    childWindow.close();
    childWindow = null;
  }
});


// 处理检查子窗口是否打开的事件（关键添加）
ipcMain.handle('is-child-window-open', () => {
  console.log('收到检查子窗口状态请求');
  // 返回子窗口是否打开的状态
  const isOpen = childWindow !== null && !childWindow.isDestroyed();
  console.log('子窗口状态:', isOpen);
  return isOpen;
});

// 处理来自渲染进程的最小化窗口请求
ipcMain.on('minimize-window', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  win.minimize();
});

// 处理来自渲染进程的最大化/还原窗口请求
ipcMain.on('maximize-window', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win.isMaximized()) {
    win.unmaximize();
  } else {
    win.maximize();
  }
});

// 处理来自渲染进程的关闭窗口请求
ipcMain.on('close-window', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  win.close();
});

// 无需额外的open-child-window处理器，因为已在上面统一处理

// 处理来自渲染进程的打开开发者工具请求
ipcMain.on('open-dev-tools', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  win.webContents.openDevTools();
});

// 处理来自渲染进程的发送系统通知请求
ipcMain.on('send-notification', (event, { title, body }) => {
  console.log('收到通知请求:', { title, body });
  
  // 检查是否支持通知
  const isSupported = Notification.isSupported();
  console.log('通知是否支持:', isSupported);
  
  if (isSupported) {
    // 创建通知对象
    const notification = new Notification({ 
      title: title || '通知', 
      body: body || '这是一条系统通知',
      timeoutType: 'default'
    });
    
    // 监听通知显示事件
    notification.on('show', () => {
      console.log('通知已显示');
    });
    
    // 监听通知错误事件
    notification.on('error', (error) => {
      console.error('通知显示错误:', error);
    });
    
    // 显示通知
    notification.show();
    console.log('尝试显示通知');
  } else {
    console.log('当前系统不支持通知');
  }
});


// 处理来自渲染进程的显示保存对话框请求
ipcMain.handle('show-save-dialog', async (event, options) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  try {
    const result = await dialog.showSaveDialog(win, options);
    return result;
  } catch (error) {
    return { canceled: true, error: error.message };
  }
});

// 处理来自渲染进程的写入项目文件夹中文件的请求
ipcMain.handle('write-to-project-file', async (event, filename, content) => {
  try {
    let filePath;
    
    // 检查是否为绝对路径
    if (path.isAbsolute(filename)) {
      // 如果是绝对路径，直接使用
      filePath = filename;
    } else {
      // 如果是相对路径，将其解析为相对于项目根目录的路径
      const projectRoot = app.getAppPath();
      filePath = path.join(projectRoot, filename);
    }
    
    // 确保目录存在
    const dir = path.dirname(filePath);
    await fs.promises.mkdir(dir, { recursive: true });
    
    // 检查路径是否指向一个已存在的目录，如果是则添加默认文件名
    try {
      const stats = await fs.promises.stat(filePath);
      if (stats.isDirectory()) {
        // 如果路径是一个目录，则在该目录下创建默认文件
        filePath = path.join(filePath, 'user-data.txt');
      }
    } catch (statError) {
      // 如果stat失败，说明文件/目录不存在，这是正常的
      // 我们将继续使用原始filePath
    }
    
    // 写入文件
    await fs.promises.writeFile(filePath, content, 'utf-8');
    
    return { success: true, path: filePath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});




// 当 Electron 完成初始化并准备创建浏览器窗口时调用此方法
app.whenReady().then(() => {
  // 移除所有菜单项
  Menu.setApplicationMenu(null);
  createWindow();

  // 监听应用激活事件（适用于 macOS）
  app.on('activate', () => {
    // 在 macOS 上，当单击 dock 图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 当所有窗口都关闭时退出应用（Windows & Linux）
app.on('window-all-closed', () => {
  // 在 macOS 上，应用程序及其菜单栏通常会保持活动状态
  // 直到用户明确退出（使用 Cmd + Q 快捷键）
  if (process.platform !== 'darwin') app.quit();
});