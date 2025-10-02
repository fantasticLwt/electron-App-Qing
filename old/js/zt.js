// 主题配置对象 - 使用外部CSS文件
// 该对象包含所有可用的主题配置
const themes = {
    light: 'styles/style.css',    // 白天主题 - 默认明亮模式样式文件路径
    dark: 'styles/styletwo.css',  // 夜晚主题 - 暗黑模式样式文件路径
    blue: 'styles/stylebule.css', // 蓝色主题 - 蓝色样式文件路径
    custom: localStorage.getItem('customThemePath') || '' // 自定义主题 - 用户选择的自定义CSS文件路径
};


/**
 * 设置页面主题函数
 * @param {string} themeName - 要应用的主题名称
 */
function setTheme(themeName) {
    // 获取主题链接元素
    const themeLink = document.getElementById('theme-link');
    
    // 检查主题是否存在且不为空
    if (themes[themeName] !== undefined && themes[themeName] !== '') {
        themeLink.href = themes[themeName];
        localStorage.setItem('selectedTheme', themeName);
        updateActiveButton(themeName);
        
        // 在每次切换主题时关闭再打开子窗口
        
    }
}






/**
 * 更新主题按钮激活状态函数
 * @param {string} activeTheme - 当前激活的主题名称
 */
function updateActiveButton(activeTheme) {
    // 移除所有主题按钮的激活状态
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 为当前主题按钮添加激活状态
    const activeBtn = document.querySelector(`[data-theme="${activeTheme}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// 页面加载时应用保存的主题
document.addEventListener('DOMContentLoaded', function() {
    // 获取自定义主题按钮和文件输入元素
    const customThemeBtn = document.getElementById('custom-theme-btn');
    const customThemeInput = document.getElementById('custom-theme-input');
    
    // 检查元素是否存在
    if (customThemeBtn && customThemeInput) {
        // 为自定义主题按钮添加点击事件监听器
        customThemeBtn.addEventListener('click', function() {
            customThemeInput.click();
        });

        // 为文件输入元素添加变更事件监听器
        customThemeInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const fileURL = URL.createObjectURL(file);
                themes.custom = fileURL;
                localStorage.setItem('customThemePath', fileURL);
                setTheme('custom');
            }
        });
    }
    
    // 获取保存的主题设置，默认为light主题
    const savedTheme = localStorage.getItem('selectedTheme') || 'light';
    setTheme(savedTheme);
});