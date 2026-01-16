#!/bin/bash

echo "🎨 添加更多样式..."

cd "/Users/xiedonglei/Desktop/boss/coins-calculator-pwa"

# 添加按钮悬停效果
cat >> styles/main.css << 'CSS'

/* 按钮悬停效果 */
.btn-roll-horizontal:hover,
.btn-calculate-horizontal:hover {
    transform: translateY(-5px);
    transition: transform 0.3s ease;
}

.btn-roll-horizontal:hover {
    border-color: #FF6B35;
    box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
}

.btn-calculate-horizontal:hover {
    border-color: #0288D1;
    box-shadow: 0 8px 25px rgba(2, 136, 209, 0.3);
}

/* 玩家行悬停 */
.player-row:hover {
    background: #f8f9fa;
}

.player-input:focus {
    border-color: #FF6B35;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
    outline: none;
}

/* 头部图片优化 */
.header-image {
    max-height: 200px;
    width: auto;
    border-radius: 10px;
}

/* 响应式优化 */
@media (max-width: 480px) {
    .player-table-header {
        flex-direction: column;
        text-align: center;
        gap: 10px;
    }
    
    .header-name, .header-checkbox {
        width: 100%;
    }
    
    .player-row {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
    }
    
    .checkbox-label {
        width: 100%;
        justify-content: center;
    }
}
CSS

echo "✅ 已添加更多样式"
echo "🔄 请刷新浏览器"
