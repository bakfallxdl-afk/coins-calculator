#!/bin/bash

echo "🎯 修改Pouch区域为紧凑水平布局..."

# 使用sed替换整个pouch-inputs区域
sed -i '' 's|<div class="pouch-inputs">|<div class="pouch-inputs" style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px;">|' index-terminal-commands-backup.html

# 修改每个pouch-item为紧凑样式
sed -i '' 's|<div class="pouch-item">|<div class="pouch-item" style="flex: 1; min-width: 120px; padding: 6px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;">|g' index-terminal-commands-backup.html

# 缩小pouch-icon
sed -i '' 's|<div class="pouch-icon">|<div class="pouch-icon" style="display: flex; align-items: center; gap: 5px; margin-bottom: 4px; font-size: 0.85rem; color: #495057;">|g' index-terminal-commands-backup.html

# 缩小图片尺寸
sed -i '' 's|<img src="assets/images/pouch4.png" alt="[^"]*" class="pouch-img">|<img src="assets/images/pouch4.png" alt="pouch" class="pouch-img" style="width: 22px; height: 22px; object-fit: contain;">|g' index-terminal-commands-backup.html

# 缩小输入框尺寸（最大35硬币，所以不需要大输入框）
sed -i '' 's|<input type="number" id="pouch[1-4]" class="pouch-input" value="0" min="0"|<input type="number" id="&" class="pouch-input" value="0" min="0" style="width: 100%; padding: 5px 6px; font-size: 0.9rem; text-align: center; border: 1px solid #ced4da; border-radius: 4px;"|g' index-terminal-commands-backup.html

# 删除totalCoins输入框后的快速按钮（保持简洁）
sed -i '' '/<div class="input-with-buttons">/,/<\/div>/d' index-terminal-commands-backup.html

# 替换为简单的只读输入框
# 先找到相关行
TOTAL_COINS_LINE=$(grep -n '<input type="number" id="totalCoins"' index-terminal-commands-backup.html | head -1 | cut -d: -f1)
if [ ! -z "$TOTAL_COINS_LINE" ]; then
    # 删除从input-with-buttons开始到button-group之前的内容
    awk '
    /<div class="input-with-buttons">/ { skip=1; next }
    /<div class="button-group">/ { skip=0 }
    skip==0 { print }
    ' index-terminal-commands-backup.html > temp.html && mv temp.html index-terminal-commands-backup.html
    
    # 重新添加简化版本
    sed -i '' '/<label for="totalCoins">/,/<\/label>/ {
        /<\/label>/ a\
                    <div style="margin-top: 5px;">\
                        <input type="number" id="totalCoins" value="0" min="0" readonly style="width: 120px; padding: 6px 8px; font-size: 0.9rem; background: #f8f9fa; border: 1px solid #ced4da; border-radius: 4px;">\
                    </div>
    }' index-terminal-commands-backup.html
fi

echo "✅ Pouch区域已优化为紧凑布局"
