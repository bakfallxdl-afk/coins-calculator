// ========== 更新管理器 ==========
class UpdateManager {
    constructor(app) {
        this.app = app;
        this.initUpdates();
    }

    initUpdates() {
        // 初始化主题选择器
        this.initThemeSelector();
        
        // 初始化数据操作
        this.initDataActions();
        
        // 初始化历史记录
        this.initHistory();
        
        // 添加键盘快捷键
        this.initKeyboardShortcuts();
    }

    initThemeSelector() {
        const themeContainer = document.getElementById('themeSelector');
        if (themeContainer) {
            themeContainer.innerHTML = themeManager.createThemeSelector();
            
            // 绑定主题切换事件
            themeContainer.addEventListener('click', (e) => {
                const themeBtn = e.target.closest('.theme-option');
                if (themeBtn) {
                    const themeName = themeBtn.dataset.theme;
                    themeManager.setTheme(themeName);
                    this.updateThemeSelector();
                }
            });
        }
        
        // 监听主题变化
        document.addEventListener('themeChanged', () => {
            this.updateThemeSelector();
        });
    }

    updateThemeSelector() {
        const themeContainer = document.getElementById('themeSelector');
        if (themeContainer) {
            themeContainer.innerHTML = themeManager.createThemeSelector();
        }
    }

    initDataActions() {
        // 保存设置
        const saveBtn = document.getElementById('saveSettings');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveCurrentSettings();
            });
        }

        // 导出数据
        const exportBtn = document.getElementById('exportData');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportCurrentData();
            });
        }

        // 导入数据
        const importInput = document.getElementById('importData');
        if (importInput) {
            importInput.addEventListener('change', (e) => {
                this.importData(e.target.files[0]);
            });
        }
    }

    saveCurrentSettings() {
        const data = {
            playerCount: this.app.state.playerCount,
            totalCoins: this.app.state.totalCoins,
            playerNames: this.app.state.playerNames,
            deductions: this.app.state.deductions,
            theme: themeManager.currentTheme
        };
        
        if (storageManager.save(data)) {
            this.app.showNotification('设置已保存！', 'success');
        } else {
            this.app.showNotification('保存失败', 'error');
        }
    }

    exportCurrentData() {
        const data = {
            playerCount: this.app.state.playerCount,
            totalCoins: this.app.state.totalCoins,
            playerNames: this.app.state.playerNames,
            deductions: this.app.state.deductions,
            theme: themeManager.currentTheme,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        storageManager.exportData(data);
        this.app.showNotification('数据已导出！', 'success');
    }

    async importData(file) {
        if (!file) return;
        
        try {
            const data = await storageManager.importData(file);
            
            // 更新应用状态
            this.app.state.playerCount = data.playerCount || 4;
            this.app.state.totalCoins = data.totalCoins || 100;
            this.app.state.playerNames = data.playerNames || ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
            this.app.state.deductions = data.deductions || [0, 0, 0, 0];
            
            if (data.theme) {
                themeManager.setTheme(data.theme);
            }
            
            // 更新UI
            this.app.updatePlayerCount();
            this.app.updateResults();
            
            this.app.showNotification('数据导入成功！', 'success');
        } catch (error) {
            this.app.showNotification(`导入失败: ${error.message}`, 'error');
        }
    }

    initHistory() {
        // 保存当前计算
        const saveCurrentBtn = document.getElementById('saveCurrent');
        if (saveCurrentBtn) {
            saveCurrentBtn.addEventListener('click', () => {
                this.saveToHistory();
            });
        }

        // 清空历史
        const clearHistoryBtn = document.getElementById('clearHistory');
        if (clearHistoryBtn) {
            clearHistoryBtn.addEventListener('click', () => {
                if (confirm('确定要清空所有历史记录吗？')) {
                    storageManager.clearHistory();
                    this.loadHistory();
                    this.app.showNotification('历史记录已清空', 'info');
                }
            });
        }

        // 初始加载历史
        this.loadHistory();
    }

    saveToHistory() {
        const historyEntry = {
            playerCount: this.app.state.playerCount,
            totalCoins: this.app.state.totalCoins,
            playerNames: [...this.app.state.playerNames],
            deductions: [...this.app.state.deductions],
            timestamp: new Date().toLocaleString('zh-CN'),
            total: this.app.state.totalCoins
        };
        
        storageManager.saveHistory(historyEntry);
        this.loadHistory();
        this.app.showNotification('已保存到历史记录', 'success');
    }

    loadHistory() {
        const historyList = document.getElementById('historyList');
        if (!historyList) return;
        
        const history = storageManager.loadHistory();
        
        if (history.length === 0) {
            historyList.innerHTML = '<div class="empty-history">暂无历史记录</div>';
            return;
        }
        
        let html = '';
        history.forEach((item, index) => {
            html += `
                <div class="history-item">
                    <div class="history-info">
                        <div class="history-title">
                            ${item.playerCount}人 - ${item.totalCoins}硬币
                        </div>
                        <div class="history-timestamp">
                            ${item.timestamp}
                        </div>
                    </div>
                    <div class="history-actions">
                        <button class="history-restore" data-index="${index}">恢复</button>
                        <button class="history-delete" data-index="${index}">删除</button>
                    </div>
                </div>
            `;
        });
        
        historyList.innerHTML = html;
        
        // 绑定历史项事件
        this.bindHistoryEvents();
    }

    bindHistoryEvents() {
        // 恢复历史记录
        document.querySelectorAll('.history-restore').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.restoreFromHistory(index);
            });
        });

        // 删除历史记录
        document.querySelectorAll('.history-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.deleteFromHistory(index);
            });
        });
    }

    restoreFromHistory(index) {
        const history = storageManager.loadHistory();
        if (history[index]) {
            const item = history[index];
            
            this.app.state.playerCount = item.playerCount;
            this.app.state.totalCoins = item.totalCoins;
            this.app.state.playerNames = [...item.playerNames];
            this.app.state.deductions = [...item.deductions];
            
            this.app.updatePlayerCount();
            this.app.updateResults();
            
            this.app.showNotification('历史记录已恢复', 'success');
        }
    }

    deleteFromHistory(index) {
        const history = storageManager.loadHistory();
        if (history[index]) {
            history.splice(index, 1);
            localStorage.setItem('coins-calculator-history', JSON.stringify(history));
            this.loadHistory();
            this.app.showNotification('历史记录已删除', 'info');
        }
    }

    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+S 保存设置
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveCurrentSettings();
            }
            
            // Ctrl+E 导出数据
            if (e.ctrlKey && e.key === 'e') {
                e.preventDefault();
                this.exportCurrentData();
            }
            
            // Ctrl+R 随机排序
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                this.app.randomizePlayerOrder();
            }
            
            // Ctrl+T 切换主题
            if (e.ctrlKey && e.key === 't') {
                e.preventDefault();
                themeManager.cycleNextTheme();
            }
        });
    }
}

// 初始化更新管理器
let updateManager;

document.addEventListener('DOMContentLoaded', () => {
    // 等待主应用初始化
    setTimeout(() => {
        if (window.app) {
            updateManager = new UpdateManager(window.app);
            console.log('更新管理器已初始化');
        }
    }, 100);
});
