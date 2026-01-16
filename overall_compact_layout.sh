#!/bin/bash

echo "📐 优化整体布局..."

# 减小控制面板的间距
sed -i '' 's/<section class="control-panel card">/<section class="control-panel card" style="padding: 15px; margin-bottom: 15px;">/' index.html

# 减小输入组的间距
sed -i '' 's/<div class="input-group">/<div class="input-group" style="margin-bottom: 12px;">/' index.html

# 优化玩家名输入框布局
sed -i '' 's/<div id="playerNameInputs" class="player-name-inputs">/<div id="playerNameInputs" class="player-name-inputs" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 10px;">/' index.html

# 优化玩家输入行
sed -i '' 's/<div class="player-input-row">/<div class="player-input-row" style="display: flex; flex-direction: column; gap: 5px; padding: 8px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;">/' index.html

# 优化玩家名输入框
sed -i '' 's/<input type="text" class="player-name-input"/<input type="text" class="player-name-input" style="width: 100%; padding: 6px 8px; font-size: 0.9rem; border: 1px solid #ced4da; border-radius: 4px;"/' index.html

# 优化checkbox-label
sed -i '' 's/<label class="checkbox-label">/<label class="checkbox-label" style="display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: #6c757d; cursor: pointer; user-select: none;">/' index.html

# 减小roll-section的内边距
sed -i '' 's/<div class="roll-section">/<div class="roll-section" style="padding: 15px; margin-top: 15px;">/' index.html

# 优化dual-buttons按钮间距
sed -i '' 's/<div class="dual-buttons">/<div class="dual-buttons" style="display: flex; gap: 10px; justify-content: center; margin: 15px 0;">/' index.html

# 优化按钮图片尺寸
sed -i '' 's/<img src="assets\/images\/startroll.png" alt="开始Roll点" class="roll-btn-img">/<img src="assets\/images\/startroll.png" alt="开始Roll点" class="roll-btn-img" style="width: 140px; height: auto;">/' index.html

sed -i '' 's/<img src="assets\/images\/startcalculate.png" alt="计算分配" class="calculate-btn-img">/<img src="assets\/images\/startcalculate.png" alt="计算分配" class="calculate-btn-img" style="width: 140px; height: auto;">/' index.html

echo "✅ 整体布局已优化"
