#!/bin/bash

echo "🧹 精确清理混乱区域..."

# 备份
cp index.html index.html.before-clean-exact

# 1. 修复第115-145行的玩家管理区域
# 删除混乱部分，只保留干净的玩家表格
sed -i '' '115,145c\
                    <!-- 玩家名输入框 -->\
                    <div class="input-group">\
                        <label>\
                            <span class="en">Player Names / 玩家名字:</span>\
                        </label>\
                        <div id="playerNameInputs" class="player-name-inputs">\
                            <!-- 表头 -->\
                            <div class="player-table-header">\
                                <div class="header-name">玩家名称</div>\
                                <div class="header-checkbox">参与Roll点</div>\
                            </div>\
                            <!-- 玩家行 -->\
                            <div class="player-row">\
                                <input type="text" class="player-input" id="player1" value="玩家1" placeholder="输入玩家名">\
                                <label class="checkbox-label">\
                                    <input type="checkbox" class="player-checkbox" data-player-id="player1" checked>\
                                    <span class="checkmark"></span>\
                                </label>\
                            </div>\
                            <div class="player-row">\
                                <input type="text" class="player-input" id="player2" value="玩家2" placeholder="输入玩家名">\
                                <label class="checkbox-label">\
                                    <input type="checkbox" class="player-checkbox" data-player-id="player2" checked>\
                                    <span class="checkmark"></span>\
                                </label>\
                            </div>\
                            <div class="player-row">\
                                <input type="text" class="player-input" id="player3" value="玩家3" placeholder="输入玩家名">\
                                <label class="checkbox-label">\
                                    <input type="checkbox" class="player-checkbox" data-player-id="player3" checked>\
                                    <span class="checkmark"></span>\
                                </label>\
                            </div>\
                            <div class="player-row">\
                                <input type="text" class="player-input" id="player4" value="玩家4" placeholder="输入玩家名">\
                                <label class="checkbox-label">\
                                    <input type="checkbox" class="player-checkbox" data-player-id="player4" checked>\
                                    <span class="checkmark"></span>\
                                </label>\
                            </div>\
                        </div>\
                    </div>' index.html

echo "✅ 已清理玩家管理区域"

# 2. 确保Roll点区域在正确位置（第148-170行）
# 检查当前内容
echo "当前Roll点区域内容："
sed -n '148,170p' index.html

# 3. 清理CSS - 移除重复的样式
echo "简化CSS..."
# 备份CSS
cp styles/main.css styles/main.css.backup

# 创建干净的CSS（只保留必要样式）
cat > styles/main-clean.css << 'CSS'
/* 基础样式 */
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    background: #f5f7fa;
    padding: 20px;
}

.container {
    max-width: 1400px;
    margin: 0 auto;
}

/* 卡片 */
.card {
    background: white;
    border-radius: 12px;
    padding: 25px;
    margin-bottom: 25px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

/* 头部 */
.app-header {
    background: linear-gradient(135deg, #FFB347, #FF8C42, #FFD89C);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 30px;
    text-align: center;
}

/* 玩家表格 - 简洁版本 */
.player-name-inputs {
    background: white;
    border-radius: 10px;
    border: 2px solid #eee;
    overflow: hidden;
}

.player-table-header {
    display: flex;
    background: #f8f9fa;
    padding: 15px 20px;
    border-bottom: 2px solid #FFD89C;
    font-weight: 700;
}

.header-name { flex: 1; }
.header-checkbox { width: 120px; text-align: center; }

.player-row {
    display: flex;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #eee;
}

.player-row:last-child {
    border-bottom: none;
}

.player-input {
    flex: 1;
    padding: 12px 15px;
    border: 2px solid #eee;
    border-radius: 8px;
    font-size: 16px;
}

.checkbox-label {
    width: 120px;
    text-align: center;
}

.player-checkbox {
    width: 20px;
    height: 20px;
    accent-color: #FF6B35;
}

/* 双按钮 */
.dual-buttons-horizontal {
    display: flex;
    gap: 30px;
    justify-content: center;
    margin: 30px 0;
}

.btn-roll-horizontal,
.btn-calculate-horizontal {
    width: 300px;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    border-radius: 15px;
    overflow: hidden;
}

.btn-img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 12px;
}

.btn-roll-horizontal {
    border: 3px solid #FFD89C;
}

.btn-calculate-horizontal {
    border: 3px solid #B3E5FC;
}

/* 响应式 */
@media (max-width: 768px) {
    .dual-buttons-horizontal {
        flex-direction: column;
        align-items: center;
    }
    
    .btn-roll-horizontal,
    .btn-calculate-horizontal {
        width: 260px;
    }
}
CSS

# 暂时使用干净CSS
cp styles/main-clean.css styles/main.css

echo ""
echo "✅ 清理完成！"
echo "🔄 请刷新浏览器"
echo ""
echo "如果还想进一步调整，请告诉我具体问题"
