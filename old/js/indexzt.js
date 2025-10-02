// 主题配置 - 使用外部CSS文件index.html专用！
        const themes = {
            light: 'html/styles/style.css',  // 白天主题
            dark: 'html/styles/styletwo.css',     // 夜晚主题
            custom: localStorage.getItem('customThemePath') || '' // 自定义主题
        };
        
        // 将themes对象暴露到全局作用域
        window.themes = themes;
        
        // 设置主题函数
        function setTheme(themeName) {
            const themeLink = document.getElementById('theme-link');
            if (themes[themeName] !== undefined && themes[themeName] !== '') {
                themeLink.href = themes[themeName];
                localStorage.setItem('selectedTheme', themeName);
                updateActiveButton(themeName);
            }
        }
        
        // 将setTheme函数暴露到全局作用域
        window.setTheme = setTheme;
        
        // 更新激活按钮状态
        function updateActiveButton(activeTheme) {
            document.querySelectorAll('.theme-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            const activeBtn = document.querySelector(`[data-theme="${activeTheme}"]`);
            if (activeBtn) {
                activeBtn.classList.add('active');
            }
        }
        
        // 页面加载时应用保存的主题
        document.addEventListener('DOMContentLoaded', function() {
            // 添加自定义主题文件选择事件监听器
            const customThemeBtn = document.getElementById('custom-theme-btn');
            const customThemeInput = document.getElementById('custom-theme-input');
            
            if (customThemeBtn && customThemeInput) {
                customThemeBtn.addEventListener('click', function() {
                    customThemeInput.click();
                });

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
            
            const savedTheme = localStorage.getItem('selectedTheme') || 'light';
            setTheme(savedTheme);
        });