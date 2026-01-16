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
