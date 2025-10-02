document.addEventListener('DOMContentLoaded', () => {
    // 确保在Electron环境中运行
    if (typeof window.electronAPI !== 'undefined') {
        const minimizeBtn = document.getElementById('minimize');
        const maximizeBtn = document.getElementById('maximize');
        const closeBtn = document.getElementById('close');
        
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => {
                window.electronAPI.minimizeWindow();
            });
        }

        if (maximizeBtn) {
            maximizeBtn.addEventListener('click', () => {
                window.electronAPI.maximizeWindow();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                window.electronAPI.closeWindow();
            });
        }
    }
});