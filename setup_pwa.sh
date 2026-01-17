#!/bin/bash

cd /var/www/coins-calculator

echo "=== 设置PWA图标 ==="

# 1. 创建manifest.json
echo "创建manifest.json..."
cat > manifest.json << 'MANIFEST_EOF'
{
  "name": "Coins Calculator",
  "short_name": "CoinsCalc",
  "description": "硬币计算器 - 智能分配硬币 | Coins Calculator - Smart Distribution",
  "start_url": "/coins-calculator/",
  "scope": "/coins-calculator/",
  "display": "standalone",
  "background_color": "#FF6B35",
  "theme_color": "#FF6B35",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "assets/images/favicon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "assets/images/web-app-manifest-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "assets/images/web-app-manifest-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "categories": ["finance", "productivity", "utilities"],
  "screenshots": [],
  "shortcuts": [
    {
      "name": "新计算",
      "short_name": "计算",
      "description": "开始新的硬币分配计算",
      "url": "/coins-calculator/?action=new",
      "icons": [{ "src": "assets/images/favicon-96x96.png", "sizes": "96x96" }]
    }
  ]
}
MANIFEST_EOF

# 2. 更新HTML的head部分
echo "更新HTML头部..."
# 先备份
cp index.html index.html.before_pwa

# 创建新的head部分
cat > new_head.html << 'HEAD_EOF'
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- 应用信息 -->
    <title>Coins Calculator | 硬币计算器</title>
    <meta name="description" content="智能硬币分配计算器 | Smart coins distribution calculator">
    
    <!-- PWA配置 -->
    <link rel="manifest" href="manifest.json" crossorigin="use-credentials">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="CoinsCalc">
    
    <!-- 苹果图标 -->
    <link rel="apple-touch-icon" href="assets/images/apple-touch-icon.png">
    <link rel="apple-touch-icon" sizes="152x152" href="assets/images/web-app-manifest-192x192.png">
    <link rel="apple-touch-icon" sizes="180x180" href="assets/images/web-app-manifest-192x192.png">
    <link rel="apple-touch-icon" sizes="167x167" href="assets/images/web-app-manifest-192x192.png">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="assets/images/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="assets/images/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="96x96" href="assets/images/favicon-96x96.png">
    <link rel="icon" type="image/svg+xml" href="assets/images/favicon.svg">
    
    <!-- Windows -->
    <meta name="msapplication-TileImage" content="assets/images/web-app-manifest-144x144.png">
    <meta name="msapplication-TileColor" content="#FF6B35">
    <meta name="msapplication-config" content="browserconfig.xml">
    <meta name="application-name" content="Coins Calculator">
    
    <!-- 主题颜色 -->
    <meta name="theme-color" content="#FF6B35" media="(prefers-color-scheme: light)">
    <meta name="theme-color" content="#0a0a0a" media="(prefers-color-scheme: dark)">
    
    <!-- 样式 -->
    <link rel="stylesheet" href="styles/main.css?v=1768578081">
    
    <!-- PWA Service Worker 注册 -->
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('service-worker.js')
                    .then(registration => {
                        console.log('ServiceWorker 注册成功: ', registration.scope);
                    })
                    .catch(err => {
                        console.log('ServiceWorker 注册失败: ', err);
                    });
            });
            
            // 监听beforeinstallprompt事件
            let deferredPrompt;
            window.addEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                deferredPrompt = e;
                console.log('PWA可以安装到桌面');
                
                // 可以在这里显示安装按钮
                // showInstallPromotion();
            });
        }
    </script>
</head>
HEAD_EOF

# 替换head部分
sed -i '/<head>/,/<\/head>/c\' index.html
sed -i '1r new_head.html' index.html
sed -i '1d' index.html

# 清理
rm -f new_head.html

echo "=== PWA设置完成 ==="
echo "1. manifest.json 已创建"
echo "2. HTML头部已更新"
echo "3. 请确保图片文件存在:"
echo "   - assets/images/apple-touch-icon.png"
echo "   - assets/images/favicon.ico"
echo "   - assets/images/favicon-96x96.png"
echo "   - assets/images/web-app-manifest-192x192.png"
echo "   - assets/images/web-app-manifest-512x512.png"
echo ""
echo "访问 https://107.150.25.237/coins-calculator/ 查看效果"
echo "在Chrome中，点击地址栏的安装图标或菜单中的'安装应用'"
