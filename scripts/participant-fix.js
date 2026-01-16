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
