// ========== 主应用模块 ==========
class CoinsCalculatorApp {
    constructor() {
        this.calculator = coinsCalculator;
        this.rollManager = rollManager;
        this.elements = {};
        
        this.state = {
            playerCount: 4,
            totalCoins: 0,
            pouchValues: [0, 0, 0, 0],
            playerNames: ['', '', '', '', '', ''], // 初始为空
            deductions: [0, 0, 0, 0, 0, 0],
            participants: [true, true, true, true, false, false]
        };
        
        // 从localStorage加载历史记录
        this.history = JSON.parse(localStorage.getItem('coinsHistory')) || [];
        
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.renderInitialState();
        this.updatePouchTotal();
        this.updateResults();
        this.updateHistoryDisplay();
        console.log('Coins Calculator PWA 已启动');
    }

    cacheElements() {
        this.elements = {
            playerCount: document.getElementById('playerCount'),
            totalCoins: document.getElementById('totalCoins'),
            calculateBtn: document.getElementById('calculate'),
            startRollBtn: document.getElementById('startRoll'),
            resultsBody: document.getElementById('resultsBody'),
            totalDisplay: document.getElementById('totalDisplay'),
            remainderDisplay: document.getElementById('remainderDisplay'),
            rollResults: document.getElementById('rollResults'),
            pouchInputs: document.querySelectorAll('.pouch-input'),
            playerNameInputs: document.getElementById('playerNameInputs'),
            copyResultsBtn: document.getElementById('copyResults'),
            clearHistoryBtn: document.getElementById('clearHistory'),
            historyList: document.getElementById('historyList')
        };
    }

