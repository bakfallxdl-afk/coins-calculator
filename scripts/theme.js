// ========== 主题管理 ==========
class ThemeManager {
    constructor() {
        this.themes = {
            light: {
                name: '浅色主题',
                colors: {
                    primary: '#667eea',
                    background: '#f5f7fa',
                    card: '#ffffff',
                    text: '#2d3748'
                }
            },
            dark: {
                name: '深色主题',
                colors: {
                    primary: '#7c3aed',
                    background: '#1a202c',
                    card: '#2d3748',
                    text: '#f7fafc'
                }
            },
            blue: {
                name: '蓝色主题',
                colors: {
                    primary: '#3182ce',
                    background: '#ebf8ff',
                    card: '#ffffff',
                    text: '#2d3748'
                }
            }
        };
        
        this.currentTheme = 'light';
        this.init();
    }

    /**
     * 初始化主题
     */
    init() {
        const savedTheme = localStorage.getItem('coins-calculator-theme') || 'light';
        this.setTheme(savedTheme);
    }

    /**
     * 设置主题
     */
    setTheme(themeName) {
        if (!this.themes[themeName]) {
            console.warn(`主题 ${themeName} 不存在`);
            return;
        }
        
        this.currentTheme = themeName;
        const theme = this.themes[themeName];
        
        // 应用CSS变量
        const root = document.documentElement;
        root.style.setProperty('--primary-color', theme.colors.primary);
        root.style.setProperty('--background-color', theme.colors.background);
        root.style.setProperty('--card-color', theme.colors.card);
        root.style.setProperty('--text-color', theme.colors.text);
        
        // 保存到本地存储
        localStorage.setItem('coins-calculator-theme', themeName);
        
        // 触发主题改变事件
        document.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: themeName, themeData: theme }
        }));
    }

    /**
     * 获取当前主题
     */
    getCurrentTheme() {
        return this.themes[this.currentTheme];
    }

    /**
     * 获取所有主题
     */
    getAllThemes() {
        return Object.keys(this.themes).map(key => ({
            id: key,
            ...this.themes[key]
        }));
    }

    /**
     * 创建主题选择器HTML
     */
    createThemeSelector() {
        const themes = this.getAllThemes();
        let html = '<div class="theme-selector">';
        
        themes.forEach(theme => {
            const isActive = theme.id === this.currentTheme;
            html += `
                <button class="theme-option ${isActive ? 'active' : ''}" 
                        data-theme="${theme.id}"
                        style="background: ${theme.colors.primary}">
                    <div class="theme-preview" style="background: ${theme.colors.background}">
                        <div class="theme-card" style="background: ${theme.colors.card}"></div>
                    </div>
                    <span>${theme.name}</span>
                </button>
            `;
        });
        
        html += '</div>';
        return html;
    }

    /**
     * 切换下一个主题
     */
    cycleNextTheme() {
        const themeKeys = Object.keys(this.themes);
        const currentIndex = themeKeys.indexOf(this.currentTheme);
        const nextIndex = (currentIndex + 1) % themeKeys.length;
        this.setTheme(themeKeys[nextIndex]);
    }
}

// 导出单例实例
const themeManager = new ThemeManager();
