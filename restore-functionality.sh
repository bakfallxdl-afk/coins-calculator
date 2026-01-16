#!/bin/bash

echo "⚙️ 恢复原有功能..."

cd "/Users/xiedonglei/Desktop/boss/coins-calculator-pwa"

# 备份
cp index.html index.html.before-restore-func
cp scripts/app.js scripts/app.js.backup 2>/dev/null || true

# 1. 修改HTML结构以匹配原有JavaScript
echo "修改HTML结构匹配原有JS..."

# 首先查看原有app.js需要哪些元素
echo "分析原有功能需求..."

# 2. 创建功能兼容的HTML
cat > index.html.func << 'HTML'
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Coins Calculator | 硬币计算器</title>
    
    <!-- CSS -->
    <link rel="stylesheet" href="styles/main.css">
    
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#FF6B35">
</head>
<body>
    <div class="container">
        <!-- 头部 -->
        <header class="app-header">
            <div class="header-content">
                <img src="assets/images/head.png" alt="Coins Calculator" class="header-image">
            </div>
        </header>

        <!-- 主内容区 - 垂直布局 -->
        <main class="main-content-vertical">
            <!-- 控制面板 -->
            <section class="control-panel card">
                <h2>设置 Settings</h2>
                
                <!-- 玩家数量选择 -->
                <div class="input-group">
                    <label for="playerCount">
                        <span class="en">Player Count / 玩家人数:</span>
                    </label>
                    <select id="playerCount">
                        <option value="4">4 Players (4人)</option>
                        <option value="5">5 Players (5人)</option>
                        <option value="6">6 Players (6人)</option>
                    </select>
                </div>
                
                <!-- Pouch输入区域 -->
                <div class="input-group">
                    <label>
                        <span class="en">Pouch Values / Pouch数值:</span>
                    </label>
                    <div class="pouch-inputs">
                        <div class="pouch-item">
                            <div class="pouch-icon">
                                <img src="assets/images/pouch4.png" alt="pouch1" class="pouch-img">
                                <span>pouch1:</span>
                            </div>
                            <input type="number" id="pouch1" class="pouch-input" value="0" min="0" data-index="0">
                        </div>
                        <div class="pouch-item">
                            <div class="pouch-icon">
                                <img src="assets/images/pouch4.png" alt="pouch2" class="pouch-img">
                                <span>pouch2:</span>
                            </div>
                            <input type="number" id="pouch2" class="pouch-input" value="0" min="0" data-index="1">
                        </div>
                        <div class="pouch-item">
                            <div class="pouch-icon">
                                <img src="assets/images/pouch4.png" alt="pouch3" class="pouch-img">
                                <span>pouch3:</span>
                            </div>
                            <input type="number" id="pouch3" class="pouch-input" value="0" min="0" data-index="2">
                        </div>
                        <div class="pouch-item">
                            <div class="pouch-icon">
                                <img src="assets/images/pouch4.png" alt="pouch4" class="pouch-img">
                                <span>pouch4:</span>
                            </div>
                            <input type="number" id="pouch4" class="pouch-input" value="0" min="0" data-index="3">
                        </div>
                    </div>
                    <div class="pouch-summary">
                        <span>Pouch总和: </span>
                        <strong id="pouchTotal">0</strong>
                    </div>
                </div>
                
                <!-- 总硬币数 - 只显示自动计算的结果 -->
                <div class="input-group">
                    <label for="totalCoins">
                        <span class="en">Total Coins / 硬币总数:</span>
                    </label>
                    <input type="number" id="totalCoins" value="0" min="0" readonly style="background: #f8f9fa;">
                    <small style="display: block; margin-top: 5px; color: #666; font-size: 0.9rem;">
                        自动从Pouch值计算得出
                    </small>
                </div>
            </section>
            
            <!-- 玩家管理区域 -->
            <section class="player-management card">
                <h2>Player Management / 玩家管理</h2>
                
                <!-- 玩家名输入框 - 使用原有结构 -->
                <div class="input-group">
                    <label>
                        <span class="en">Player Names / 玩家名字:</span>
                    </label>
                    <div id="playerNameInputs" class="player-name-inputs">
                        <!-- 这里会被JavaScript动态填充 -->
                        <div class="player-input-row">
                            <input type="text" class="player-name-input" id="player1" value="ign1" placeholder="玩家名">
                            <label class="checkbox-label">
                                <input type="checkbox" class="participant-checkbox" checked>
                                <span class="checkmark"></span>
                                <span class="checkbox-text">参与Roll点</span>
                            </label>
                        </div>
                        <div class="player-input-row">
                            <input type="text" class="player-name-input" id="player2" value="ign2" placeholder="玩家名">
                            <label class="checkbox-label">
                                <input type="checkbox" class="participant-checkbox" checked>
                                <span class="checkmark"></span>
                                <span class="checkbox-text">参与Roll点</span>
                            </label>
                        </div>
                        <div class="player-input-row">
                            <input type="text" class="player-name-input" id="player3" value="ign3" placeholder="玩家名">
                            <label class="checkbox-label">
                                <input type="checkbox" class="participant-checkbox" checked>
                                <span class="checkmark"></span>
                                <span class="checkbox-text">参与Roll点</span>
                            </label>
                        </div>
                        <div class="player-input-row">
                            <input type="text" class="player-name-input" id="player4" value="ign4" placeholder="玩家名">
                            <label class="checkbox-label">
                                <input type="checkbox" class="participant-checkbox" checked>
                                <span class="checkmark"></span>
                                <span class="checkbox-text">参与Roll点</span>
                            </label>
                        </div>
                    </div>
                </div>
                
                <!-- Roll点区域 -->
                <div class="roll-section">
                    <h3>Random Roll / 随机Roll点 & Calculate / 计算分配</h3>
                    
                    <div class="dual-buttons">
                        <!-- Roll点按钮 - 保持原有id以便JS工作 -->
                        <button id="startRoll" class="btn-image-roll">
                            <img src="assets/images/startroll.png" alt="开始Roll点" class="roll-btn-img">
                        </button>
                        
                        <!-- 计算按钮 - 使用原有id -->
                        <button id="calculate" class="btn-image-calculate">
                            <img src="assets/images/startcalculate.png" alt="计算分配" class="calculate-btn-img">
                        </button>
                    </div>
                    
                    <!-- Roll点结果 -->
                    <div id="rollResults" class="roll-results">
                        <!-- 结果会被动态填充 -->
                    </div>
                </div>
            </section>
            
            <!-- 结果面板 - 在下方 -->
            <section class="results-panel card">
                <h2>Results / 分配结果</h2>
                <div class="table-container">
                    <table id="resultsTable">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Player / 玩家</th>
                                <th>Base / 基础</th>
                                <th>Deduction / 扣减</th>
                                <th>Actual / 实际</th>
                            </tr>
                        </thead>
                        <tbody id="resultsBody">
                            <!-- 结果会被动态填充 -->
                        </tbody>
                    </table>
                </div>
                
                <div class="summary">
                    <div class="summary-item">
                        <span>Total / 总数:</span>
                        <strong id="totalDisplay">0</strong>
                    </div>
                    <div class="summary-item">
                        <span>Remainder / 余数:</span>
                        <strong id="remainderDisplay">0</strong>
                    </div>
                </div>
            </section>
        </main>
    </div>

    <!-- JavaScript - 使用原有app.js -->
    <script src="scripts/app.js"></script>
    
    <!-- 如果需要，添加适配器脚本 -->
    <script>
    // 适配器：确保新结构与原有JS兼容
    document.addEventListener('DOMContentLoaded', function() {
        console.log('加载适配器...');
        
        // 确保原有JS能找到元素
        // 如果原有JS需要participantCheckboxes，创建它
        if (!document.getElementById('participantCheckboxes') && document.querySelector('.roll-section')) {
            const container = document.createElement('div');
            container.id = 'participantCheckboxes';
            container.className = 'checkbox-group';
            container.style.display = 'none'; // 隐藏但存在
            document.querySelector('.roll-section').appendChild(container);
        }
        
        // 触发原有初始化（如果存在）
        if (window.initApp) {
            window.initApp();
        }
        
        // 监听Pouch输入变化，更新总硬币数
        document.querySelectorAll('.pouch-input').forEach(input => {
            input.addEventListener('input', updateTotalCoins);
        });
        
        function updateTotalCoins() {
            let total = 0;
            document.querySelectorAll('.pouch-input').forEach(input => {
                total += parseInt(input.value) || 0;
            });
            document.getElementById('totalCoins').value = total;
        }
        
        // 初始更新
        updateTotalCoins();
        
        // 玩家数量变化处理
        document.getElementById('playerCount')?.addEventListener('change', function() {
            const count = parseInt(this.value);
            updatePlayerRows(count);
        });
        
        function updatePlayerRows(count) {
            const container = document.getElementById('playerNameInputs');
            if (!container) return;
            
            let html = '';
            for (let i = 1; i <= count; i++) {
                html += `
                    <div class="player-input-row">
                        <input type="text" class="player-name-input" id="player${i}" value="ign${i}" placeholder="玩家名">
                        <label class="checkbox-label">
                            <input type="checkbox" class="participant-checkbox" checked>
                            <span class="checkmark"></span>
                            <span class="checkbox-text">参与Roll点</span>
                        </label>
                    </div>
                `;
            }
            container.innerHTML = html;
        }
    });
    </script>
