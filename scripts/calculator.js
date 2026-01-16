// ========== 核心算法：智能分配硬币 ==========
class CoinsCalculator {
    constructor() {
        console.log('Coins Calculator 已初始化');
    }

    /**
     * 智能分配算法 - 按排名分配
     */
    adjustAllocationSmartly(total, playerCount, deductions) {
        // 验证输入
        if (playerCount < 4 || playerCount > 6) {
            throw new Error('玩家人数必须是4、5或6');
        }

        // 步骤1：计算基础分配（从大到小）
        let baseAllocations = [];
        let basePerPlayer = Math.floor(total / playerCount);
        let remainder = total % playerCount;

        // 基础分配从大到小：前remainder个位置多分1个
        for (let i = 0; i < playerCount; i++) {
            baseAllocations.push((i < remainder) ? basePerPlayer + 1 : basePerPlayer);
        }

        // 步骤2：按排名应用扣减
        let actualGains = [];
        // deductions参数现在应该是按排名排序的扣减值
        for (let i = 0; i < playerCount; i++) {
            const deduction = Math.min(deductions[i] || 0, baseAllocations[i]);
            actualGains.push(Math.max(0, baseAllocations[i] - deduction));
        }

        // 步骤3：计算差异
        let currentTotal = actualGains.reduce((a, b) => a + b, 0);
        let difference = total - currentTotal;

        // 步骤4：智能重新分配差异（保持排名顺序）
        if (difference > 0) {
            // 有剩余，按排名从高到低分配（保持排名优势）
            let playersToAdjust = [];
            for (let i = 0; i < playerCount; i++) {
                playersToAdjust.push({
                    index: i, // 排名索引
                    currentGain: actualGains[i],
                    baseGain: baseAllocations[i],
                    deduction: deductions[i] || 0
                });
            }

            // 优先给扣减少的玩家分配（保持公平）
            playersToAdjust.sort((a, b) => {
                // 先按扣减排序（扣减少的优先）
                if (a.deduction !== b.deduction) return a.deduction - b.deduction;
                // 再按当前获得排序（获得少的优先）
                if (a.currentGain !== b.currentGain) return a.currentGain - b.currentGain;
                // 最后按排名（排名高的优先）
                return a.index - b.index;
            });

            while (difference > 0) {
                for (let i = 0; i < playersToAdjust.length && difference > 0; i++) {
                    let player = playersToAdjust[i];
                    actualGains[player.index] += 1;
                    difference -= 1;
                    player.currentGain += 1;
                }
                
                // 重新排序
                playersToAdjust.sort((a, b) => {
                    if (a.deduction !== b.deduction) return a.deduction - b.deduction;
                    if (a.currentGain !== b.currentGain) return a.currentGain - b.currentGain;
                    return a.index - b.index;
                });
            }
        } else if (difference < 0) {
            // 扣减过多，需要减少分配
            let playersToReduce = [];
            for (let i = 0; i < playerCount; i++) {
                playersToReduce.push({
                    index: i,
                    currentGain: actualGains[i],
                    deduction: deductions[i] || 0
                });
            }

            // 优先从扣减多的玩家那里减少（他们本来就该少拿）
            playersToReduce.sort((a, b) => {
                // 先按扣减排序（扣减多的优先减少）
                if (a.deduction !== b.deduction) return b.deduction - a.deduction;
                // 再按当前获得排序（获得多的优先减少）
                if (a.currentGain !== b.currentGain) return b.currentGain - a.currentGain;
                // 最后按排名（排名低的优先减少）
                return b.index - a.index;
            });

            while (difference < 0) {
                for (let i = 0; i < playersToReduce.length && difference < 0; i++) {
                    let player = playersToReduce[i];
                    if (actualGains[player.index] > 0) {
                        actualGains[player.index] -= 1;
                        difference += 1;
                        player.currentGain -= 1;
                    }
                }
                
                // 重新排序
                playersToReduce.sort((a, b) => {
                    if (a.deduction !== b.deduction) return b.deduction - a.deduction;
                    if (a.currentGain !== b.currentGain) return b.currentGain - a.currentGain;
                    return b.index - a.index;
                });
            }
        }

        return actualGains;
    }

    /**
     * 计算基础分配 - 按排名从大到小
     */
    calculateBaseAllocation(total, playerCount) {
        const basePerPlayer = Math.floor(total / playerCount);
        const remainder = total % playerCount;
        const baseAllocations = [];
        
        // 从大到小：前remainder个排名多分1个
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
            return ['ign1', 'ign2', 'ign3', 'ign4', 'ign5', 'ign6'];
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
            return ['ign1', 'ign2', 'ign3', 'ign4', 'ign5', 'ign6'];
        }
        
        return players;
    }

    /**
     * 格式化玩家顺序
     */
    formatPlayerOrder(players) {
        return players.map((player, index) => `${index + 1} - ${player}`).join(', ');
    }

    /**
     * 新方法：按排名排序扣减值
     */
    sortDeductionsByRank(deductions, playerNames, rollResults) {
        const playerCount = deductions.length;
        const sortedDeductions = new Array(playerCount).fill(0);
        
        if (rollResults && rollResults.length > 0) {
            // 按Roll点排序玩家
            const sortedPlayers = [];
            
            // 参与Roll的玩家按点数排序
            const sortedParticipants = [...rollResults];
            
            // 不参与Roll的玩家
            const nonParticipants = [];
            for (let i = 0; i < playerCount; i++) {
                const playerName = playerNames[i] || `ign${i + 1}`;
                const isParticipant = sortedParticipants.some(p => p.name === playerName);
                if (!isParticipant) {
                    nonParticipants.push({
                        name: playerName,
                        originalIndex: i
                    });
                }
            }
            
            // 合并
            const allPlayers = [...sortedParticipants, ...nonParticipants];
            
            // 按排名分配扣减值
            for (let rank = 0; rank < allPlayers.length; rank++) {
                const player = allPlayers[rank];
                
                // 找到玩家原索引
                let originalIndex = -1;
                for (let i = 0; i < playerCount; i++) {
                    if ((playerNames[i] || `ign${i + 1}`) === player.name) {
                        originalIndex = i;
                        break;
                    }
                }
                
                if (originalIndex !== -1) {
                    sortedDeductions[rank] = deductions[originalIndex] || 0;
                }
            }
        } else {
            // 没有Roll点，保持原顺序
            return [...deductions];
        }
        
        return sortedDeductions;
    }
}

// 导出实例
const coinsCalculator = new CoinsCalculator();