// ========== 核心算法：智能分配硬币 ==========
class CoinsCalculator {
    constructor() {
        console.log('Coins Calculator 已初始化');
    }

    /**
     * 智能分配算法
     */
    adjustAllocationSmartly(total, playerCount, deductions) {
        // 验证输入
        if (playerCount < 4 || playerCount > 6) {
            throw new Error('玩家人数必须是4、5或6');
        }

        // 步骤1：计算基础分配
        let baseAllocations = [];
        let basePerPlayer = Math.floor(total / playerCount);
        let remainder = total % playerCount;

        // 正确的基础分配：前remainder个玩家多分1个
        for (let i = 0; i < playerCount; i++) {
            baseAllocations.push((i < remainder) ? basePerPlayer + 1 : basePerPlayer);
        }

        // 步骤2：应用扣减
        let actualGains = [];
        for (let i = 0; i < playerCount; i++) {
            const deduction = Math.min(deductions[i] || 0, baseAllocations[i]);
            actualGains.push(Math.max(0, baseAllocations[i] - deduction));
        }

        // 步骤3：计算差异
        let currentTotal = actualGains.reduce((a, b) => a + b, 0);
        let difference = total - currentTotal;

        // 步骤4：智能重新分配差异
        if (difference > 0) {
            let playersToAdjust = [];
            for (let i = 0; i < playerCount; i++) {
                if (deductions[i] === 0) {
                    playersToAdjust.push({
                        index: i,
                        currentGain: actualGains[i],
                        shouldHave: baseAllocations[i]
                    });
                }
            }

            if (playersToAdjust.length === 0) {
                for (let i = 0; i < playerCount; i++) {
                    playersToAdjust.push({
                        index: i,
                        currentGain: actualGains[i],
                        shouldHave: baseAllocations[i]
                    });
                }
            }

            playersToAdjust.sort((a, b) => {
                if (a.currentGain !== b.currentGain) return a.currentGain - b.currentGain;
                return a.shouldHave - b.shouldHave;
            });

            while (difference > 0) {
                for (let i = 0; i < playersToAdjust.length && difference > 0; i++) {
                    let player = playersToAdjust[i];
                    actualGains[player.index] += 1;
                    difference -= 1;
                    player.currentGain += 1;
                }
                playersToAdjust.sort((a, b) => {
                    if (a.currentGain !== b.currentGain) return a.currentGain - b.currentGain;
                    return a.shouldHave - b.shouldHave;
                });
            }
        } else if (difference < 0) {
            let playersToReduce = [];
            for (let i = 0; i < playerCount; i++) {
                playersToReduce.push({
                    index: i,
                    currentGain: actualGains[i]
                });
            }

            playersToReduce.sort((a, b) => b.currentGain - a.currentGain);

            while (difference < 0) {
                for (let i = 0; i < playersToReduce.length && difference < 0; i++) {
                    let player = playersToReduce[i];
                    if (actualGains[player.index] > 0) {
                        actualGains[player.index] -= 1;
                        difference += 1;
                        player.currentGain -= 1;
                    }
                }
                playersToReduce.sort((a, b) => b.currentGain - a.currentGain);
            }
        }

        return actualGains;
    }

    /**
     * 计算基础分配
     */
    calculateBaseAllocation(total, playerCount) {
        const basePerPlayer = Math.floor(total / playerCount);
        const remainder = total % playerCount;
        const baseAllocations = [];
        
        for (let i = 0; i < playerCount; i++) {
            baseAllocations.push((i < remainder) ? basePerPlayer + 1 : basePerPlayer);
        }
        
        return { baseAllocations, basePerPlayer, remainder, playerCount };
    }

    /**
     * 解析玩家名字
     */
    parsePlayerOrder(orderText) {
        const players = [];
        
        if (!orderText || orderText.trim() === '') {
            return ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
        }
        
        const parts = orderText.split(',');
        
        for (let part of parts) {
            const trimmedPart = part.trim();
            const match = trimmedPart.match(/(\d+)\s*[-\u2013\u2014>]\s*(.+)/);
            if (match && match[2]) {
                players.push(match[2].trim());
            } else if (trimmedPart && !trimmedPart.match(/^\d/)) {
                players.push(trimmedPart);
            }
        }
        
        if (players.length === 0) {
            return ['Player 1', 'Player 2', 'Player 3', 'Player 4'];
        }
        
        return players;
    }

    /**
     * 格式化玩家顺序
     */
    formatPlayerOrder(players) {
        return players.map((player, index) => `${index + 1} - ${player}`).join(', ');
    }
}

// 导出实例
const coinsCalculator = new CoinsCalculator();
