#!/bin/bash

echo "🎯 开始完整修复..."
echo "========================================"

# 备份原文件
echo "📦 备份原文件..."
cp index.html index.html.backup.$(date +%Y%m%d_%H%M%S)

# 1. 修复参与者区域 - 只保留核心逻辑
echo "🔧 创建参与者修复脚本..."
cat > scripts/participant-fix.js << 'JS'
// 简洁版参与者同步
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 参与者同步启动...');
    
    function updateParticipants() {
        // 获取玩家数量
        const countSelect = document.getElementById('playerCount');
        const playerCount = countSelect ? parseInt(countSelect.value) : 4;
        
        console.log(`玩家数量: ${playerCount}`);
        
        // 获取容器
        let container = document.getElementById('participantCheckboxes');
        if (!container) {
            container = document.createElement('div');
            container.id = 'participantCheckboxes';
            container.className = 'checkbox-group';
            document.querySelector('.roll-section')?.appendChild(container);
        }
        
        // 清空并重新创建
        container.innerHTML = '';
        
        for (let i = 0; i < playerCount; i++) {
            const playerId = `player${i + 1}`;
            const playerInput = document.getElementById(playerId);
            const playerName = playerInput?.value || `玩家 ${i + 1}`;
            
            const item = document.createElement('div');
            item.className = 'checkbox-item';
            item.innerHTML = `
                <input type="checkbox" id="p${i + 1}" checked>
                <label for="p${i + 1}">${playerName}</label>
            `;
            container.appendChild(item);
            
            // 同步名称
            if (playerInput) {
                playerInput.addEventListener('input', function() {
                    item.querySelector('label').textContent = this.value || `玩家 ${i + 1}`;
                });
            }
        }
        
        console.log(`✅ 已创建 ${playerCount} 个参与者`);
    }
    
    // 初始更新
    updateParticipants();
    
    // 监听玩家数量变化
    const countSelect = document.getElementById('playerCount');
    if (countSelect) {
        countSelect.addEventListener('change', updateParticipants);
    }
});
JS

# 2. 创建简洁CSS修复
echo "🎨 创建CSS修复..."
cat > styles/participant-fix.css << 'CSS'
/* 参与者区域修复 */
#participantCheckboxes.checkbox-group {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
    margin: 20px 0;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 12px;
    border: 2px solid #e2e8f0;
}

.checkbox-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.checkbox-item:hover {
    border-color: #FFD89C;
    background: #fffaf0;
}

.checkbox-item input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: #FF6B35;
}

.checkbox-item label {
    font-weight: 600;
    color: #2d3748;
    cursor: pointer;
}

/* 控制按钮 */
.participant-controls {
    display: flex;
    gap: 10px;
    margin: 15px 0;
    justify-content: center;
}

.control-btn {
    padding: 10px 20px;
    border: 2px solid #FF6B35;
    border-radius: 8px;
    background: white;
    color: #FF6B35;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.control-btn:hover {
    background: #FF6B35;
    color: white;
}
CSS

# 3. 更新HTML引用
echo "📄 更新HTML引用..."

# 添加CSS引用（如果还没有）
if ! grep -q "participant-fix.css" index.html; then
    sed -i '' '/<link.*stylesheet.*main.css/a\
    <link rel="stylesheet" href="styles/participant-fix.css">' index.html
fi

# 添加JS引用（如果还没有）
if ! grep -q "participant-fix.js" index.html; then
    # 在app.js之前添加
    sed -i '' '/<script.*app.js/i\
    <script src="scripts/participant-fix.js"></script>' index.html
fi

echo ""
echo "========================================"
echo "✅ 修复完成！"
echo ""
echo "📋 已创建："
echo "   - scripts/participant-fix.js"
echo "   - styles/participant-fix.css"
echo "   - index.html 已更新引用"
echo ""
echo "🔄 请刷新浏览器查看效果"
echo ""
echo "🔧 如果还有问题，请："
echo "   1. 按F12打开控制台"
echo "   2. 查看是否有错误信息"
echo "   3. 告诉我错误内容"
