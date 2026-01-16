#!/bin/bash

echo "🧹 彻底清理所有重复和旧代码..."

cd "/Users/xiedonglei/Desktop/boss/coins-calculator-pwa"

# 备份
cp index.html index.html.before-nuclear

# 1. 首先，我们只看整个HTML的关键部分，找到问题
echo "=== 当前问题分析 ==="
echo "1. 查找所有按钮："
grep -n "startRoll\|startCalculate\|calculate\|btn-" index.html

echo ""
echo "2. 查找所有复选框相关："
grep -n "checkbox\|participantCheckboxes" index.html

# 2. 创建一个全新的、干净的HTML结构
echo "创建全新HTML结构..."
cat > index.html.new << 'HTML'
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

        <!-- 主内容区 -->
        <main class="main-content">
            <!-- 左侧面板 -->
            <div class="left-panel">
                <!-- 控制面板 -->
                <section class="control-panel card">
                    <h2>设置 Settings</h2>
                    
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
                    
                    <div class="input-group">
                        <label for="totalCoins">
                            <span class="en">Total Coins / 硬币总数:</span>
                        </label>
                        <div class="input-with-buttons">
                            <input type="number" id="totalCoins" value="0" min="0" readonly>
                            <div class="quick-buttons">
                                <button class="quick-btn" data-amount="1000">1K</button>
                                <button class="quick-btn" data-amount="5000">5K</button>
                                <button class="quick-btn" data-amount="10000">10K</button>
                            </div>
                        </div>
                    </div>
                </section>
                
                <!-- 玩家管理区域 - 新表格布局 -->
                <section class="player-management card">
                    <h2>Player Management / 玩家管理</h2>
                    
                    <!-- 玩家名输入框 - 表格布局 -->
                    <div class="input-group">
                        <label>
                            <span class="en">Player Names / 玩家名字:</span>
                        </label>
                        <div class="player-table-container">
                            <!-- 表头 -->
                            <div class="table-header">
                                <div class="col-name">玩家名称</div>
                                <div class="col-checkbox">参与Roll点</div>
                            </div>
                            
                            <!-- 玩家行 -->
                            <div class="player-row">
                                <input type="text" id="player1" value="玩家1" placeholder="输入玩家名">
                                <input type="checkbox" checked>
                            </div>
                            <div class="player-row">
                                <input type="text" id="player2" value="玩家2" placeholder="输入玩家名">
                                <input type="checkbox" checked>
                            </div>
                            <div class="player-row">
                                <input type="text" id="player3" value="玩家3" placeholder="输入玩家名">
                                <input type="checkbox" checked>
                            </div>
                            <div class="player-row">
                                <input type="text" id="player4" value="玩家4" placeholder="输入玩家名">
                                <input type="checkbox" checked>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Roll点区域 - 双按钮横向 -->
                    <div class="roll-section">
                        <h3>Random Roll / 随机Roll点 & Calculate / 计算分配</h3>
                        
                        <div class="dual-buttons">
                            <button id="startRoll" class="btn-roll">
                                <img src="assets/images/startroll.png" alt="开始Roll点">
                            </button>
                            
                            <button id="startCalculate" class="btn-calculate">
                                <img src="assets/images/startcalculate.png" alt="计算分配">
                            </button>
                        </div>
                        
                        <div id="rollResults" class="roll-results">
                            <!-- 结果区域 -->
                        </div>
                    </div>
                </section>
            </div>
            
            <!-- 右侧：结果面板 -->
            <div class="right-panel">
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
                                <!-- 结果行 -->
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
            </div>
        </main>
    </div>

    <!-- JavaScript -->
    <script src="scripts/app.js"></script>
</body>
</html>
HTML

# 替换原文件
mv index.html.new index.html

