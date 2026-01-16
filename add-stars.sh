#!/bin/bash

# 备份原文件
cp index.html index.html.backup.$(date +%H%M%S)

# 在头部添加星星装饰
sed -i '' 's|<header class="app-header">|<header class="app-header">\
        <div class="star">✦</div>\
        <div class="star">✧</div>\
        <div class="star">✦</div>\
        <div class="star">✧</div>|' index.html

echo "星星装饰已添加！"
