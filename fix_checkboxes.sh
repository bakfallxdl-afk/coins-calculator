#!/bin/bash

echo "🎯 修复复选框问题并优化Pouch布局..."

# 创建临时文件
TEMP_FILE=$(mktemp)

# 使用awk处理整个HTML
awk '
BEGIN {
    in_player_inputs = 0
    player_count = 0
}

# 处理玩家名输入区域
/<div id="playerNameInputs" class="player-name-inputs">/ {
    in_player_inputs = 1
    print $0
    next
}

# 结束玩家名输入区域
in_player_inputs && /<\/div>/ {
    in_player_inputs = 0
    print $0
    next
}

# 在玩家名输入区域内
in_player_inputs {
    # 跳过所有现有的内容（我们重新生成）
    next
}

# 处理Pouch输入区域 - 改为水平紧凑布局
/<div class="pouch-inputs">/ {
    print $0
    print "                        <div class=\"pouch-item\" style=\"display: flex; align-items: center; gap: 8px; padding: 5px 10px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;\">"
    print "                            <div class=\"pouch-icon\" style=\"display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: #495057; min-width: 80px;\">"
    print "                                <img src=\"assets/images/pouch4.png\" alt=\"pouch\" class=\"pouch-img\" style=\"width: 24px; height: 24px; object-fit: contain;\">"
    print "                                <span>pouch1:</span>"
    print "                            </div>"
    print "                            <input type=\"number\" id=\"pouch1\" class=\"pouch-input\" value=\"0\" min=\"0\" data-index=\"0\" style=\"width: 60px; padding: 4px 6px; font-size: 0.9rem; text-align: center;\">"
    print "                        </div>"
    print "                        <div class=\"pouch-item\" style=\"display: flex; align-items: center; gap: 8px; padding: 5px 10px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;\">"
    print "                            <div class=\"pouch-icon\" style=\"display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: #495057; min-width: 80px;\">"
    print "                                <img src=\"assets/images/pouch4.png\" alt=\"pouch\" class=\"pouch-img\" style=\"width: 24px; height: 24px; object-fit: contain;\">"
    print "                                <span>pouch2:</span>"
    print "                            </div>"
    print "                            <input type=\"number\" id=\"pouch2\" class=\"pouch-input\" value=\"0\" min=\"0\" data-index=\"1\" style=\"width: 60px; padding: 4px 6px; font-size: 0.9rem; text-align: center;\">"
    print "                        </div>"
    print "                        <div class=\"pouch-item\" style=\"display: flex; align-items: center; gap: 8px; padding: 5px 10px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;\">"
    print "                            <div class=\"pouch-icon\" style=\"display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: #495057; min-width: 80px;\">"
    print "                                <img src=\"assets/images/pouch4.png\" alt=\"pouch\" class=\"pouch-img\" style=\"width: 24px; height: 24px; object-fit: contain;\">"
    print "                                <span>pouch3:</span>"
    print "                            </div>"
    print "                            <input type=\"number\" id=\"pouch3\" class=\"pouch-input\" value=\"0\" min=\"0\" data-index=\"2\" style=\"width: 60px; padding: 4px 6px; font-size: 0.9rem; text-align: center;\">"
    print "                        </div>"
    print "                        <div class=\"pouch-item\" style=\"display: flex; align-items: center; gap: 8px; padding: 5px 10px; background: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;\">"
    print "                            <div class=\"pouch-icon\" style=\"display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: #495057; min-width: 80px;\">"
    print "                                <img src=\"assets/images/pouch4.png\" alt=\"pouch\" class=\"pouch-img\" style=\"width: 24px; height: 24px; object-fit: contain;\">"
    print "                                <span>pouch4:</span>"
    print "                            </div>"
    print "                            <input type=\"number\" id=\"pouch4\" class=\"pouch-input\" value=\"0\" min=\"0\" data-index=\"3\" style=\"width: 60px; padding: 4px 6px; font-size: 0.9rem; text-align: center;\">"
    print "                        </div>"
    # 跳过原始行
    next
}

