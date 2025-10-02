//==============================================================
// 对话框管理模块
//==============================================================

/**
 * 打开设置弹窗函数
 * 创建并显示自定义设置对话框，包含主题选择功能
 */
function openDialogsz() {
    // 获取对话框元素
    const dialog = document.getElementById('myDialogsz');
    
    // 检查是否成功获取到dialog元素
    if (!dialog) {
        console.error('无法找到ID为myDialogsz的元素');
        return;
    }
    
    // 替换整个内容
    dialog.innerHTML = `
        <h3>自定义设置</h3>
        <p>选择你喜欢的主题</p>
        <button class="buttonwhite" data-theme="light" onclick="setTheme('light')">明亮模式</button>
        <button class="buttonwhite" data-theme="dark" onclick="setTheme('dark')">暗黑模式</button>
        <button class="buttonwhite" data-theme="blue" onclick="setTheme('blue')">蓝色模式</button>
        
        <input type="file" id="custom-theme-input" accept=".css" style="display: none;">
        <button class="buttonwhite" id="custom-theme-btn">自定义主题</button>
          </br>
        <button onclick="closeDialog()" class="buttonwhite">确定</button>
    `;
    
    // 打开设置弹窗
    dialog.showModal();
    
    // 使用setTimeout确保元素已渲染完成后再添加事件监听器
    setTimeout(() => {
        // 获取自定义主题按钮和文件输入元素
        const customThemeBtn = dialog.querySelector('#custom-theme-btn');
        const customThemeInput = dialog.querySelector('#custom-theme-input');
        
        // 检查元素是否存在
        if (customThemeBtn && customThemeInput) {
            // 为自定义主题按钮添加点击事件监听器
            customThemeBtn.addEventListener('click', function() {
                customThemeInput.click();
            });

            // 为文件输入元素添加变更事件监听器
            customThemeInput.addEventListener('change', function(e) {
                // 获取选择的文件
                const file = e.target.files[0];
                // 检查文件是否存在
                if (file) {
                    // 创建文件的URL对象
                    const fileURL = URL.createObjectURL(file);
                    // 更新themes对象中的custom路径
                    if (typeof themes !== 'undefined') {
                        themes.custom = fileURL;
                        localStorage.setItem('customThemePath', fileURL);
                        setTheme('custom');
                    }
                }
            });
        }
    }, 0);
}

/**
 * 关闭设置弹窗函数
 * 关闭ID为myDialogsz的对话框
 */
function closeDialog() {
    const dialog = document.getElementById('myDialogsz');
    if (dialog) {
        dialog.close();
    }
    handleWindowBasedOnStatus();
}

/**
 * 打开错误对话框
 */
function openErrorDialog() {
    const dialog = document.getElementById('ErrorDialog');
    if (dialog) {
        dialog.showModal();
    }
}

/**
 * 关闭错误对话框
 */
function closeErrorDialog() {
    const dialog = document.getElementById('ErrorDialog');
    if (dialog) {
        dialog.close();
    }
}

//==============================================================
// 子窗口管理模块
//==============================================================

/**
 * 根据子窗口状态执行操作：
 * 如果子窗口已打开：关闭再打开
 * 如果子窗口未打开：发送错误通知
 */
async function handleWindowBasedOnStatus() {
    try {
        // 检查子窗口是否打开
        const isOpen = await isChildWindowOpen();
        
        if (isOpen) {
            // 子窗口已打开：关闭再打开
            console.log('子窗口已打开，执行关闭再打开操作');
            closeAndReopenChildWindow();
        } else {
            // 子窗口未打开：发送错误通知
            console.log('子窗口未打开，发送错误通知');
            sendWindowNotOpenError();
        }
    } catch (error) {
        console.error('检查子窗口状态时发生错误:', error);
        sendWindowStatusCheckError(error);
    }
}

/**
 * 关闭并重新打开子窗口
 */
