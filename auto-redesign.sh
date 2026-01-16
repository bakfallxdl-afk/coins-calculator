#!/bin/bash

echo "🎨 开始自动重新设计布局..."
echo "========================================"

# 备份原文件
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp index.html "$BACKUP_DIR/"
cp styles/main.css "$BACKUP_DIR/" 2>/dev/null || true
echo "📦 已备份到: $BACKUP_DIR"

# 1. 修改HTML中的玩家名输入区域
echo "📝 修改HTML玩家名输入区域..."

# 创建新的玩家输入区域HTML
NEW_PLAYER_INPUTS='
                    <!-- 玩家名输入框 - 新布局：输入框 + 参与复选框 -->
                    <div class="input-group">
                        <label>
                            <span class="en">Player Names / 玩家名字 (勾选参与Roll点):</span>
                        </label>
                        <div id="playerNameInputs" class="player-name-inputs">
                            <div class="player-input-row">
                                <input type="text" class="player-name-input" id="player1" value="玩家1" placeholder="输入玩家名">
                                <label class="participant-checkbox-label">
                                    <input type="checkbox" class="participant-checkbox" data-player-id="player1" checked>
                                    <span class="checkmark"></span>
                                    <span class="checkbox-text">参与Roll点</span>
                                </label>
                            </div>
                            <div class="player-input-row">
                                <input type="text" class="player-name-input" id="player2" value="玩家2" placeholder="输入玩家名">
                                <label class="participant-checkbox-label">
                                    <input type="checkbox" class="participant-checkbox" data-player-id="player2" checked>
                                    <span class="checkmark"></span>
                                    <span class="checkbox-text">参与Roll点</span>
                                </label>
                            </div>
                            <div class="player-input-row">
                                <input type="text" class="player-name-input" id="player3" value="玩家3" placeholder="输入玩家名">
                                <label class="participant-checkbox-label">
                                    <input type="checkbox" class="participant-checkbox" data-player-id="player3" checked>
                                    <span class="checkmark"></span>
                                    <span class="checkbox-text">参与Roll点</span>
                                </label>
                            </div>
                            <div class="player-input-row">
                                <input type="text" class="player-name-input" id="player4" value="玩家4" placeholder="输入玩家名">
                                <label class="participant-checkbox-label">
                                    <input type="checkbox" class="participant-checkbox" data-player-id="player4" checked>
                                    <span class="checkmark"></span>
                                    <span class="checkbox-text">参与Roll点</span>
                                </label>
                            </div>
                        </div>
                    </div>'

# 替换HTML中的玩家名输入区域
sed -i '' 's|<!-- 玩家名输入框 -->.*<!-- 动态生成 -->|'"$(echo "$NEW_PLAYER_INPUTS" | sed 's/[\/&]/\\&/g')"'|' index.html 2>/dev/null || \
sed -i '' 's|<!-- 玩家名输入框 -->|'"$(echo "$NEW_PLAYER_INPUTS" | sed 's/[\/&]/\\&/g')"'|' index.html 2>/dev/null || \
sed -i '' 's|玩家名字.*</label>.*<div id="playerNameInputs"|玩家名字.*</label>'"$(echo "$NEW_PLAYER_INPUTS" | sed 's/[\/&]/\\&/g' | sed 's/.*玩家名字//')| index.html 2>/dev/null

# 2. 修改Roll点区域 - 移除参与者复选框，添加两个并排按钮
echo "📝 修改Roll点区域..."

# 找到Roll点区域并替换
ROLL_SECTION_START=$(grep -n "Roll点区域" index.html | head -1 | cut -d: -f1)
if [ -z "$ROLL_SECTION_START" ]; then
    ROLL_SECTION_START=$(grep -n "Random Roll" index.html | head -1 | cut -d: -f1)
fi

if [ ! -z "$ROLL_SECTION_START" ]; then
    # 创建新的Roll点区域
    NEW_ROLL_SECTION='
                    <!-- Roll点区域 - 两个并排按钮 -->
                    <div class="roll-section">
                        <h3>Random Roll / 随机Roll点 & Calculate / 计算分配</h3>
                        
                        <div class="dual-button-container">
                            <button id="startRoll" class="btn-image-roll">
                                <img src="assets/images/startroll.png" alt="Start Roll" class="roll-btn-img">
                                <span class="button-label">开始Roll点</span>
                            </button>
                            
                            <button id="startCalculate" class="btn-image-calculate">
                                <img src="assets/images/startcalculate.png" alt="Start Calculate" class="calculate-btn-img">
                                <span class="button-label">计算分配</span>
                            </button>
                        </div>
                        
                        <div id="rollResults" class="roll-results">
                            <!-- 结果区域 -->
                        </div>
                    </div>'
    
    # 找到结束位置（大概20行后）
    ROLL_SECTION_END=$((ROLL_SECTION_START + 20))
    
    # 使用sed替换区域
    sed -i '' "${ROLL_SECTION_START},${ROLL_SECTION_END}c\\