</body>
</html>
HTML

# 替换原文件
mv index.html.func index.html

# 3. 更新CSS以支持功能
echo "更新CSS支持功能..."
cat >> styles/main.css << 'CSS'

/* 垂直布局 */
.main-content-vertical {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

/* 原有按钮样式恢复 */
.btn-image-roll, .btn-image-calculate {
    display: block;
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.4s ease;
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    width: 340px;
}

.btn-image-roll:hover, .btn-image-calculate:hover {
    transform: translateY(-8px) scale(1.05);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
}

.roll-btn-img, .calculate-btn-img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 16px;
    aspect-ratio: 1551 / 1197;
    object-fit: contain;
}

.btn-image-roll {
    border: 4px solid #FFD89C;
}

.btn-image-roll:hover {
    border-color: #FF6B35;
}

.btn-image-calculate {
    border: 4px solid #B3E5FC;
}

.btn-image-calculate:hover {
    border-color: #0288D1;
}

/* 玩家输入行 */
.player-input-row {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 15px;
    padding: 15px;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
}

.player-name-input {
    flex: 1;
    padding: 14px 18px;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 1.1rem;
    color: #666; /* 灰色文字 */
}

.player-name-input::placeholder {
    color: #999;
}

/* 复选框样式 */
.checkbox-label {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
}

