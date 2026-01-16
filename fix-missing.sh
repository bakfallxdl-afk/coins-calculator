#!/bin/bash

echo "🔧 补全缺失的样式和脚本..."

cd "/Users/xiedonglei/Desktop/boss/coins-calculator-pwa"

# 1. 添加CSS样式（如果缺失）
if ! grep -q "player-table-header" styles/main.css; then
    echo "添加CSS样式..."
    cat >> styles/main.css << 'CSS'
/* ========== 新玩家表格布局 ========== */
.player-name-inputs {
    margin: 20px 0;
    background: white;
    border-radius: 12px;
    border: 2px solid #e2e8f0;
    overflow: hidden;
}

.player-table-header {
    display: flex;
    align-items: center;
    padding: 18px 20px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-bottom: 3px solid #FFD89C;
    font-weight: 700;
    color: #2d3748;
}

.header-name {
    flex: 1;
    font-size: 1.1rem;
}

.header-checkbox {
    width: 120px;
    text-align: center;
    font-size: 1.1rem;
}

.player-row {
    display: flex;
    align-items: center;
    padding: 18px 20px;
    border-bottom: 1px solid #e2e8f0;
    transition: all 0.2s ease;
}

.player-row:hover {
    background: #f8f9fa;
}

.player-row:last-child {
    border-bottom: none;
}

.player-input {
    flex: 1;
    padding: 14px 18px;
    border: 2px solid #e2e8f0;
    border-radius: 10px;
    font-size: 1.1rem;
    font-weight: 600;
    color: #2d3748;
    transition: all 0.3s ease;
    min-width: 0;
}

.player-input:focus {
    border-color: #FF6B35;
    box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
    outline: none;
}

.checkbox-label {
    width: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.player-checkbox {
    width: 22px;
    height: 22px;
    accent-color: #FF6B35;
    cursor: pointer;
    margin: 0;
}

.checkmark {
    display: inline-block;
    width: 22px;
    height: 22px;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 6px;
    position: relative;
    transition: all 0.2s ease;
}

.player-checkbox:checked + .checkmark {
    background: #FF6B35;
    border-color: #FF6B35;
}

.player-checkbox:checked + .checkmark::after {
    content: "✓";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 14px;
    font-weight: bold;
}

/* ========== 双按钮横向布局 ========== */
.dual-buttons-horizontal {
    display: flex;
    gap: 40px;
    justify-content: center;
    align-items: center;
    margin: 40px 0;
    padding: 20px;
}

.btn-roll-horizontal,
.btn-calculate-horizontal {
    display: block;
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.4s ease;
    border-radius: 18px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    width: 340px;
}

.btn-roll-horizontal:hover,
.btn-calculate-horizontal:hover {
    transform: translateY(-8px) scale(1.05);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
}

.btn-img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 16px;
    aspect-ratio: 1551 / 1197;
    object-fit: contain;
}

.btn-roll-horizontal {
    border: 4px solid #FFD89C;
}

.btn-roll-horizontal:hover {
    border-color: #FF6B35;
}

.btn-calculate-horizontal {
    border: 4px solid #B3E5FC;
}

.btn-calculate-horizontal:hover {
    border-color: #0288D1;
}

/* 响应式设计 */
@media (max-width: 1024px) {
    .btn-roll-horizontal,
    .btn-calculate-horizontal {
        width: 300px;
    }
    .dual-buttons-horizontal {
        gap: 30px;
    }
}

@media (max-width: 768px) {
    .player-table-header {
        padding: 15px;
        font-size: 0.95rem;
    }
    .player-row {
        padding: 15px;
        flex-direction: column;
        gap: 15px;
    }
    .checkbox-label,
    .header-checkbox {
        width: 100%;
        text-align: left;
    }
    .btn-roll-horizontal,
    .btn-calculate-horizontal {
        width: 260px;
    }
    .dual-buttons-horizontal {
        gap: 20px;
    }
}

@media (max-width: 480px) {
    .btn-roll-horizontal,
    .btn-calculate-horizontal {
        width: 220px;
    }
    .dual-buttons-horizontal {
        gap: 15px;
    }
}

@media (max-width: 360px) {
    .btn-roll-horizontal,
    .btn-calculate-horizontal {
        width: 180px;
    }
    .dual-buttons-horizontal {
        gap: 10px;
    }
}

/* 隐藏旧的参与者区域 */
#participantCheckboxes {
    display: none !important;
}
CSS
    echo "✅ CSS已添加"
else
    echo "✅ CSS已存在"
fi

# 2. 创建JS文件（如果缺失）
if [ ! -f "scripts/new-layout-simple.js" ]; then
    echo "创建JS文件..."
    mkdir -p scripts
    cat > scripts/new-layout-simple.js << 'JS'
// 新布局基础功能
document.addEventListener('DOMContentLoaded', function() {
    console.log('新布局功能加载');
    
    // Roll点按钮
    document.getElementById('startRoll')?.addEventListener('click', function() {
        const checked = document.querySelectorAll('.player-checkbox:checked').length;
        if (checked === 0) {
            alert('请至少选择一名参与者！');
            return;
        }
        alert('开始Roll点！');
        this.style.transform = 'scale(0.95)';
        setTimeout(() => this.style.transform = '', 200);
    });
    
    // 计算按钮
    document.getElementById('startCalculate')?.addEventListener('click', function() {
        const totalCoins = document.getElementById('totalCoins')?.value;
        if (!totalCoins || totalCoins <= 0) {
            alert('请输入总硬币数！');
            return;
        }
        alert('开始计算分配！');
        this.style.transform = 'scale(0.95)';
        setTimeout(() => this.style.transform = '', 200);
    });
    
    // 玩家数量变化
    document.getElementById('playerCount')?.addEventListener('change', function() {
        alert('玩家数量变化功能需要集成原有逻辑');
    });
});
JS
    echo "✅ JS文件已创建"
else
    echo "✅ JS文件已存在"
fi

# 3. 添加JS引用（如果缺失）
if ! grep -q "new-layout-simple.js" index.html; then
    echo "添加JS引用..."
    sed -i '' '/<script.*app.js/i\
    <script src="scripts/new-layout-simple.js"></script>' index.html
    echo "✅ JS引用已添加"
else
    echo "✅ JS引用已存在"
fi

# 4. 添加头部橙色渐变修复
if ! grep -q "头部橙色渐变" styles/main.css; then
    echo "添加头部样式修复..."
    cat >> styles/main.css << 'CSS2'
/* 头部橙色渐变修复 */
.app-header {
    background: linear-gradient(135deg, #FFB347 0%, #FF8C42 25%, #FFD89C 50%, #FFF5E1 75%, #FFA726 100%) !important;
    border: 4px solid #FFD89C !important;
}
CSS2
    echo "✅ 头部样式已修复"
fi

echo ""
echo "🎉 补全完成！"
echo "🔄 请刷新浏览器查看效果"
