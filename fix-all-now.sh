#!/bin/bash

echo "🚀 执行完整修复..."

cd "/Users/xiedonglei/Desktop/boss/coins-calculator-pwa"

# 1. 创建JS文件
cat > scripts/fill-participants.js << 'JS'
[上面JS文件的内容，复制进去]
JS

# 2. 添加CSS
cat >> styles/main.css << 'CSS'
[上面CSS的内容，复制进去]
CSS

# 3. 添加JS引用
if ! grep -q "fill-participants.js" index.html; then
    sed -i '' '/<script.*app.js/i\
    <script src="scripts/fill-participants.js"></script>' index.html
    echo "✅ 已添加JS引用"
else
    echo "✅ JS引用已存在"
fi

echo ""
echo "🎉 修复完成！"
echo "🔄 请刷新浏览器查看效果"