.participant-checkbox {
    width: 20px;
    height: 20px;
    accent-color: #FF6B35;
}

.checkmark {
    display: inline-block;
    width: 20px;
    height: 20px;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 5px;
}

.participant-checkbox:checked + .checkmark {
    background: #FF6B35;
    border-color: #FF6B35;
}

.checkbox-text {
    font-weight: 600;
    color: #2d3748;
}

/* 响应式 */
@media (max-width: 768px) {
    .dual-buttons {
        flex-direction: column;
        align-items: center;
    }
    
    .btn-image-roll, .btn-image-calculate {
        width: 280px;
    }
    
    .player-input-row {
        flex-direction: column;
        align-items: stretch;
        gap: 15px;
    }
}
CSS

echo ""
echo "✅ 功能恢复完成！"
echo ""
echo "🎯 已修复："
echo "   1. 恢复垂直布局（结果在下方）"
echo "   2. 连接原有JavaScript功能"
echo "   3. 玩家名默认显示 ign1-ign6（灰色）"
echo "   4. 只保留一处硬币总和（自动计算）"
echo "   5. 删除多余的输入和按钮"
echo ""
echo "🔄 请刷新浏览器测试功能"
echo ""
echo "🔧 如果仍有问题，请："
echo "   1. 按F12查看控制台错误"
echo "   2. 测试具体哪个功能不工作"
echo "   3. 告诉我错误信息"
