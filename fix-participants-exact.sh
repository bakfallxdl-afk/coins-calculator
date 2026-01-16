#!/bin/bash

echo "🎯 精准修复参与者区域..."

# 备份
cp index.html index.html.before-fix

# 查找并替换参与者区域
# 先找到参与者区域的开始和结束
START_LINE=$(grep -n "Participants / 参与者:" index.html | head -1 | cut -d: -f1)
if [ -z "$START_LINE" ]; then
    echo "❌ 找不到参与者区域"
    exit 1
fi

echo "找到参与者区域在第 $START_LINE 行"

# 查找接下来的20行，找到合适的结束位置
END_LINE=$((START_LINE + 20))
echo "检查 $START_LINE 到 $END_LINE 行..."

# 创建新的参与者区域
NEW_CONTENT='            <label>
                <span class="en">Participants / 参与者:</span>
            </label>
            <div id="participantCheckboxes" class="checkbox-group">
                <!-- 动态生成参与者列表 -->
            </div>
            <div class="participant-controls">
                <button type="button" class="control-btn select-all">全选</button>
                <button type="button" class="control-btn deselect-all">取消全选</button>
            </div>'

# 使用sed替换
sed -i '' "${START_LINE},${END_LINE}s/.*Participants \/ 参与者:.*/${NEW_CONTENT}/" index.html

echo "✅ 参与者区域已替换"

# 添加必要的CSS
cat >> styles/main.css << 'CSS'

/* ========== 修复参与者区域 ========== */
#participantCheckboxes.checkbox-group {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin: 15px 0;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 10px;
    border: 2px solid #e2e8f0;
}

@media (min-width: 768px) {
    #participantCheckboxes.checkbox-group {
        grid-template-columns: repeat(4, 1fr);
    }
}

.checkbox-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
}

.checkbox-item input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: #FF6B35;
}

.checkbox-item label {
    font-weight: 600;
    color: #2d3748;
}

.participant-controls {
    display: flex;
    gap: 10px;
    margin-top: 15px;
    justify-content: center;
}

.control-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
}

.control-btn.select-all {
    background: #FF6B35;
    color: white;
}

.control-btn.deselect-all {
    background: #e2e8f0;
    color: #2d3748;
}
CSS

# 添加JavaScript
cat > scripts/simple-sync.js << 'JS'
// 简单参与者同步
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 开始同步参与者...');
    
    function syncParticipants() {
        // 获取玩家数量
        const playerCountSelect = document.getElementById('playerCount');
        const playerCount = playerCountSelect ? parseInt(playerCountSelect.value) : 4;
        
        console.log(`玩家数量: ${playerCount}`);
        
        // 获取容器
        const container = document.getElementById('participantCheckboxes');
        if (!container) {
            console.error('找不到参与者容器');
            return;
        }
        
        // 清空容器
        container.innerHTML = '';
        
        // 创建参与者项目
        for (let i = 1; i <= playerCount; i++) {
            const playerId = `player${i}`;
            const playerInput = document.getElementById(playerId);
            const playerName = playerInput ? (playerInput.value || `玩家 ${i}`) : `玩家 ${i}`;
            
            const item = document.createElement('div');
            item.className = 'checkbox-item';
            item.innerHTML = `
                <input type="checkbox" id="participant-${playerId}" checked>
                <label for="participant-${playerId}">${playerName}</label>
            `;
            
            container.appendChild(item);
            
            // 同步名称
            if (playerInput) {
                playerInput.addEventListener('input', function() {
                    const label = item.querySelector('label');
                    label.textContent = this.value || `玩家 ${i}`;
                });
            }
        }
    }
    
    // 初始同步
    syncParticipants();
    
    // 监听玩家数量变化
    const playerCountSelect = document.getElementById('playerCount');
    if (playerCountSelect) {
        playerCountSelect.addEventListener('change', syncParticipants);
    }
    
    // 控制按钮
    document.querySelector('.select-all')?.addEventListener('click', function() {
        document.querySelectorAll('#participantCheckboxes input[type="checkbox"]').forEach(cb => {
            cb.checked = true;
        });
    });
    
    document.querySelector('.deselect-all')?.addEventListener('click', function() {
        document.querySelectorAll('#participantCheckboxes input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
    });
});
JS

# 添加JS引用
if ! grep -q "simple-sync.js" index.html; then
    sed -i '' '/<script.*app.js/i\
    <script src="scripts/simple-sync.js"></script>' index.html
fi

echo ""
echo "✅ 修复完成！"
echo "🔄 请刷新浏览器"