# 3. 创建完整美观的CSS
echo "创建完整美观CSS..."
cat > styles/main.css << 'CSS'
/* ========== 基础重置和变量 ========== */
:root {
    --primary-orange: #FF6B35;
    --orange-light: #FFD89C;
    --orange-dark: #FF8C42;
    --blue-light: #B3E5FC;
    --blue-dark: #0288D1;
    --gray-light: #f8f9fa;
    --gray-border: #e2e8f0;
    --gray-text: #2d3748;
    --white: #ffffff;
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-hover: 0 10px 25px rgba(0, 0, 0, 0.15);
    --radius: 12px;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    min-height: 100vh;
    padding: 20px;
    color: var(--gray-text);
}

.container {
    max-width: 1400px;
    margin: 0 auto;
}

/* ========== 卡片样式 ========== */
.card {
    background: var(--white);
    border-radius: var(--radius);
    padding: 25px;
    margin-bottom: 25px;
    box-shadow: var(--shadow);
    border: 1px solid var(--gray-border);
}

.card h2 {
    color: var(--primary-orange);
    margin-bottom: 20px;
    font-size: 1.4rem;
    display: flex;
    align-items: center;
    gap: 10px;
}

/* ========== 头部样式 ========== */
.app-header {
    background: linear-gradient(135deg, #FFB347 0%, #FF8C42 25%, #FFD89C 50%, #FFF5E1 75%, #FFA726 100%);
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 30px;
    text-align: center;
    border: 4px solid var(--orange-light);
    box-shadow: 0 10px 30px rgba(255, 107, 53, 0.2);
    min-height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.header-image {
    max-height: 180px;
    max-width: 90%;
    border-radius: 12px;
    object-fit: contain;
}

/* ========== 主内容布局 ========== */
.main-content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 30px;
}

@media (min-width: 1024px) {
    .main-content {
        grid-template-columns: 1fr 1fr;
    }
}

/* ========== 输入组样式 ========== */
.input-group {
    margin-bottom: 25px;
}

.input-group label {
    display: block;
    margin-bottom: 10px;
    font-weight: 600;
    color: var(--gray-text);
}

.input-group label .en {
    font-weight: normal;
    opacity: 0.8;
    font-size: 0.9rem;
}

input, select {
    width: 100%;
    padding: 14px 18px;
    border: 2px solid var(--gray-border);
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: var(--white);
}

input:focus, select:focus {
    border-color: var(--primary-orange);
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
    outline: none;
}

/* ========== 玩家表格布局 ========== */
.player-table-container {
    background: var(--white);
    border-radius: 10px;
    border: 2px solid var(--gray-border);
    overflow: hidden;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.table-header {
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, var(--gray-light) 0%, #e9ecef 100%);
    padding: 18px 20px;
    border-bottom: 3px solid var(--orange-light);
    font-weight: 700;
    color: var(--gray-text);
}

.col-name {
    flex: 1;
    font-size: 1.1rem;
}

.col-checkbox {
    width: 120px;
    text-align: center;
    font-size: 1.1rem;
}

.player-row {
    display: flex;
    align-items: center;
    padding: 18px 20px;
    border-bottom: 1px solid var(--gray-border);
    transition: all 0.2s ease;
}

.player-row:hover {
    background: var(--gray-light);
}

.player-row:last-child {
    border-bottom: none;
}

.player-row input[type="text"] {
    flex: 1;
    margin-right: 20px;
    border: 2px solid var(--gray-border);
    padding: 14px 18px;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 500;
}

.player-row input[type="checkbox"] {
    width: 22px;
    height: 22px;
    accent-color: var(--primary-orange);
    cursor: pointer;
}

/* ========== 双按钮布局 ========== */
.dual-buttons {
    display: flex;
    gap: 40px;
    justify-content: center;
    align-items: center;
    margin: 40px 0;
    padding: 20px;
}

.btn-roll, .btn-calculate {
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

.btn-roll:hover, .btn-calculate:hover {
    transform: translateY(-8px) scale(1.05);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
}

.btn-roll:active, .btn-calculate:active {
    transform: translateY(-4px) scale(1.02);
}

.btn-roll img, .btn-calculate img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 16px;
    aspect-ratio: 1551 / 1197;
    object-fit: contain;
}

.btn-roll {
    border: 4px solid var(--orange-light);
}

.btn-roll:hover {
    border-color: var(--primary-orange);
}

.btn-calculate {
    border: 4px solid var(--blue-light);
}

.btn-calculate:hover {
    border-color: var(--blue-dark);
}

/* ========== Pouch输入区域 ========== */
.pouch-inputs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    margin-bottom: 15px;
}

@media (min-width: 768px) {
    .pouch-inputs {
        grid-template-columns: repeat(4, 1fr);
    }
}

.pouch-item {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.pouch-icon {
    display: flex;
    align-items: center;
    gap: 8px;
}

.pouch-img {
    width: 24px;
    height: 24px;
}

.pouch-input {
    text-align: center;
    font-weight: 600;
    font-size: 1.1rem;
}

.pouch-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background: var(--gray-light);
    border-radius: 8px;
    border: 2px solid var(--gray-border);
}

/* ========== 快速按钮 ========== */
.input-with-buttons {
    display: flex;
    gap: 12px;
    align-items: center;
}

.quick-buttons {
    display: flex;
    gap: 8px;
}

.quick-btn {
    padding: 12px 20px;
    background: var(--white);
    border: 2px solid var(--gray-border);
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s ease;
}

.quick-btn:hover {
    background: var(--primary-orange);
    color: var(--white);
    border-color: var(--primary-orange);
}

/* ========== 表格样式 ========== */
.table-container {
    overflow-x: auto;
    margin: 20px 0;
    border-radius: 8px;
    border: 1px solid var(--gray-border);
}

table {
    width: 100%;
    border-collapse: collapse;
    min-width: 500px;
}

thead {
    background: linear-gradient(135deg, var(--primary-orange) 0%, var(--orange-dark) 100%);
    color: var(--white);
}

th, td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid var(--gray-border);
}