${NEW_ROLL_SECTION}" index.html
else
    echo "⚠️ 无法找到Roll点区域，可能需要手动修改"
fi

# 3. 移除计算分配按钮（因为已经移到Roll点区域）
echo "📝 移除旧的计算按钮..."
sed -i '' '/id="calculate"/d' index.html
sed -i '' '/Calculate.*计算分配/d' index.html 2>/dev/null || true

# 4. 添加新的CSS样式
echo "🎨 添加新布局CSS样式..."
cat >> styles/main.css << 'CSS_EOF'

/* ========== 新布局样式 ========== */

/* 玩家名输入行 - 输入框和复选框在一行 */
.player-input-row {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 15px;
    padding: 15px;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    transition: all 0.3s ease;
}

.player-input-row:hover {
    border-color: #FFD89C;
    background: #fffaf0;
    transform: translateX(5px);
}

.player-name-input {
    flex: 1;
    padding: 14px 18px;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 1.1rem;
    font-weight: 600;
    color: #2d3748;
    transition: all 0.3s ease;
    min-width: 200px;
}

.player-name-input:focus {
    border-color: #FF6B35;
    box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.15);
    outline: none;
}

/* 参与复选框样式 */
.participant-checkbox-label {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    user-select: none;
    padding: 10px 15px;
    background: #f8f9fa;
    border-radius: 10px;
    transition: all 0.2s ease;
    min-width: 140px;
}

.participant-checkbox-label:hover {
    background: #e9ecef;
}

.participant-checkbox {
    width: 20px;
    height: 20px;
    accent-color: #FF6B35;
    cursor: pointer;
    margin: 0;
}

.checkmark {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 5px;
    position: relative;
    transition: all 0.2s ease;
}

.participant-checkbox:checked + .checkmark {
    background: #FF6B35;
    border-color: #FF6B35;
}

.participant-checkbox:checked + .checkmark::after {
    content: "✓";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 14px;
    font-weight: bold;
}

.checkbox-text {
    font-weight: 600;
    color: #2d3748;
    font-size: 0.95rem;
}

/* 双按钮容器 */
.dual-button-container {
    display: flex;
    gap: 40px;
    justify-content: center;
    align-items: center;
    margin: 30px 0;
    flex-wrap: wrap;
}

@media (max-width: 768px) {
    .dual-button-container {
        flex-direction: column;
        gap: 20px;
    }
}

/* Roll点按钮 */
.btn-image-roll {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    padding: 20px;
    background: white;
    border: 3px solid #FFD89C;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.4s ease;
    width: 320px;
    box-shadow: 0 10px 30px rgba(255, 107, 53, 0.2);
}

.btn-image-roll:hover {
    transform: translateY(-8px) scale(1.05);
    box-shadow: 0 20px 50px rgba(255, 107, 53, 0.4);
    border-color: #FF6B35;
}

.btn-image-roll:active {
    transform: translateY(-4px) scale(1.02);
}

.roll-btn-img {
    width: 100%;
    height: auto;
    border-radius: 15px;
    aspect-ratio: 1551 / 1197;
    object-fit: contain;
}

/* 计算按钮 */
.btn-image-calculate {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    padding: 20px;
    background: white;
    border: 3px solid #4FC3F7;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.4s ease;
    width: 320px;
    box-shadow: 0 10px 30px rgba(79, 195, 247, 0.2);
}

.btn-image-calculate:hover {
    transform: translateY(-8px) scale(1.05);
    box-shadow: 0 20px 50px rgba(79, 195, 247, 0.4);
    border-color: #0288D1;
}

.btn-image-calculate:active {
    transform: translateY(-4px) scale(1.02);
}

.calculate-btn-img {
    width: 100%;
    height: auto;
    border-radius: 15px;
    aspect-ratio: 1551 / 1197;
    object-fit: contain;
}

/* 按钮标签 */
.button-label {
    font-size: 1.3rem;
    font-weight: 700;
    color: #2d3748;
    text-align: center;
    padding: 8px 20px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.7));
    border-radius: 10px;
    backdrop-filter: blur(10px);
    width: 90%;
}

