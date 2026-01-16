#!/bin/bash

echo "🔧 修复HTML标签闭合问题..."

# 备份
cp index.html index.html.before-fix-tags

# 修复第145-155行（玩家管理区域结束部分）
echo "修复玩家管理区域结束标签..."
sed -i '' '145,155c\
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

echo "✅ 已修复标签闭合"

# 验证修复
echo ""
echo "=== 修复后验证 ==="
echo "玩家管理区域结束（第140-155行）："
sed -n '140,155p' index.html

echo ""
echo "Roll点区域开始（第156-170行）："
sed -n '156,170p' index.html