# 匹配playerNameInputs的开始并重新生成（修复复选框）
/^[[:space:]]*<div id="playerNameInputs" class="player-name-inputs">/ {
    print "                    <div id=\"playerNameInputs\" class=\"player-name-inputs\">"
    print "                        <!-- 这里会被JavaScript动态填充 -->"
    print "                        <div class=\"player-input-row\" style=\"display: flex; align-items: center; justify-content: space-between; padding: 8px; margin: 5px 0; background: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;\">"
    print "                            <input type=\"text\" class=\"player-name-input\" id=\"player1\" value=\"ign1\" placeholder=\"玩家名\" style=\"flex: 1; padding: 6px 10px; font-size: 0.9rem; border: 1px solid #ced4da; border-radius: 4px; margin-right: 10px;\">"
    print "                            <label class=\"checkbox-label\" style=\"display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #495057; cursor: pointer;\">"
    print "                                <span style=\"white-space: nowrap;\">参与Roll点</span>"
    print "                                <input type=\"checkbox\" class=\"participant-checkbox\" checked style=\"width: 18px; height: 18px;\">"
    print "                            </label>"
    print "                        </div>"
    print "                        <div class=\"player-input-row\" style=\"display: flex; align-items: center; justify-content: space-between; padding: 8px; margin: 5px 0; background: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;\">"
    print "                            <input type=\"text\" class=\"player-name-input\" id=\"player2\" value=\"ign2\" placeholder=\"玩家名\" style=\"flex: 1; padding: 6px 10px; font-size: 0.9rem; border: 1px solid #ced4da; border-radius: 4px; margin-right: 10px;\">"
    print "                            <label class=\"checkbox-label\" style=\"display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #495057; cursor: pointer;\">"
    print "                                <span style=\"white-space: nowrap;\">参与Roll点</span>"
    print "                                <input type=\"checkbox\" class=\"participant-checkbox\" checked style=\"width: 18px; height: 18px;\">"
    print "                            </label>"
    print "                        </div>"
    print "                        <div class=\"player-input-row\" style=\"display: flex; align-items: center; justify-content: space-between; padding: 8px; margin: 5px 0; background: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;\">"
    print "                            <input type=\"text\" class=\"player-name-input\" id=\"player3\" value=\"ign3\" placeholder=\"玩家名\" style=\"flex: 1; padding: 6px 10px; font-size: 0.9rem; border: 1px solid #ced4da; border-radius: 4px; margin-right: 10px;\">"
    print "                            <label class=\"checkbox-label\" style=\"display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #495057; cursor: pointer;\">"
    print "                                <span style=\"white-space: nowrap;\">参与Roll点</span>"
    print "                                <input type=\"checkbox\" class=\"participant-checkbox\" checked style=\"width: 18px; height: 18px;\">"
    print "                            </label>"
    print "                        </div>"
    print "                        <div class=\"player-input-row\" style=\"display: flex; align-items: center; justify-content: space-between; padding: 8px; margin: 5px 0; background: #f8f9fa; border-radius: 6px; border: 1px solid #e9ecef;\">"
    print "                            <input type=\"text\" class=\"player-name-input\" id=\"player4\" value=\"ign4\" placeholder=\"玩家名\" style=\"flex: 1; padding: 6px 10px; font-size: 0.9rem; border: 1px solid #ced4da; border-radius: 4px; margin-right: 10px;\">"
    print "                            <label class=\"checkbox-label\" style=\"display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #495057; cursor: pointer;\">"
    print "                                <span style=\"white-space: nowrap;\">参与Roll点</span>"
    print "                                <input type=\"checkbox\" class=\"participant-checkbox\" checked style=\"width: 18px; height: 18px;\">"
    print "                            </label>"
    print "                        </div>"
    print "                    </div>"
    # 跳过原始行
    next
}

# 打印其他所有行
{ print }

END {
    print "✅ HTML处理完成"
}
' index.html > "$TEMP_FILE" && mv "$TEMP_FILE" index.html

# 删除多余的复选框容器（如果之前创建了）
sed -i '' '/<div id="participantCheckboxes"/d' index.html

echo "✅ 修复完成！"
