#!/bin/bash

echo "🔧 开始修复HTML结构..."

# 备份原文件
cp index.html index.html.backup.$(date +%Y%m%d_%H%M%S)

# 检查是否需要修复
if grep -q 'id="participantCheckboxes"' index.html; then
    echo "✅ participantCheckboxes 已存在"
else
    echo "🔍 查找roll-section位置"
    
    # 在roll-section中插入participantCheckboxes
    awk '
    /<div class="roll-section">/ {
        print $0
        print "            <!-- 参与者复选框容器（供JS使用） -->"
        print "            <div id=\"participantCheckboxes\" class=\"checkbox-group\"></div>"
        print ""
        next
    }
    { print $0 }
    ' index.html > index.html.tmp && mv index.html.tmp index.html
    
    echo "✅ 已添加participantCheckboxes容器"
fi

# 清理不必要的JS文件引用
echo "🧹 清理不必要的JS引用..."
# 从HTML中移除测试性的JS文件
sed -i '' '/fill-participants.js/d' index.html
sed -i '' '/complete-fix.js/d' index.html
sed -i '' '/participant-fix.js/d' index.html
sed -i '' '/simple-sync.js/d' index.html

echo "✅ 清理完成"

# 验证修复
echo "📋 验证修复结果："
echo "1. participantCheckboxes是否存在: $(grep -c 'participantCheckboxes' index.html)"
echo "2. 主JS文件引用: $(grep -c 'scripts/app.js' index.html)"

echo "🎉 修复完成！请刷新浏览器测试按钮功能。"