function closeAndReopenChildWindow() {
    // 检查是否在Electron环境中运行
    if (typeof window.electronAPI !== 'undefined') {
        console.log('正在关闭并重新打开子窗口...');
        try {
            window.electronAPI.closeChildWindow();
            // 稍微延迟再打开，确保窗口完全关闭
            setTimeout(() => {
                window.electronAPI.openChildWindow();
                console.log('子窗口已重新打开');
            }, 500);
        } catch (error) {
            console.error('关闭并重新打开子窗口时发生错误:', error);
        }
    } else {
        console.warn('Electron API 不可用');
    }
}

/**
 * 检查子窗口是否打开
 * @returns {Promise<boolean>} 子窗口是否打开
 */
async function isChildWindowOpen() {
    // 检查是否在Electron环境中运行
    if (typeof window.electronAPI !== 'undefined') {
        try {
            const isOpen = await window.electronAPI.isChildWindowOpen();
            console.log('子窗口状态:', isOpen);
            return isOpen;
        } catch (error) {
            console.error('检查子窗口状态时发生错误:', error);
            return false;
        }
    } else {
        console.warn('Electron API 不可用');
        return false;
    }
}

/**
 * 关闭子窗口函数
 */
function closeChildWindow() {
    // 检查是否在Electron环境中运行
    if (typeof window.electronAPI !== 'undefined') {
        console.log('正在尝试关闭子窗口');
        try {
            window.electronAPI.closeChildWindow();
            console.log('关闭命令已发送到 Electron 主进程');
        } catch (error) {
            console.error('关闭子窗口时发生错误:', error);
        }
    } else {
        console.warn('Electron API 不可用');
    }
}

/**
 * 打开子窗口函数
 */
function openChildWindow() {
    // 检查是否在Electron环境中运行
    if (typeof window.electronAPI !== 'undefined') {
        console.log('正在尝试打开子窗口');
        try {
            window.electronAPI.openChildWindow();
            console.log('打开命令已发送到 Electron 主进程');
        } catch (error) {
            console.error('打开子窗口时发生错误:', error);
        }
    } else {
        console.warn('Electron API 不可用');
    }
}

//==============================================================
// 通知管理模块
//==============================================================

/**
 * 发送子窗口未打开错误通知

function sendWindowNotOpenError() {
    // 检查是否在Electron环境中运行
    if (typeof window.electronAPI !== 'undefined') {
        try {
            window.electronAPI.sendNotification(
                '操作失败', 
                '无法执行操作，因为子窗口未打开'
            );
            console.log('已发送子窗口未打开错误通知');
        } catch (error) {
            console.error('发送错误通知时发生错误:', error);
        }
    } else {
        // 在浏览器环境中使用alert作为替代
        alert('操作失败：子窗口未打开');
        console.warn('Electron API 不可用，使用alert替代');
    }
}

/**
 * 发送窗口状态检查错误通知
 * @param {Error} error - 错误对象

function sendWindowStatusCheckError(error) {
    // 检查是否在Electron环境中运行
    if (typeof window.electronAPI !== 'undefined') {
        try {
            window.electronAPI.sendNotification(
                '系统错误', 
                '检查窗口状态时发生错误: ' + error.message
            );
            console.log('已发送窗口状态检查错误通知');
        } catch (err) {
            console.error('发送错误通知时发生错误:', err);
        }
    } else {
        // 在浏览器环境中使用alert作为替代
        alert('系统错误：检查窗口状态时发生错误: ' + error.message);
        console.warn('Electron API 不可用，使用alert替代');
    }
}

/**
 * 发送测试通知函数
 * 发送一条测试通知
 */
function sendTestNotification() {
    window.electronAPI.sendNotification('测试通知', '这是一条测试通知消息');
}

/**
 * 发送自定义通知函数
 * 根据用户输入发送自定义通知
 */
function sendCustomNotification() {
    const title = document.getElementById('notificationTitle').value || '自定义通知';
    const body = document.getElementById('notificationBody').value || '这是一条自定义通知消息';
    window.electronAPI.sendNotification(title, body);
}