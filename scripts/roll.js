// ========== Roll点功能模块 ==========
class RollManager {
    constructor() {
        this.rollHistory = [];
        this.maxHistory = 10;
    }

    /**
     * 生成随机数（1-100）
     */
    generateRandomNumber(usedNumbers = new Set()) {
        let roll;
        let attempts = 0;
        
        do {
            roll = Math.floor(Math.random() * 100) + 1;
            attempts++;
            if (attempts > 1000) {
                roll = Math.floor(Math.random() * 100) + 1;
                break;
            }
        } while (usedNumbers.has(roll));
        
        return roll;
    }

    /**
     * 为玩家生成Roll点结果
     */
    rollForPlayers(players) {
    const checkedPlayers = players.filter(player => player.checked);
    
    if (checkedPlayers.length === 0) {
        throw new Error('请至少勾选一名参与Roll点的玩家！');
    }

    const usedNumbers = new Set();
    const rollResults = checkedPlayers.map(player => {
        const roll = this.generateRandomNumber(usedNumbers);
        usedNumbers.add(roll);
        return { 
            ...player, 
            rollResult: roll,
            originalIndex: player.index  // 保存原始索引
        };
    });

    // 按点数降序排序
    rollResults.sort((a, b) => b.rollResult - a.rollResult);
    
    this.addToHistory(rollResults);
    return rollResults;
}

    /**
     * 添加记录到历史
     */
    addToHistory(rollResults) {
        const historyEntry = {
            timestamp: new Date().toLocaleString('zh-CN'),
            results: [...rollResults],
            totalPlayers: rollResults.length
        };

        this.rollHistory.unshift(historyEntry);
        if (this.rollHistory.length > this.maxHistory) {
            this.rollHistory.pop();
        }
    }

    /**
     * 获取Roll点历史
     */
    getHistory() {
        return this.rollHistory;
    }

    /**
     * 清空历史记录
     */
    clearHistory() {
        this.rollHistory = [];
    }

    /**
     * 生成Roll点结果HTML
     */
    generateResultsHTML(rollResults) {
        if (!rollResults || rollResults.length === 0) {
            return '<div class="empty-results">暂无Roll点结果</div>';
        }

        let html = '<div class="roll-results-list">';
        
        rollResults.forEach((player, index) => {
            const rank = index + 1;
            const rankClass = this.getRankClass(rank);
            
            html += `
                <div class="roll-result-item ${rankClass}">
                    <div class="roll-rank">#${rank}</div>
                    <div class="roll-player">${player.name}</div>
                    <div class="roll-value">🎲 ${player.rollResult}</div>
                    <div class="roll-emoji">${this.getRankEmoji(rank)}</div>
                </div>
            `;
        });

        html += '</div>';
        return html;
    }

    /**
     * 根据排名获取CSS类名
     */
    getRankClass(rank) {
        switch(rank) {
            case 1: return 'rank-first';
            case 2: return 'rank-second';
            case 3: return 'rank-third';
            default: return 'rank-other';
        }
    }

    /**
     * 根据排名获取表情符号
     */
    getRankEmoji(rank) {
        switch(rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return '🎯';
        }
    }

    /**
     * 随机打乱玩家顺序
     */
    shufflePlayers(players) {
        const shuffled = [...players];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
}

// 导出实例
const rollManager = new RollManager();
