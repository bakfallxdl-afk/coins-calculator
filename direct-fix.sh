#!/bin/bash

echo "🔧 直接修复布局..."

# 备份
cp index.html index.html.before-fix

# 找到并替换玩家名输入区域
# 先找到开始行
START_LINE=$(grep -n "Player Names / 玩家名字" index.html | head -1 | cut -d: -f1)
if [ -z "$START_LINE" ]; then
    echo "❌ 找不到玩家名字区域"
    exit 1
fi

echo "玩家名字区域在第 $START_LINE 行"

# 找到结束行（大概15行后）
END_LINE=$((START_LINE + 15))

# 读取原内容
echo "原内容 ($START_LINE 到 $END_LINE 行):"
sed -n "${START_LINE},${END_LINE}p" index.html

# 新的玩家名输入区域
NEW_PLAYER_SECTION='                        <label>
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
                        </div>'

# 直接替换文件中的这个区域
# 创建一个临时文件
awk -v start="$START_LINE" -v end="$END_LINE" -v new="$NEW_PLAYER_SECTION" '
NR == start {print new; skip=1}
NR < start || NR > end {print}
skip && NR == end {skip=0}
' index.html > index.html.temp && mv index.html.temp index.html

echo "✅ 已更新玩家名输入区域"

# 现在修复Roll点区域
ROLL_START=$(grep -n "Random Roll / 随机Roll点" index.html | head -1 | cut -d: -f1)
if [ -z "$ROLL_START" ]; then
    echo "❌ 找不到Roll点区域"
    exit 1
fi

echo "Roll点区域在第 $ROLL_START 行"

# 找到结束行（大概30行后）
ROLL_END=$((ROLL_START + 30))

# 新的Roll点区域
NEW_ROLL_SECTION='                        <h3>Random Roll / 随机Roll点 & Calculate / 计算分配</h3>
                        
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
                        </div>'

# 替换Roll点区域
awk -v start="$ROLL_START" -v end="$ROLL_END" -v new="$NEW_ROLL_SECTION" '
NR == start {print new; skip=1}
NR < start || NR > end {print}
skip && NR == end {skip=0}
' index.html > index.html.temp && mv index.html.temp index.html

echo "✅ 已更新Roll点区域"

# 移除旧的计算按钮
sed -i '' '/id="calculate"/d' index.html

# 添加CSS样式
echo "🎨 添加CSS样式..."

cat >> styles/main.css << 'CSS_EOF'

/* ========== 新布局样式 ========== */
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

.roll-btn-img {
    width: 100%;
    height: auto;
    border-radius: 15px;
    aspect-ratio: 1551 / 1197;
    object-fit: contain;
}

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

.calculate-btn-img {
    width: 100%;
    height: auto;
    border-radius: 15px;
    aspect-ratio: 1551 / 1197;
    object-fit: contain;
}

.button-label {
    font-size: 1.3rem;
    font-weight: 700;
    color: #2d3748;
    text-align: center;
    padding: 8px 20px;
    background: white;
    border-radius: 10px;
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

/* 隐藏旧的参与者区域 */
#participantCheckboxes {
    display: none !important;
}

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
CSS_EOF

# 创建简单的JavaScript
cat > scripts/simple-new-layout.js << 'JS_EOF'
// 简单的新布局功能
document.addEventListener('DOMContentLoaded', function() {
    console.log('新布局初始化...');
    
    // Roll点按钮
    document.getElementById('startRoll')?.addEventListener('click', function() {
        const participants = [];
        document.querySelectorAll('.participant-checkbox:checked').forEach(cb => {
            const playerId = cb.dataset.playerId;
            const input = document.getElementById(playerId);
            if (input) {
                participants.push(input.value || `玩家${playerId.slice(-1)}`);
            }
        });
        
        if (participants.length === 0) {
            alert('请至少选择一名参与者！');
            return;
        }
        
        alert(`开始Roll点！\n参与者: ${participants.join(', ')}`);
        
        // 动画
        this.style.transform = 'scale(0.95)';
        setTimeout(() => this.style.transform = '', 200);
    });
    
    // 计算按钮
    document.getElementById('startCalculate')?.addEventListener('click', function() {
        const totalCoins = document.getElementById('totalCoins')?.value;
        if (!totalCoins || totalCoins <= 0) {
            alert('请输入总硬币数！');
            return;
        }
        
        alert(`开始计算 ${totalCoins} 硬币的分配！`);
        
        // 动画
        this.style.transform = 'scale(0.95)';
        setTimeout(() => this.style.transform = '', 200);
    });
    
    // 玩家数量变化
    document.getElementById('playerCount')?.addEventListener('change', function() {
        const count = parseInt(this.value) || 4;
        updatePlayerRows(count);
    });
    
    function updatePlayerRows(count) {
        const container = document.getElementById('playerNameInputs');
        if (!container) return;
        
        let html = '';
        for (let i = 1; i <= count; i++) {
            html += `
                <div class="player-input-row">
                    <input type="text" class="player-name-input" id="player${i}" value="玩家${i}" placeholder="输入玩家名">
                    <label class="participant-checkbox-label">
                        <input type="checkbox" class="participant-checkbox" data-player-id="player${i}" checked>
                        <span class="checkmark"></span>
                        <span class="checkbox-text">参与Roll点</span>
                    </label>
                </div>
            `;
        }
        container.innerHTML = html;
    }
});
JS_EOF

# 添加JS引用
if ! grep -q "simple-new-layout.js" index.html; then
    sed -i '' '/<\/body>/i\
    <script src="scripts/simple-new-layout.js"></script>' index.html
fi

echo ""
echo "✅ 修复完成！"
echo "🔄 请刷新浏览器"
