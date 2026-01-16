// ========== 本地存储管理 ==========
class StorageManager {
    constructor() {
        this.STORAGE_KEY = 'coins-calculator-data';
        this.defaultData = {
            playerCount: 4,
            totalCoins: 100,
            playerNames: ['Player 1', 'Player 2', 'Player 3', 'Player 4'],
            deductions: [0, 0, 0, 0],
            theme: 'light',
            language: 'zh-CN'
        };
    }

    /**
     * 保存数据到本地存储
     */
    save(data) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('保存数据失败:', error);
            return false;
        }
    }

    /**
     * 从本地存储加载数据
     */
    load() {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('加载数据失败:', error);
        }
        return { ...this.defaultData };
    }

    /**
     * 清除所有保存的数据
     */
    clear() {
        localStorage.removeItem(this.STORAGE_KEY);
    }

    /**
     * 导出数据为JSON文件
     */
    exportData(data) {
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `coins-calculator-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /**
     * 从文件导入数据
     */
    importData(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    this.save(data);
                    resolve(data);
                } catch (error) {
                    reject(new Error('文件格式错误'));
                }
            };
            
            reader.onerror = () => reject(new Error('读取文件失败'));
            reader.readAsText(file);
        });
    }

    /**
     * 保存计算历史
     */
    saveHistory(calculation) {
        const history = this.loadHistory();
        history.unshift({
            ...calculation,
            timestamp: new Date().toISOString(),
            id: Date.now()
        });
        
        // 只保存最近50条记录
        if (history.length > 50) {
            history.pop();
        }
        
        localStorage.setItem('coins-calculator-history', JSON.stringify(history));
    }

    /**
     * 加载计算历史
     */
    loadHistory() {
        try {
            const history = localStorage.getItem('coins-calculator-history');
            return history ? JSON.parse(history) : [];
        } catch (error) {
            console.error('加载历史失败:', error);
            return [];
        }
    }

    /**
     * 清除计算历史
     */
    clearHistory() {
        localStorage.removeItem('coins-calculator-history');
    }
}

// 导出单例实例
const storageManager = new StorageManager();
