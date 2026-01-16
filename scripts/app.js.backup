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
            playerNames: ['', '', '', '', '', ''],
            deductions: [0, 0, 0, 0, 0, 0],
            participants: [true, true, true, true, false, false]
        };
        
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.renderInitialState();
        this.updatePouchTotal();
        this.updateResults();
        console.log('Coins Calculator PWA 已启动');
    }

    cacheElements() {
        this.elements = {
            playerCount: document.getElementById('playerCount'),
            totalCoins: document.getElementById('totalCoins'),
            calculateBtn: document.getElementById('calculate'),
            startRollBtn: document.getElementById('startRoll'),
            quickButtons: document.querySelectorAll('.quick-btn'),
            resultsBody: document.getElementById('resultsBody'),
            totalDisplay: document.getElementById('totalDisplay'),
            remainderDisplay: document.getElementById('remainderDisplay'),
            participantCheckboxes: document.getElementById('participantCheckboxes'),
            rollResults: document.getElementById('rollResults'),
            pouchInputs: document.querySelectorAll('.pouch-input'),
            pouchTotal: document.getElementById('pouchTotal'),
            playerNameInputs: document.getElementById('playerNameInputs'),
            saveSettingsBtn: document.getElementById('saveSettings'),
            exportDataBtn: document.getElementById('exportData'),
            importDataInput: document.getElementById('importData'),
            saveCurrentBtn: document.getElementById('saveCurrent'),
            clearHistoryBtn: document.getElementById('clearHistory'),
            historyList: document.getElementById('historyList')
        };
    }

    bindEvents() {
        this.elements.calculateBtn.addEventListener('click', () => this.updateResults());
        this.elements.startRollBtn.addEventListener('click', () => this.performRoll());
        
        this.elements.playerCount.addEventListener('change', (e) => {
            this.state.playerCount = parseInt(e.target.value);
            this.updatePlayerCount();
            this.updateResults();
        });
        
        this.elements.pouchInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const index = parseInt(e.target.dataset.index);
                const value = parseInt(e.target.value) || 0;
                this.state.pouchValues[index] = value;
                this.updatePouchTotal();
            });
        });
        
        this.elements.quickButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const amount = parseInt(e.target.dataset.amount);
                this.setTotalAndDistribute(amount);
            });
        });
    }

    renderInitialState() {
        this.updatePlayerCount();
        this.elements.totalDisplay.textContent = this.state.totalCoins;
        
        this.elements.pouchInputs.forEach((input, index) => {
            input.value = this.state.pouchValues[index];
        });
    }

    updatePouchTotal() {
        const total = this.state.pouchValues.reduce((sum, value) => sum + value, 0);
        this.state.totalCoins = total;
        
        this.elements.totalCoins.value = total;
        this.elements.pouchTotal.textContent = total;
        this.elements.totalDisplay.textContent = total;
        
        this.updateResults();
    }

    setTotalAndDistribute(totalAmount) {
        const baseValue = Math.floor(totalAmount / 4);
        const remainder = totalAmount % 4;
        
        const newPouchValues = [0, 0, 0, 0];
        for (let i = 0; i < 4; i++) {
            newPouchValues[i] = baseValue + (i < remainder ? 1 : 0);
        }
        
        this.state.pouchValues = newPouchValues;
        
        this.elements.pouchInputs.forEach((input, index) => {
            input.value = newPouchValues[index];
        });
        
        this.updatePouchTotal();
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
        
        // 更新玩家名输入框
        this.updatePlayerNameInputs();
        
        // 更新参与者复选框
        this.updateParticipantCheckboxes();
        
        // 更新结果
        this.updateResults();
    }

    updatePlayerNameInputs() {
        const playerCount = this.state.playerCount;
        let html = '';
        
        for (let i = 0; i < playerCount; i++) {
            const playerName = this.state.playerNames[i] || `ign${i + 1}`;
            html += `
                <div class="player-name-item">
                    <label for="playerName${i}">Player ${i + 1}:</label>
                    <input type="text" 
                           id="playerName${i}" 
                           class="player-name-input"
                           data-index="${i}"
                           value=""
                           placeholder="ign${i + 1}">
                </div>
            `;
        }
        
        this.elements.playerNameInputs.innerHTML = html;
        
        // 绑定玩家名输入事件
        this.bindPlayerNameInputs();
    }

    bindPlayerNameInputs() {
        const playerNameInputs = this.elements.playerNameInputs.querySelectorAll('.player-name-input');
        
        playerNameInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const index = parseInt(e.target.dataset.index);
                const value = e.target.value.trim();
                this.state.playerNames[index] = value || `ign${index + 1}`;
                this.updateResults();
            });
        });
    }

    updateParticipantCheckboxes() {
        const playerCount = this.state.playerCount;
        let html = '';
        
        for (let i = 0; i < playerCount; i++) {
            const playerName = this.state.playerNames[i] || `ign${i + 1}`;
            
            html += `
                <label class="checkbox-item">
                    <input type="checkbox" 
                           data-index="${i}"
                           ${this.state.participants[i] ? 'checked' : ''}>
                    <span>${playerName}</span>
                </label>
            `;
        }
        
        this.elements.participantCheckboxes.innerHTML = html;
        this.bindCheckboxEvents();
    }

    bindCheckboxEvents() {
        const checkboxes = this.elements.participantCheckboxes.querySelectorAll('input[type="checkbox"]');
        
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
                players.push({
                    name: this.state.playerNames[i] || `ign${i + 1}`,
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
            
            // 更新玩家名
            for (let i = 0; i < sortedNames.length && i < this.state.playerCount; i++) {
                this.state.playerNames[i] = sortedNames[i];
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

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

// ========== 添加通知样式 ==========
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    }
    
    .notification-success {
        background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
    }
    
    .notification-error {
        background: linear-gradient(135deg, #f56565 0%, #c53030 100%);
    }
    
    .notification-info {
        background: linear-gradient(135deg, #4299e1 0%, #3182ce 100%);
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        margin-left: 15px;
        padding: 0 5px;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @media (max-width: 768px) {
        .notification {
            left: 20px;
            right: 20px;
            max-width: none;
        }
    }
`;

// 添加样式到页面
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// ========== 初始化应用 ==========
document.addEventListener('DOMContentLoaded', () => {
    const app = new CoinsCalculatorApp();
    window.app = app;
    console.log('应用已加载完成');
});
