#!/bin/bash

echo "🎯 优化Pouch输入布局..."

# 备份
cp index.html index.html.compact.bak

# 压缩pouch-inputs的样式和内边距
sed -i '' 's/pouch-inputs"/pouch-inputs" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;"/' index.html

# 缩小pouch-item的内边距和边距
sed -i '' 's/<div class="pouch-item">/<div class="pouch-item" style="padding: 6px; margin: 2px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;">/' index.html

# 缩小pouch-icon的间距
sed -i '' 's/<div class="pouch-icon">/<div class="pouch-icon" style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px; font-size: 0.9rem; color: #495057;">/' index.html

# 缩小pouch-img尺寸（最大35硬币，不需要大图）
sed -i '' 's/<img src="assets\/images\/pouch4.png" alt="[^"]*" class="pouch-img">/<img src="assets\/images\/pouch4.png" alt="pouch" class="pouch-img" style="width: 24px; height: 24px; object-fit: contain;">/' index.html

# 缩小pouch-input输入框尺寸
sed -i '' 's/<input type="number" id="pouch[1-4]" class="pouch-input" value="0" min="0"/<input type="number" id="&" class="pouch-input" value="0" min="0" style="width: 80px; padding: 6px 8px; font-size: 0.9rem;"/' index.html

# 调整总硬币数输入框（更紧凑）
sed -i '' 's/<input type="number" id="totalCoins" value="0" min="0" readonly/<input type="number" id="totalCoins" value="0" min="0" readonly style="width: 100px; padding: 6px 8px; background: #f8f9fa; font-size: 0.9rem;"/' index.html

echo "✅ Pouch布局已优化为紧凑版"
