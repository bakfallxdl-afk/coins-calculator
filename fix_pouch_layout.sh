#!/bin/bash

echo "🔧 开始优化Pouch布局..."

# 备份
cp index.html index.html.bak.$(date +%Y%m%d_%H%M%S)

# 使用awk处理文件
awk '
BEGIN { in_pouch_summary = 0 }

# 找到pouch-summary开始标记
/<div class="pouch-summary">/ {
    in_pouch_summary = 1
    next
}

# 在pouch-summary内，跳过所有行
in_pouch_summary && /<\/div>/ {
    in_pouch_summary = 0
    next
}

# 跳过pouch-summary内的所有行
in_pouch_summary { next }

# 打印其他所有行
{ print }
' index.html > index.html.tmp && mv index.html.tmp index.html

echo "✅ 已删除Pouch总和区域"