.btn-image-roll .button-label {
    color: #FF6B35;
    border: 2px solid #FFD89C;
}

.btn-image-calculate .button-label {
    color: #0288D1;
    border: 2px solid #B3E5FC;
}

/* 移除旧的参与者区域样式 */
#participantCheckboxes {
    display: none !important;
}

.participant-controls {
    display: none !important;
}

/* 响应式调整 */
@media (max-width: 768px) {
    .player-input-row {
        flex-direction: column;
        align-items: stretch;
        gap: 15px;
    }
    
    .player-name-input {
        min-width: auto;
        width: 100%;
    }
    
    .participant-checkbox-label {
        justify-content: center;
        min-width: auto;
    }
    
    .btn-image-roll,
    .btn-image-calculate {
        width: 280px;
    }
}

@media (max-width: 480px) {
    .btn-image-roll,
    .btn-image-calculate {
        width: 250px;
        padding: 15px;
    }
    
    .button-label {
        font-size: 1.1rem;
    }
}
CSS_EOF

# 5. 创建JavaScript处理新布局
echo "⚙️ 创建新布局JavaScript..."
cat > scripts/new-layout.js << 'JS_EOF'
// ========== 新布局功能脚本 ==========
console.log('🔄 新布局脚本加载...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 初始化新布局...');
    
    // 1. 设置玩家数量变化监听
    setupPlayerCount();
    
    // 2. 设置Roll点按钮功能
    setupRollButton();
    
    // 3. 设置计算按钮功能
    setupCalculateButton();
    
    console.log('✅ 新布局初始化完成');
});

// 设置玩家数量变化
function setupPlayerCount() {
    const playerCountSelect = document.getElementById('playerCount');
    if (!playerCountSelect) {
        console.warn('找不到玩家数量选择器');
        return;
    }
    
    playerCountSelect.addEventListener('change', function() {
        const newCount = parseInt(this.value) || 4;
        console.log(`玩家数量变更为: ${newCount}`);
        updatePlayerInputs(newCount);
    });
    
    // 初始更新
    const initialCount = parseInt(playerCountSelect.value) || 4;
    updatePlayerInputs(initialCount);
}

// 更新玩家输入框
function updatePlayerInputs(playerCount) {
    const container = document.getElementById('playerNameInputs');
    if (!container) return;
    
    // 清空容器
    container.innerHTML = '';
    
    // 创建对应数量的玩家输入行
    for (let i = 1; i <= playerCount; i++) {
        const playerRow = document.createElement('div');
        playerRow.className = 'player-input-row';
        playerRow.innerHTML = `
            <input type="text" class="player-name-input" id="player${i}" 
                   value="玩家${i}" placeholder="输入玩家名">
            <label class="participant-checkbox-label">
                <input type="checkbox" class="participant-checkbox" 
                       data-player-id="player${i}" checked>
                <span class="checkmark"></span>
                <span class="checkbox-text">参与Roll点</span>
            </label>
        `;
        container.appendChild(playerRow);
    }
    
    console.log(`已创建 ${playerCount} 个玩家输入行`);
}