tbody tr:hover {
    background: var(--gray-light);
}

/* ========== 摘要样式 ========== */
.summary {
    display: flex;
    gap: 30px;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid var(--gray-border);
}

.summary-item {
    display: flex;
    align-items: center;
    gap: 10px;
}

.summary-item span {
    color: #666;
}

.summary-item strong {
    font-size: 1.2rem;
    color: var(--primary-orange);
}

/* ========== 响应式设计 ========== */
@media (max-width: 1024px) {
    .btn-roll, .btn-calculate {
        width: 300px;
    }
    
    .dual-buttons {
        gap: 30px;
    }
}

@media (max-width: 768px) {
    .main-content {
        grid-template-columns: 1fr;
    }
    
    .player-row {
        flex-direction: column;
        align-items: stretch;
        gap: 15px;
    }
    
    .player-row input[type="text"] {
        margin-right: 0;
        width: 100%;
    }
    
    .col-checkbox {
        width: 100%;
        text-align: left;
        margin-bottom: 10px;
    }
    
    .btn-roll, .btn-calculate {
        width: 280px;
    }
    
    .dual-buttons {
        flex-direction: column;
        gap: 20px;
    }
    
    .pouch-inputs {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 480px) {
    .btn-roll, .btn-calculate {
        width: 240px;
    }
    
    .dual-buttons {
        gap: 15px;
    }
    
    .pouch-inputs {
        grid-template-columns: 1fr;
    }
    
    .summary {
        flex-direction: column;
        gap: 15px;
    }
}

/* ========== 隐藏所有旧元素 ========== */
#participantCheckboxes,
.participant-controls,
.checkbox-group,
.select-all-btn,
.deselect-all-btn {
    display: none !important;
}
CSS

echo ""
echo "✅ 彻底清理完成！"
echo ""
echo "🎯 已执行："
echo "   1. 删除所有重复按钮和复选框"
echo "   2. 创建全新HTML结构"
echo "   3. 添加完整美观CSS"
echo ""
echo "🔄 请刷新浏览器查看"
echo ""
echo "📋 新布局包含："
echo "   • 1个玩家表格（4行，每行：输入框+复选框）"
echo "   • 2个按钮（水平排列）"
echo "   • 没有多余元素"
echo "   • 美观的橙色渐变主题"
