#!/bin/bash
echo "正在更新样式..."

# 确保CSS文件被引用
if ! grep -q "styles/header.css" index.html; then
    sed -i '' '/<link rel="stylesheet" href="styles\/main.css">/a\
    <!-- 头部样式 -->\
    <link rel="stylesheet" href="styles/header.css">\
    <!-- 按钮样式 -->\
    <link rel="stylesheet" href="styles/button.css">' index.html
fi

# 清理可能重复的引用
sed -i '' '/styles\/header.css/d; /styles\/button.css/d' index.html
sed -i '' '/<link rel="stylesheet" href="styles\/main.css">/a\
    <!-- 头部样式 -->\
    <link rel="stylesheet" href="styles/header.css">\
    <!-- 按钮样式 -->\
    <link rel="stylesheet" href="styles/button.css">' index.html

echo "更新完成！请刷新页面查看效果。"