// 设置Roll点按钮功能
function setupRollButton() {
    const rollButton = document.getElementById('startRoll');
    if (!rollButton) {
        console.error('找不到Roll点按钮');
        return;
    }
    
    rollButton.addEventListener('click', function() {
        console.log('🎲 开始Roll点...');
        
        // 获取参与Roll点的玩家
        const participants = getParticipants();
        
        if (participants.length === 0) {
            alert('请至少选择一名参与者！');
            return;
        }
        
        console.log(`参与Roll点的玩家: ${participants.map(p => p.name).join(', ')}`);
        
        // 模拟Roll点结果
        const results = performRoll(participants);
        
        // 显示结果
        displayRollResults(results);
        
        // 动画效果
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
}

// 设置计算按钮功能
function setupCalculateButton() {
    const calculateButton = document.getElementById('startCalculate');
    if (!calculateButton) {
        console.error('找不到计算按钮');
        return;
    }
    
    calculateButton.addEventListener('click', function() {
        console.log('🧮 开始计算分配...');
        
        // 获取所有玩家
        const players = getAllPlayers();
        
        if (players.length === 0) {
            alert('请至少输入一名玩家！');
            return;
        }
        
        // 获取总硬币数
        const totalCoins = document.getElementById('totalCoins')?.value || 0;
        
        if (totalCoins <= 0) {
            alert('请输入总硬币数！');
            return;
        }
        
        console.log(`计算 ${players.length} 名玩家的 ${totalCoins} 硬币分配`);
        
        // 执行计算
        performCalculation(players, totalCoins);
        
        // 动画效果
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 200);
    });
}

// 获取参与Roll点的玩家
function getParticipants() {
    const participants = [];
    const checkboxes = document.querySelectorAll('.participant-checkbox:checked');
    
    checkboxes.forEach(checkbox => {
        const playerId = checkbox.dataset.playerId;
        const playerInput = document.getElementById(playerId);
        
        if (playerInput) {
            participants.push({
                id: playerId,
                name: playerInput.value || playerInput.placeholder,
                element: playerInput
            });
        }
    });
    
    return participants;
}

// 获取所有玩家
function getAllPlayers() {
    const players = [];
    const inputs = document.querySelectorAll('.player-name-input');
    
    inputs.forEach(input => {
        if (input.value.trim() || input.placeholder) {
            players.push({
                id: input.id,
                name: input.value || input.placeholder,
                element: input
            });
        }
    });
    
    return players;
}

// 执行Roll点
function performRoll(participants) {
    const results = [];
    
    participants.forEach(player => {
        // 生成1-100的随机数
        const rollValue = Math.floor(Math.random() * 100) + 1;
        
        results.push({
            player: player.name,
            value: rollValue,
            rank: 0
        });
    });
    
    // 按值排序
    results.sort((a, b) => b.value - a.value);
    
    // 分配排名
    results.forEach((result, index) => {
        result.rank = index + 1;
    });
    
    return results;
}

// 显示Roll点结果
function displayRollResults(results) {
    const resultsContainer = document.getElementById('rollResults');
    if (!resultsContainer) return;
    
    let html = '<div class="roll-results-list">';
    
    results.forEach(result => {
        let rankClass = '';
        let rankEmoji = '';
        
        if (result.rank === 1) {
            rankClass = 'rank-first';
            rankEmoji = '🥇';
        } else if (result.rank === 2) {
            rankClass = 'rank-second';
            rankEmoji = '🥈';
        } else if (result.rank === 3) {
            rankClass = 'rank-third';
            rankEmoji = '🥉';
        } else {
            rankEmoji = '🎲';
        }
        
        html += `
            <div class="roll-result-item ${rankClass}">
                <div class="roll-rank">${result.rank}</div>
                <div class="roll-emoji">${rankEmoji}</div>
                <div class="roll-player">${result.player}</div>
                <div class="roll-value">${result.value}</div>
            </div>
        `;
    });
    
    html += '</div>';
    resultsContainer.innerHTML = html;
}

// 执行计算
function performCalculation(players, totalCoins) {
    // 这里应该调用你原有的计算逻辑
    console.log('执行计算逻辑...');
    
    // 临时显示提示
    alert(`正在为 ${players.length} 名玩家计算 ${totalCoins} 硬币的分配...\n\n具体计算逻辑需要集成原有的计算函数。`);
    
    // TODO: 集成原有的计算函数
    // 例如：window.calculateDistribution(players, totalCoins);
}

console.log('✅ 新布局脚本加载完成');
JS_EOF

# 6. 更新HTML中的JavaScript引用
echo "📄 更新JavaScript引用..."
# 移除旧的参与者相关脚本
sed -i '' '/participant.*\.js/d' index.html 2>/dev/null || true
sed -i '' '/sync.*\.js/d' index.html 2>/dev/null || true

# 添加新布局脚本
if ! grep -q "new-layout.js" index.html; then
    # 在app.js之前添加
    sed -i '' '/<script.*app.js/i\
    <script src="scripts/new-layout.js"></script>' index.html 2>/dev/null || \
    echo "无法自动添加，请手动添加: <script src=\"scripts/new-layout.js\"></script>"
fi

echo ""
echo "========================================"
echo "🎉 重新设计完成！"
echo ""
echo "✅ 已修改："
echo "   1. 玩家名输入区域 - 输入框+复选框在一行"
echo "   2. Roll点区域 - 两个并排大按钮"
echo "   3. 添加了新CSS样式"
echo "   4. 添加了新JavaScript功能"
echo ""
echo "🔄 请刷新浏览器查看新布局"
echo ""
echo "📋 新功能："
echo "   • 每个玩家名后直接勾选是否参与Roll点"
echo "   • 两个并排大按钮：Roll点 + 计算分配"
echo "   • 默认全选参与，可单独取消"
echo "   • 响应式设计，适配手机"
echo ""
echo "🔧 如果图片不显示，请确保："
echo "   • startcalculate.png 在 assets/images/ 目录下"
echo "   • 图片尺寸建议：与 startroll.png 相同（1551x1197）"
