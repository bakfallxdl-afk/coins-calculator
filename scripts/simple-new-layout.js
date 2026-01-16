// 简单的新布局功能
document.addEventListener('DOMContentLoaded', function() {
    console.log('新布局初始化...');
    
    // Roll点按钮
    document.getElementById('startRoll')?.addEventListener('click', function() {
        const participants = [];
        document.querySelectorAll('.participant-checkbox:checked').forEach(cb => {
            const playerId = cb.dataset.playerId;
            const input = document.getElementById(playerId);
            if (input) {
                participants.push(input.value || `玩家${playerId.slice(-1)}`);
            }
        });
        
        if (participants.length === 0) {
            alert('请至少选择一名参与者！');
            return;
        }
        
        alert(`开始Roll点！\n参与者: ${participants.join(', ')}`);
        
        // 动画
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
        
        alert(`开始计算 ${totalCoins} 硬币的分配！`);
        
        // 动画
        this.style.transform = 'scale(0.95)';
        setTimeout(() => this.style.transform = '', 200);
    });
    
    // 玩家数量变化
    document.getElementById('playerCount')?.addEventListener('change', function() {
        const count = parseInt(this.value) || 4;
        updatePlayerRows(count);
    });
    
    function updatePlayerRows(count) {
        const container = document.getElementById('playerNameInputs');
        if (!container) return;
        
        let html = '';
        for (let i = 1; i <= count; i++) {
            html += `
                <div class="player-input-row">
                    <input type="text" class="player-name-input" id="player${i}" value="玩家${i}" placeholder="输入玩家名">
                    <label class="participant-checkbox-label">
                        <input type="checkbox" class="participant-checkbox" data-player-id="player${i}" checked>
                        <span class="checkmark"></span>
                        <span class="checkbox-text">参与Roll点</span>
                    </label>
                </div>
            `;
        }
        container.innerHTML = html;
    }
});
