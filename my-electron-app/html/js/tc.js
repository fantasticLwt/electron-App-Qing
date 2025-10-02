//==============================================================
// 对话框管理模块
//==============================================================

/**
 * 调整颜色亮度函数
 * @param {string} hex - 十六进制颜色值
 * @param {number} brightness - 亮度调整值 (-100 到 100)
 * @param {number} alpha - 透明度 (0 到 1)
 * @returns {string} 调整后的颜色值
 */
function adjustColorBrightness(hex, brightness = 0, alpha = 1) {
    // 移除 # 符号并转换为大写
    hex = hex.replace('#', '').toUpperCase();
    
    // 如果是3位十六进制数，则转换为6位
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }
    
    // 解析RGB值
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    // 调整亮度
    r = Math.min(255, Math.max(0, r + brightness * 2.55));
    g = Math.min(255, Math.max(0, g + brightness * 2.55));
    b = Math.min(255, Math.max(0, b + brightness * 2.55));
    
    // 应用透明度
    if (alpha < 1) {
        return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${alpha})`;
    } else {
        return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
    }
}

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
        <button class="buttonwhite theme-btn" data-theme="light" onclick="setTheme('light')">明亮模式</button>
        <button class="buttonwhite theme-btn" data-theme="dark" onclick="setTheme('dark')">暗黑模式</button>
        <button class="buttonwhite theme-btn" data-theme="blue" onclick="setTheme('blue')">蓝色模式</button>
        <button class="buttonwhite" id="custom-theme-btn">自定义主题</button>
        <div class="color-settings">
            <p>自定义背景色</p>
            <input type="color" id="bg-main-color" value="#ffffff" style="width: 100%; height: 40px; cursor: pointer; border-radius: 15px;">

            <p>调整背景透明度</p>
           
                <input type="number" id="alpha-value-input" min="0" max="100" value="100" style="width: 90%; text-align: center; border-radius: 15px;">
                <span id="alpha-value" style="display: none;">100%</span>
         
          
                <input type="number" id="brightness-value-input" min="-100" max="100" value="0" style="width: 90%; text-align: center; border-radius: 15px;">
                <span id="brightness-value" style="display: none;">0%</span>
           
            
            
                <button class="buttonwhite" id="apply-custom-bg" style="flex: 1;">应用背景设置</button>
                <button class="buttonwhite" id="reset-custom-bg" style="flex: 1;">重置背景设置</button>
           
        </div>
        <input type="file" id="custom-theme-input" accept=".css" style="display: none;">
        
         
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
        
        // 自定义背景色功能
        const applyCustomBgBtn = dialog.querySelector('#apply-custom-bg');
        const resetCustomBgBtn = dialog.querySelector('#reset-custom-bg');
        const bgMainColor = dialog.querySelector('#bg-main-color');
        const alphaValueInput = dialog.querySelector('#alpha-value-input');
        const brightnessValueInput = dialog.querySelector('#brightness-value-input');
        
        // 设置颜色选择器的初始值
        if (bgMainColor) bgMainColor.value = localStorage.getItem('customBgMainColor') || '#ffffff';
        
        // 应用自定义背景色
        if (applyCustomBgBtn) {
            applyCustomBgBtn.addEventListener('click', function() {
                applyCustomBackgroundColor();
            });
        }
        
        // 重置背景色
        if (resetCustomBgBtn) {
            resetCustomBgBtn.addEventListener('click', function() {
                resetCustomBackgroundColor();
            });
        }
    }, 0);
}

/**
 * 应用自定义背景色函数
 * 将颜色选择器中选择的颜色应用到页面背景并保存到localStorage
 */
function applyCustomBackgroundColor() {
    const bgMainColor = document.querySelector('#bg-main-color');
    if (bgMainColor) {
        // 只修改body背景色
        document.body.style.backgroundColor = bgMainColor.value;
        // 保存到localStorage
        localStorage.setItem('customBgMainColor', bgMainColor.value);
    }
}

/**
 * 重置自定义背景色函数
 * 清除保存的背景色设置并恢复默认样式
 */
function resetCustomBackgroundColor() {
    // 清除保存的背景色设置
    localStorage.removeItem('customBgMainColor');
    
    // 重置body背景色
    document.body.style.backgroundColor = '';
    
    // 如果在设置弹窗中，也重置颜色选择器的值
    const bgMainColor = document.querySelector('#bg-main-color');
    if (bgMainColor) {
        bgMainColor.value = '#ffffff';
    }
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