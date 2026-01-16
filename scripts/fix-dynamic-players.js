// ========== 动态玩家同步修复 ==========
console.log('🔄 动态玩家同步系统启动...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM加载完成，开始初始化...');
    
    // 等待动态内容生成
    setTimeout(initDynamicSystem, 1000);
});

function initDynamicSystem() {
    console.log('初始化动态玩家系统...');
    
    // 1. 获取玩家数量
    const playerCount = getPlayerCount();
    console.log(`当前玩家数量: ${playerCount}`);
    
    // 2. 填充参与者
    fillParticipants(playerCount);
    
    // 3. 监听玩家数量变化
    setupPlayerCountListener();
    
    // 4. 监听玩家名变化
    setupPlayerNameObserver();
    
    console.log('✅ 动态玩家系统初始化完成');
}

// 获取玩家数量
function getPlayerCount() {
    const select = document.getElementById('playerCount');
    if (select) {
        return parseInt(select.value) || 4;
    }
    return 4;
}

// 获取玩家输入框
function getPlayerInputs() {
    // 从playerNameInputs容器中查找
    const container = document.getElementById('playerNameInputs');
    if (!container) {
        console.error('找不到玩家名容器 #playerNameInputs');
        return [];
    }
    
    // 查找所有玩家输入框
    return container.querySelectorAll(`
        input[type="text"],
        .player-name-input,
        [id^="player"][type="text"]
    `);
}

// 填充参与者复选框
function fillParticipants(playerCount) {
    const container = document.getElementById('participantCheckboxes');
    if (!container) {
        console.error('找不到参与者容器 #participantCheckboxes');
        return;
    }
    
    // 清空容器
    container.innerHTML = '';
    
    // 获取玩家输入框
    const playerInputs = getPlayerInputs();
    console.log(`找到 ${playerInputs.length} 个玩家输入框`);
    
    // 创建参与者项目
    for (let i = 0; i < playerCount; i++) {
        createParticipantItem(container, i + 1, playerInputs[i]);
    }
    
    // 添加控制按钮
    addControlButtons();
}

// 创建参与者项目
function createParticipantItem(container, playerNumber, playerInput) {
    const item = document.createElement('div');
    item.className = 'checkbox-item';
    item.dataset.playerNumber = playerNumber;
    
    // 获取玩家名
    let playerName = `玩家 ${playerNumber}`;
    if (playerInput && playerInput.value) {
        playerName = playerInput.value;
    }
    
    item.innerHTML = `
        <input type="checkbox" 
               id="participant-player${playerNumber}" 
               class="participant-checkbox"
               checked>
        <label for="participant-player${playerNumber}" class="participant-label">
            ${playerName}
        </label>
    `;
    
    // 样式
    item.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px;
        margin: 10px 0;
        background: white;
        border: 3px solid #e2e8f0;
        border-radius: 10px;
        transition: all 0.3s ease;
        cursor: pointer;
    `;
    
    container.appendChild(item);
    
    // 点击事件
    item.addEventListener('click', function(e) {
        if (e.target.type !== 'checkbox') {
            const checkbox = this.querySelector('.participant-checkbox');
            checkbox.checked = !checkbox.checked;
            updateItemStyle(this, checkbox.checked);
        }
    });
    
    const checkbox = item.querySelector('.participant-checkbox');
    checkbox.addEventListener('change', function() {
        updateItemStyle(item, this.checked);
    });
    
    updateItemStyle(item, checkbox.checked);
    
    // 如果有玩家输入框，设置名称同步
    if (playerInput) {
        setupNameSync(item, playerInput, playerNumber);
    }
}

// 设置名称同步
function setupNameSync(item, playerInput, playerNumber) {
    const label = item.querySelector('.participant-label');
    
    // 初始同步
    if (playerInput.value) {
        label.textContent = playerInput.value;
    }
    
    // 监听输入变化
    playerInput.addEventListener('input', function() {
        label.textContent = this.value || `玩家 ${playerNumber}`;
    });
}

// 更新项目样式
function updateItemStyle(item, isChecked) {
    if (isChecked) {
        item.style.borderColor = '#FF6B35';
        item.style.background = '#fff5f5';
        item.style.boxShadow = '0 6px 15px rgba(255, 107, 53, 0.2)';
    } else {
        item.style.borderColor = '#e2e8f0';
        item.style.background = 'white';
        item.style.boxShadow = 'none';
    }
}

// 监听玩家数量变化
function setupPlayerCountListener() {
    const select = document.getElementById('playerCount');
    if (!select) return;
    
    select.addEventListener('change', function() {
        const newCount = parseInt(this.value) || 4;
        console.log(`玩家数量变更: ${newCount}`);
        
        // 等待动态生成玩家输入框
        setTimeout(() => {
            fillParticipants(newCount);
        }, 300);
    });
}

// 监听玩家名变化（观察DOM变化）
function setupPlayerNameObserver() {
    const container = document.getElementById('playerNameInputs');
    if (!container) return;
    
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' || mutation.type === 'characterData') {
                console.log('玩家名容器发生变化，重新同步...');
                setTimeout(() => {
                    const playerCount = getPlayerCount();
                    fillParticipants(playerCount);
                }, 200);
            }
        });
    });
    
    observer.observe(container, {
        childList: true,
        subtree: true,
        characterData: true
    });
}

// 添加控制按钮
function addControlButtons() {
    if (document.querySelector('.participant-controls')) return;
    
    const container = document.getElementById('participantCheckboxes');
    if (!container || !container.parentNode) return;
    
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'participant-controls';
    controlsDiv.style.cssText = `
        display: flex;
        gap: 15px;
        margin: 25px 0;
        justify-content: center;
    `;
    
    controlsDiv.innerHTML = `
        <button type="button" class="control-btn select-all" 
                style="padding: 12px 24px; background: #FF6B35; color: white; 
                       border: none; border-radius: 10px; font-weight: 600; cursor: pointer;
                       transition: all 0.3s ease;">
            ✓ 全选所有玩家
        </button>
        <button type="button" class="control-btn deselect-all" 
                style="padding: 12px 24px; background: white; color: #FF6B35; 
                       border: 3px solid #FF6B35; border-radius: 10px; font-weight: 600; cursor: pointer;
                       transition: all 0.3s ease;">
            ✗ 取消全选
        </button>
    `;
    
    container.parentNode.insertBefore(controlsDiv, container.nextSibling);
    
    // 按钮事件
    controlsDiv.querySelector('.select-all').addEventListener('click', function() {
        document.querySelectorAll('.participant-checkbox').forEach(cb => {
            cb.checked = true;
            const item = cb.closest('.checkbox-item');
            if (item) updateItemStyle(item, true);
        });
        this.style.transform = 'translateY(-3px)';
        setTimeout(() => { this.style.transform = 'none'; }, 200);
    });
    
    controlsDiv.querySelector('.deselect-all').addEventListener('click', function() {
        document.querySelectorAll('.participant-checkbox').forEach(cb => {
            cb.checked = false;
            const item = cb.closest('.checkbox-item');
            if (item) updateItemStyle(item, false);
        });
        this.style.transform = 'translateY(-3px)';
        setTimeout(() => { this.style.transform = 'none'; }, 200);
    });
}

// 调试函数
window.refreshParticipants = function() {
    const playerCount = getPlayerCount();
    fillParticipants(playerCount);
    console.log('🔄 手动刷新参与者列表');
};

console.log('✅ 动态玩家同步脚本加载完成');
console.log('💡 在控制台输入 refreshParticipants() 手动刷新');
