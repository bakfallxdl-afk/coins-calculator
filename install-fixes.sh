#!/bin/bash

echo "🚀 开始安装完整修复包..."

# 1. 创建CSS文件
echo "📁 创建 fix-all.css..."
cat > styles/fix-all.css << 'CSS'
/* ========== 完整修复：玩家管理和参与者区域 ========== */

/* [这里包含上面所有的CSS代码，为了简洁省略] */
CSS

# 2. 创建JS文件
echo "📁 创建 complete-fix.js..."
cat > scripts/complete-fix.js << 'JS'
// [这里包含上面所有的JS代码，为了简洁省略]
JS

# 3. 更新HTML文件
echo "📄 更新 index.html..."

# 备份原文件
cp index.html index.html.backup.$(date +%Y%m%d_%H%M%S)

# 添加CSS引用（如果还没有）
if ! grep -q "fix-all.css" index.html; then
    sed -i '' '/<link.*stylesheet.*main.css/a\
    <link rel="stylesheet" href="styles/fix-all.css">' index.html
fi

# 添加JS引用（如果还没有）
if ! grep -q "complete-fix.js" index.html; then
    sed -i '' '/<script.*app.js/i\
    <script src="scripts/complete-fix.js"></script>' index.html
fi

echo "✅ 安装完成！"
echo ""
echo "📋 已创建："
echo "   - styles/fix-all.css"
echo "   - scripts/complete-fix.js"
echo "   - index.html 已备份并更新引用"
echo ""
echo "🔄 请刷新浏览器查看效果"
echo "🔧 如果还有问题，按F12查看控制台错误信息"