    bindEvents() {
        // 计算按钮事件
        this.elements.calculateBtn.addEventListener('click', () => {
            this.updateResults();
            this.saveToHistory();
        });
        
        // Roll点按钮事件
        this.elements.startRollBtn.addEventListener('click', () => this.performRoll());
        
        // 玩家人数变化事件
        this.elements.playerCount.addEventListener('change', (e) => {
            this.state.playerCount = parseInt(e.target.value);
            this.updatePlayerCount();
            this.updateResults();
        });
        
        // Pouch输入事件
        this.elements.pouchInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const index = parseInt(e.target.dataset.index);
                const value = parseInt(e.target.value) || 0;
                this.state.pouchValues[index] = value;
                this.updatePouchTotal();
            });
        });
        
        // 工具按钮事件
        if (this.elements.copyResultsBtn) {
            this.elements.copyResultsBtn.addEventListener('click', () => this.copyResultsToClipboard());
        }
        
        if (this.elements.clearHistoryBtn) {
            this.elements.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        }
    }

    renderInitialState() {
        this.updatePlayerCount();
        this.elements.totalDisplay.textContent = this.state.totalCoins;
        
        // 设置pouch输入框初始值
        this.elements.pouchInputs.forEach((input, index) => {
            input.value = this.state.pouchValues[index];
        });
    }

    updatePouchTotal() {
        const total = this.state.pouchValues.reduce((sum, value) => sum + value, 0);
        this.state.totalCoins = total;
        
        this.elements.totalCoins.value = total;
        this.elements.totalDisplay.textContent = total;
        
        this.updateResults();
    }

    updatePlayerCount() {
        const playerCount = this.state.playerCount;
        
        // 更新参与者状态
        this.state.participants = new Array(6).fill(false);
        for (let i = 0; i < playerCount; i++) {
            this.state.participants[i] = true;
        }
        
        // 更新扣减数组
        this.state.deductions = new Array(playerCount).fill(0);
        
        // 更新玩家名输入框 - 保持现有值
        this.updatePlayerNameInputs();
        
        // 更新结果
        this.updateResults();
    }

    updatePlayerNameInputs() {
        const playerCount = this.state.playerCount;
        let html = '';
        
        // 表头
        html += `
            <div class="player-header-row">
                <span class="player-header-name">玩家名字 / Player Name</span>
                <span class="player-header-roll">参与Roll点</span>
            </div>
            <div class="player-name-inputs-compact">
        `;
        
        // 玩家输入行
        for (let i = 0; i < playerCount; i++) {
            const currentName = this.state.playerNames[i] || '';
            const isParticipant = this.state.participants[i];
            
            html += `
                <div class="player-row-compact">
                    <input type="text" 
                           id="playerName${i}" 
                           class="player-input-compact"
                           data-index="${i}"
                           value="${currentName}"
                           placeholder="输入IGN ${i+1}">
                    <input type="checkbox" 
                           class="roll-checkbox-solo"
                           data-index="${i}"
                           ${isParticipant ? 'checked' : ''}>
                </div>
            `;
        }
        
        html += '</div>';
        
        this.elements.playerNameInputs.innerHTML = html;
        
        // 绑定事件
        this.bindPlayerInputs();
    }

    bindPlayerInputs() {
        const inputs = this.elements.playerNameInputs.querySelectorAll('.player-input-compact');
        const checkboxes = this.elements.playerNameInputs.querySelectorAll('.roll-checkbox-solo');
        
        // 绑定输入框
        inputs.forEach(input => {
            // 输入时实时保存
            input.addEventListener('input', (e) => {
                const index = parseInt(e.target.dataset.index);
                const value = e.target.value.trim();
                if (value !== '') {
                    this.state.playerNames[index] = value;
                }
            });
            
            // 失去焦点时确保保存
            input.addEventListener('blur', (e) => {
                const index = parseInt(e.target.dataset.index);
                const value = e.target.value.trim();
                this.state.playerNames[index] = value || `ign${index + 1}`;
            });
        });
        
        // 绑定复选框
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const index = parseInt(e.target.dataset.index);
                this.state.participants[index] = e.target.checked;
            });
        });
    }

    performRoll() {
        try {
            const players = [];
            for (let i = 0; i < this.state.playerCount; i++) {
                const name = this.state.playerNames[i] || `ign${i + 1}`;
                players.push({
                    name: name,
                    checked: this.state.participants[i]
                });
            }
            
            const rollResults = this.rollManager.rollForPlayers(players);
            const resultsHTML = this.rollManager.generateResultsHTML(rollResults);
            this.elements.rollResults.innerHTML = resultsHTML;
            
            // Roll点后按点数排序玩家名
            const sortedNames = rollResults
                .map(p => p.name)
                .concat(this.state.playerNames.filter((name, index) => 
                    !rollResults.some(r => r.name === name && this.state.participants[index])
                ));
            
            // 更新玩家名 - 但保持用户已输入的值
            for (let i = 0; i < sortedNames.length && i < this.state.playerCount; i++) {
                // 只有当玩家原来没有输入名字时才更新
                if (!this.state.playerNames[i] || this.state.playerNames[i].startsWith('ign')) {
                    this.state.playerNames[i] = sortedNames[i];
                }
            }
            
            // 更新UI
            this.updatePlayerNameInputs();
            this.updateResults();
            
            this.showNotification('Roll点完成！玩家顺序已更新。', 'success');
            
        } catch (error) {
            this.showNotification(error.message, 'error');
        }
    }

    updateResults() {
        const playerCount = this.state.playerCount;
        const total = this.state.totalCoins;
        
        const baseAllocation = this.calculator.calculateBaseAllocation(total, playerCount);
        const actualGains = this.calculator.adjustAllocationSmartly(
            total, 
            playerCount, 
            this.state.deductions.slice(0, playerCount)
        );
        
        this.updateResultsTable(baseAllocation, actualGains);
        this.elements.totalDisplay.textContent = total;
        this.elements.remainderDisplay.textContent = baseAllocation.remainder;
    }

    updateResultsTable(baseAllocation, actualGains) {
        const { baseAllocations, playerCount } = baseAllocation;
        let html = '';
        
        for (let i = 0; i < playerCount; i++) {
            const playerName = this.state.playerNames[i] || `ign${i + 1}`;
            const baseGain = baseAllocations[i];
            const deduction = this.state.deductions[i] || 0;
            const actualGain = actualGains[i];
            
            html += `
                <tr>
                    <td class="player-rank">${i + 1}</td>
                    <td class="player-name">${playerName}</td>
                    <td class="base-gain">${baseGain}</td>
                    <td class="deduction-cell">
                        <input type="number" 
                               class="deduction-input"
                               data-index="${i}"
                               value="${deduction}"
                               min="0"
                               max="${baseGain}">
                    </td>
                    <td class="actual-gain">${actualGain}</td>
                </tr>
            `;
        }
        
        this.elements.resultsBody.innerHTML = html;
        this.bindDeductionInputs();
    }

    bindDeductionInputs() {
        const deductionInputs = this.elements.resultsBody.querySelectorAll('.deduction-input');
        
        deductionInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const index = parseInt(e.target.dataset.index);
                const value = parseInt(e.target.value) || 0;
                const baseGain = parseInt(e.target.max);
                
                if (value > baseGain) {
                    e.target.value = baseGain;
                    this.state.deductions[index] = baseGain;
                } else {
                    this.state.deductions[index] = value;
                }
                
                this.updateResults();
            });
        });
    }

    // ========== 历史记录功能 ==========
    saveToHistory() {
        const timestamp = new Date().toLocaleString('zh-CN');
        const playerCount = this.state.playerCount;
        const total = this.state.totalCoins;
        
        // 构建历史记录内容
        let historyContent = '';
        for (let i = 0; i < playerCount; i++) {
            const playerName = this.state.playerNames[i] || `ign${i + 1}`;
            const baseAllocation = this.calculator.calculateBaseAllocation(total, playerCount);
            const actualGains = this.calculator.adjustAllocationSmartly(
                total, 
                playerCount, 
                this.state.deductions.slice(0, playerCount)
            );
            
            historyContent += `${i+1}-${playerName}-${actualGains[i]}, `;
        }
        
        // 移除最后的逗号和空格
        historyContent = historyContent.replace(/, $/, '');
        
        const historyEntry = {
            timestamp: timestamp,
            totalCoins: total,
            playerCount: playerCount,
            content: historyContent,
            details: {
                pouchValues: [...this.state.pouchValues],
                playerNames: [...this.state.playerNames.slice(0, playerCount)],
                deductions: [...this.state.deductions.slice(0, playerCount)]
            }
        };
        
        this.history.unshift(historyEntry);
        
        // 限制历史记录数量
        if (this.history.length > 20) {
            this.history.pop();
        }
        
        // 保存到localStorage
        localStorage.setItem('coinsHistory', JSON.stringify(this.history));
        
        // 更新显示
        this.updateHistoryDisplay();
        
        this.showNotification('分配结果已保存到历史记录', 'success');
    }

    updateHistoryDisplay() {
        if (!this.elements.historyList) return;
        
        if (this.history.length === 0) {
            this.elements.historyList.innerHTML = `
                <div class="empty-history">
                    暂无历史记录<br>
                    <small style="opacity:0.7">完成一次分配后，结果将自动保存到这里</small>
                </div>
            `;
            return;
        }
        
        let html = '';
        this.history.forEach((entry, index) => {
            html += `
                <div class="history-item" data-index="${index}">
                    <div class="history-timestamp">
                        <span>🕒 ${entry.timestamp}</span>
                        <span style="margin-left:auto">👥 ${entry.playerCount}人 | 🪙 ${entry.totalCoins}币</span>
                    </div>
                    <div class="history-content">${entry.content}</div>
                </div>
            `;
        });
        
        this.elements.historyList.innerHTML = html;
        
        // 为历史记录项添加点击复制功能
        document.querySelectorAll('.history-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.copyHistoryToClipboard(index);
            });
        });
    }

    clearHistory() {
        if (confirm('确定要清空所有历史记录吗？此操作不可恢复。')) {
            this.history = [];
            localStorage.removeItem('coinsHistory');
            this.updateHistoryDisplay();
            this.showNotification('历史记录已清空', 'success');
        }
    }

    // ========== 复制功能 ==========
    copyResultsToClipboard() {
        const playerCount = this.state.playerCount;
        const total = this.state.totalCoins;
        
        const baseAllocation = this.calculator.calculateBaseAllocation(total, playerCount);
        const actualGains = this.calculator.adjustAllocationSmartly(
            total, 
            playerCount, 
            this.state.deductions.slice(0, playerCount)
        );
        
        let copyText = '';
        for (let i = 0; i < playerCount; i++) {
            const playerName = this.state.playerNames[i] || `ign${i + 1}`;
            copyText += `${i+1}-${playerName}-${actualGains[i]}, `;
        }
        
        // 移除最后的逗号和空格
        copyText = copyText.replace(/, $/, '');
        
        navigator.clipboard.writeText(copyText).then(()
