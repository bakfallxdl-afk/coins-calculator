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
            participants: [true, true, true, true, false, false],
            rollResults: null // 保存Roll点结果
        };

        // 从localStorage加载历史记录
        this.history = JSON.parse(localStorage.getItem('coinsHistory')) || [];

        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
	this.initInstructions();
        this.renderInitialState();
        this.updatePouchTotal();
        this.updateResults();
        this.updateHistoryDisplay();
        console.log('Coins Calculator PWA 已启动');
    }
    // 在 class 内部添加这些方法

initInstructions() {
    // 创建说明内容 - 优化后的版本
    const instructionsHTML = `
        <div class="instructions-grid">
            <!-- 左侧列：使用方法和扣减规则 -->
            <div class="instructions-column">
                <!-- 使用方法 -->
                <div class="instruction-section">
                    <h3><span class="emoji">📖</span> How to Use / 使用方法</h3>
                    <ul class="steps-list">
                        <li class="step-item">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h4>Enter Numbers / 输入数字</h4>
                                <p>Select player count (4-6) & enter pouch values</p>
                                <p style="opacity:0.8;">选择玩家人数 (4-6人) & 输入pouch数值</p>
                            </div>
                        </li>
                        <li class="step-item">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h4>Click Roll / 点Roll点</h4>
                                <p>Players join roll for ranking (higher roll = better)</p>
                                <p style="opacity:0.8;">玩家参与Roll点排名 (点数越高越靠前)</p>
                            </div>
                        </li>
                        <li class="step-item">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h4>Check Participants / 勾选参与者</h4>
                                <p>Unchecked players auto-last in ranking</p>
                                <p style="opacity:0.8;">未勾选的玩家自动排最后</p>
                            </div>
                        </li>
                        <li class="step-item">
                            <div class="step-number">4</div>
                            <div class="step-content">
                                <h4>Enter Deductions / 填扣减</h4>
                                <p>Enter DC/Death/Helmet etc. in deduction column</p>
                                <p style="opacity:0.8;">在扣减列填写断线/死亡/拾头盔等</p>
                            </div>
                        </li>
                        <li class="step-item">
                            <div class="step-number">5</div>
                            <div class="step-content">
                                <h4>Click Calculate / 点计算</h4>
                                <p>System auto-calculates final distribution</p>
                                <p style="opacity:0.8;">系统自动计算最终分配结果</p>
                            </div>
                        </li>
                    </ul>
                </div>
                
                <!-- 扣减规则 -->
                <div class="instruction-section">
                    <h3><span class="emoji">📋</span> Deduction Rules / 扣减规则</h3>
                    <div class="rules-grid">
                        <div class="rule-item">
                            <span class="rule-emoji">🚫</span>
                            <div class="rule-content">
                                <div class="rule-title">DC / 断线</div>
                                <div class="rule-desc">Disconnection during raid</div>
                            </div>
                        </div>
                        <div class="rule-item">
                            <span class="rule-emoji">💀</span>
                            <div class="rule-content">
                                <div class="rule-title">Death (no res)</div>
                                <div class="rule-desc">死亡(无法复活)</div>
                            </div>
                        </div>
                        <div class="rule-item">
                            <span class="rule-emoji">⛑️</span>
                            <div class="rule-content">
                                <div class="rule-title">Helmet pick-up</div>
                                <div class="rule-desc">拾取头盔</div>
                            </div>
                        </div>
                        <div class="rule-item">
                            <span class="rule-emoji">📝</span>
                            <div class="rule-content">
                                <div class="rule-title">Other / 其他</div>
                                <div class="rule-desc">Custom deductions</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 右侧列：重要规则和示例 -->
            <div class="instructions-column">
                <!-- 重要规则 -->
                <div class="instruction-section">
                    <h3><span class="emoji">⚖️</span> Key Rules / 重要规则</h3>
                    <div class="key-rules-list">
                        <div class="key-rule-item">
                            <span class="key-rule-emoji">✅</span>
                            <div class="key-rule-content">
                                <strong>Join Roll / 参与Roll点</strong>
                                <p>Rank by points, higher = more coins<br>按点数排名，越高获得越多</p>
                            </div>
                        </div>
                        <div class="key-rule-item">
                            <span class="key-rule-emoji">❌</span>
                            <div class="key-rule-content">
                                <strong>Skip Roll / 不参与</strong>
                                <p>Auto-last in ranking<br>自动排在最后</p>
                            </div>
                        </div>
                        <div class="key-rule-item">
                            <span class="key-rule-emoji">⚖️</span>
                            <div class="key-rule-content">
                                <strong>After Deductions / 扣减后</strong>
                                <p>System redistributes, total unchanged<br>系统重新分配，总数不变</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                '<!-- 示例 -->
<div class="instruction-section">
    <h3><span class="emoji">📊</span> Example / 示例</h3>
    <div class="example-box">
        <div class="example-header">
            <span>4 players, 100 coins</span>
            <span>4人, 100硬币</span>
        </div>
        <div class="example-detail">
            <!-- Players -->
            <div class="example-row">
                <span class="example-label-en">Players:</span>
                <span class="example-label-zh">玩家:</span>
                <span class="example-value">A, B, C, D</span>
            </div>
            <!-- Roll -->
            <div class="example-row">
                <span class="example-label-en">Roll:</span>
                <span class="example-label-zh">Roll点:</span>
                <span class="example-value">A,B,C join, D skips</span>
            </div>
            <!-- Ranking -->
            <div class="example-row">
                <span class="example-label-en">Ranking:</span>
                <span class="example-label-zh">排名:</span>
                <span class="example-value">A > B > C > D<br>(D auto-last)</span>
            </div>
            <!-- DC -->
            <div class="example-row highlight">
                <span class="example-label-en">A DC:</span>
                <span class="example-label-zh">A断线:</span>
                <span class="example-value">-5 coins</span>
            </div>
            <!-- Result -->
            <div class="example-row result">
                <span class="example-label-en">Result:</span>
                <span class="example-label-zh">结果:</span>
                <span class="example-value">System rebalances → Total remains 100</span>
            </div>
        </div>
    </div>
</div>'
                </div>
            </div>
        </div>
    `;
    
    const content = document.getElementById('instructionsContent');
    if (content) {
        content.innerHTML = instructionsHTML;
    }
    
    // 绑定切换事件
    const toggle = document.getElementById('instructionsToggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('expanded');
            content.classList.toggle('expanded');
        });
        

    }
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

        this.elements.totalCoins.textContent = total;
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

        // 重置Roll点结果
        this.state.rollResults = null;

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
                <span class="player-header-roll">Join Roll / 参与Roll点</span>
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
                // 当参与状态改变时，重置Roll点结果
                this.state.rollResults = null;
                this.updateResults();
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

            // 保存Roll点结果
            this.state.rollResults = rollResults;

            // === 原来的逻辑：只更新使用默认名的玩家 ===
            const sortedParticipants = rollResults.map(p => p.name);
            const nonParticipants = [];
            for (let i = 0; i < this.state.playerCount; i++) {
                if (!this.state.participants[i]) {
                    nonParticipants.push(this.state.playerNames[i] || `ign${i + 1}`);
                }
            }

            const newOrder = [...sortedParticipants, ...nonParticipants];

            for (let i = 0; i < this.state.playerCount; i++) {
                const currentName = this.state.playerNames[i];
                const isUsingDefaultName = !currentName ||
                                         currentName === `ign${i + 1}` ||
                                         currentName.startsWith('ign');

                if (isUsingDefaultName && newOrder[i]) {
                    this.state.playerNames[i] = newOrder[i];
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

    // 关键：按排名排序扣减值
    const sortedDeductions = this.calculator.sortDeductionsByRank(
        this.state.deductions.slice(0, playerCount),
        this.state.playerNames,
        this.state.rollResults
    );

    const actualGains = this.calculator.adjustAllocationSmartly(
        total,
        playerCount,
        sortedDeductions
    );

    this.updateResultsTable(baseAllocation, actualGains, sortedDeductions);
    this.elements.totalDisplay.textContent = total;
    this.elements.remainderDisplay.textContent = baseAllocation.remainder;
}

    updateResultsTable(baseAllocation, actualGains, sortedDeductions) {
    const { baseAllocations, playerCount } = baseAllocation;
    let html = '';

    // 基础分配从大到小
    const sortedBaseAllocations = [...baseAllocations].sort((a, b) => b - a);

    // 如果有Roll点结果，按Roll点排名显示
    if (this.state.rollResults && this.state.rollResults.length > 0) {
        // 1. 获取参与Roll的玩家（按点数从高到低排序）
        const sortedParticipants = [...this.state.rollResults];

        // 2. 获取不参与Roll的玩家（保持原顺序）
        const nonParticipants = [];
        for (let i = 0; i < playerCount; i++) {
            const playerName = this.state.playerNames[i] || `ign${i + 1}`;
            const isParticipant = sortedParticipants.some(p => p.name === playerName);
            if (!isParticipant) {
                nonParticipants.push({
                    name: playerName,
                    originalIndex: i
                });
            }
        }

        // 3. 合并：参与Roll的在前（按点数排序），不参与的在后面
        const allPlayers = [...sortedParticipants, ...nonParticipants];

        // 4. 生成表格行：按排名分配
        for (let rank = 0; rank < allPlayers.length; rank++) {
            const player = allPlayers[rank];
            const playerName = player.name;

            // 基础值按排名分配（排名越高，基础值越大）
            const baseGain = sortedBaseAllocations[rank] || 0;
            const deduction = sortedDeductions[rank] || 0;
            const actualGain = actualGains[rank] || 0;

            // 找到玩家原索引（用于保存扣减值）
            let originalIndex = -1;
            for (let i = 0; i < playerCount; i++) {
                if ((this.state.playerNames[i] || `ign${i + 1}`) === playerName) {
                    originalIndex = i;
                    break;
                }
            }

            if (originalIndex === -1) {
                originalIndex = rank;
            }

            html += `
                <tr>
                    <td class="player-rank">${rank + 1}</td>
                    <td class="player-name">${playerName}</td>
                    <td class="base-gain">${baseGain}</td>
                    <td class="deduction-cell">
                        <input type="number" 
                               class="deduction-input"
                               data-rank="${rank}"
                               data-original-index="${originalIndex}"
                               value="${deduction}"
                               min="0"
                               max="${baseGain}">
                    </td>
                    <td class="actual-gain">${actualGain}</td>
                </tr>
            `;
        }
    } else {
        // 没有Roll点，按基础值从大到小显示
        // 创建玩家数据数组
        const playersWithBase = [];
        for (let i = 0; i < playerCount; i++) {
            playersWithBase.push({
                name: this.state.playerNames[i] || `ign${i + 1}`,
                baseGain: sortedBaseAllocations[i] || 0,
                originalIndex: i,
                deduction: this.state.deductions[i] || 0,
                actualGain: actualGains[i] || 0
            });
        }

        // 按基础值从大到小排序
        playersWithBase.sort((a, b) => b.baseGain - a.baseGain);

        for (let rank = 0; rank < playersWithBase.length; rank++) {
            const player = playersWithBase[rank];

            html += `
                <tr>
                    <td class="player-rank">${rank + 1}</td>
                    <td class="player-name">${player.name}</td>
                    <td class="base-gain">${player.baseGain}</td>
                    <td class="deduction-cell">
                        <input type="number" 
                               class="deduction-input"
                               data-rank="${rank}"
                               data-original-index="${player.originalIndex}"
                               value="${player.deduction}"
                               min="0"
                               max="${player.baseGain}">
                    </td>
                    <td class="actual-gain">${player.actualGain}</td>
                </tr>
            `;
        }
    }

    this.elements.resultsBody.innerHTML = html;
    this.bindDeductionInputs();
}

    bindDeductionInputs() {
    const deductionInputs = this.elements.resultsBody.querySelectorAll('.deduction-input');

    deductionInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const rank = parseInt(e.target.dataset.rank); // 排名
            const originalIndex = parseInt(e.target.dataset.originalIndex); // 玩家原索引
            const value = parseInt(e.target.value) || 0;
            const baseGain = parseInt(e.target.max);

            if (value > baseGain) {
                e.target.value = baseGain;
                this.state.deductions[originalIndex] = baseGain;
            } else {
                this.state.deductions[originalIndex] = value;
            }

            this.updateResults();
        });
    });
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

        // 按Results表格显示的顺序复制
        let copyText = '';

        if (this.state.rollResults && this.state.rollResults.length > 0) {
            // 按Roll点顺序复制
            const sortedParticipants = [...this.state.rollResults];
            const nonParticipants = [];

            for (let i = 0; i < playerCount; i++) {
                const playerName = this.state.rollResults[i].name || `ign${i + 1}`;
                if (!sortedParticipants.some(p => p.name === playerName)) {
                    nonParticipants.push({
                        name: playerName,
                        originalIndex: i
                    });
                }
            }

            const allPlayers = [...sortedParticipants, ...nonParticipants];

            for (let displayIndex = 0; displayIndex < allPlayers.length; displayIndex++) {
                const player = allPlayers[displayIndex];
                let originalIndex = -1;

                for (let i = 0; i < playerCount; i++) {
                    if ((this.state.rollResults[i].name || `ign${i + 1}`) === player.name) {
                        originalIndex = i;
                        break;
                    }
                }

                if (originalIndex === -1) originalIndex = displayIndex;

                copyText += `${displayIndex+1}-${player.name}-${actualGains[originalIndex]}, `;
            }
        } else {
            // 按原始顺序复制
            for (let i = 0; i < playerCount; i++) {
                const playerName = this.state.playerNames[i].name || `ign${i + 1}`;
                copyText += `${i+1}-${playerName}-${actualGains[i]}, `;
            }
        }

        // 移除最后的逗号和空格
        copyText = copyText.replace(/, $/, '');

        // 复制到剪贴板
        this.copyToClipboard(copyText);
    }

    copyToClipboard(text) {
        // 方法1: 使用现代Clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('Copied to clipboard / 已复制到剪贴板: ' + text, 'success');
            }).catch(err => {
                console.log('Clipboard API失败，使用备用方法:', err);
                this.fallbackCopyText(text);
            });
        } else {
            // 方法2: 备用方法
            this.fallbackCopyText(text);
        }
    }

    fallbackCopyText(text) {
        try {
            // 创建临时textarea元素
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            textarea.style.top = '-9999px';
            document.body.appendChild(textarea);

            // 选择文本
            textarea.select();
            textarea.setSelectionRange(0, 99999); // 移动端兼容

            // 执行复制
            const successful = document.execCommand('copy');

            // 清理
            document.body.removeChild(textarea);

            if (successful) {
                this.showNotification('Copied to clipboard / 已复制到剪贴板: ' + text, 'success');
            } else {
                this.showManualCopyPrompt(text);
            }
        } catch (err) {
            console.error('复制失败:', err);
            this.showManualCopyPrompt(text);
        }
    }

    showManualCopyPrompt(text) {
        // 创建复制对话框
        const prompt = document.createElement('div');
        prompt.className = 'copy-prompt-overlay';
        prompt.innerHTML = `
            <div class="copy-prompt">
                <h3>复制结果</h3>
                <p>请手动选择并复制以下文本：</p>
                <textarea id="copyTextArea" readonly style="width:100%; height:100px; margin:15px 0; padding:10px; border:2px solid #FF6B35; border-radius:8px; font-family: monospace;">${text}</textarea>
                <div style="display:flex; gap:10px;">
                    <button onclick="document.getElementById('copyTextArea').select();" style="flex:1; padding:10px; background:#f8f9fa; border:2px solid #e2e8f0; border-radius:8px;">
                        选择文本
                    </button>
                    <button onclick="navigator.clipboard?navigator.clipboard.writeText('${text.replace(/'/g, "\\'")}').then(()=>alert('已复制')):alert('请手动复制'); this.parentElement.parentElement.parentElement.remove();" style="flex:1; padding:10px; background:#FF6B35; color:white; border:none; border-radius:8px;">
                        复制
                    </button>
                    <button onclick="this.parentElement.parentElement.parentElement.remove();" style="flex:1; padding:10px; background:#6c757d; color:white; border:none; border-radius:8px;">
                        关闭
                    </button>
                </div>
            </div>
        `;

        // 添加样式
        const style = document.createElement('style');
        style.textContent = `
            .copy-prompt-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            .copy-prompt {
                background: white;
                padding: 25px;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(prompt);
    }

    // ========== 历史记录功能 ==========
    saveToHistory() {
        const timestamp = new Date().toLocaleString('zh-CN');
        const playerCount = this.state.playerCount;
        const total = this.state.totalCoins;

        const baseAllocation = this.calculator.calculateBaseAllocation(total, playerCount);
        const actualGains = this.calculator.adjustAllocationSmartly(
            total,
            playerCount,
            this.state.deductions.slice(0, playerCount)
        );

        // 按Results表格显示的顺序保存历史
        let historyContent = '';

        if (this.state.rollResults && this.state.rollResults.length > 0) {
            const sortedParticipants = [...this.state.rollResults];
            const nonParticipants = [];

            for (let i = 0; i < playerCount; i++) {
                const playerName = this.state.playerNames[i] || `ign${i + 1}`;
                if (!sortedParticipants.some(p => p.name === playerName)) {
                    nonParticipants.push({
                        name: playerName,
                        originalIndex: i
                    });
                }
            }

            const allPlayers = [...sortedParticipants, ...nonParticipants];

            for (let displayIndex = 0; displayIndex < allPlayers.length; displayIndex++) {
                const player = allPlayers[displayIndex];
                let originalIndex = -1;

                for (let i = 0; i < playerCount; i++) {
                    if ((this.state.rollResults[i] || `ign${i + 1}`) === player.name) {
                        originalIndex = i;
                        break;
                    }
                }

                if (originalIndex === -1) originalIndex = displayIndex;

                historyContent += `${displayIndex+1}-${player.name}-${actualGains[originalIndex]}, `;
            }
        } else {
            for (let i = 0; i < playerCount; i++) {
                const playerName = this.state.rollResults[i] || `ign${i + 1}`;
                historyContent += `${i+1}-${playerName}-${actualGains[i]}, `;
            }
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

        this.showNotification('Saved to history / 分配结果已保存到历史记录', 'success');
    }

    updateHistoryDisplay() {
        if (!this.elements.historyList) return;

        if (this.history.length === 0) {
            this.elements.historyList.innerHTML = `
                <div class="empty-history">
                    <span class="zh">暂无历史记录</span>
                    <span class="en">No history yet</span>
                    <small style="opacity:0.7; margin-top:10px;">
                        完成一次分配后，结果将自动保存到这里<br>
                        Results will be saved here after distribution
                    </small>
                </div>
            `;
            return;
        }

        let html = "";
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
        document.querySelectorAll(".history-item").forEach(item => {
            item.addEventListener("click", (e) => {
                const index = parseInt(e.currentTarget.dataset.index);
                this.copyHistoryToClipboard(index);
            });
        });
    }

    clearHistory() {
        if (confirm('Clear all history? This cannot be undone. / 确定要清空所有历史记录吗？此操作不可恢复。')) {
            this.history = [];
            localStorage.removeItem('coinsHistory');
            this.updateHistoryDisplay();
            this.showNotification('History cleared / 历史记录已清空', 'success');
        }
    }

    copyHistoryToClipboard(index) {
        if (index >= 0 && index < this.history.length) {
            const entry = this.history[index];
            this.copyToClipboard(entry.content)
            // navigator.clipboard.writeText(entry.content).then(() => {
            //     this.showNotification('历史记录已复制到剪贴板', 'success');
            // }).catch(err => {
            //     console.error('复制失败:', err);
            //     this.showNotification('复制失败', 'error');
            // });
        }
    }

    // ========== 通知系统 ==========
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
        }, 4000);
    }
}

// ========== 添加通知样式 ==========
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        z-index: 1000;
        box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 400px;
        animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.1);
    }
    
    .notification-success {
        background: linear-gradient(135deg, rgba(72, 187, 120, 0.9) 0%, rgba(56, 161, 105, 0.9) 100%);
    }
    
    .notification-error {
        background: linear-gradient(135deg, rgba(245, 101, 101, 0.9) 0%, rgba(197, 48, 48, 0.9) 100%);
    }
    
    .notification-info {
        background: linear-gradient(135deg, rgba(66, 153, 225, 0.9) 0%, rgba(49, 130, 206, 0.9) 100%);
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        margin-left: 15px;
        padding: 0 5px;
        opacity: 0.8;
        transition: opacity 0.2s;
    }
    
    .notification-close:hover {
        opacity: 1;
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
    console.log('Coins Calculator 已加载完成');
});
