// ========== 完整修复脚本 ==========
// 包含：参与者同步、按钮修复、玩家名同步

console.log('🚀 完整修复脚本加载中...');

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM已加载，开始执行修复...');
    
    // 延迟执行确保所有元素都已渲染
    setTimeout(executeAllFixes, 300);
});

function executeAllFixes() {
    console.log('🔧 执行所有修复...');
    
    // 1. 修复参与者区域
    fixParticipantArea();
    
    // 2. 修复Roll点按钮
    fixRollButton();
    
    // 3. 同步玩家名到各个地方
    syncPlayerNames();
    
    // 4. 修复头部图片倾斜
    fixHeaderImage();
    
    console.log('🎉 所有修复完成！');
}

// ========== 1. 修复参与者区域 ==========
function fixParticipantArea() {
    console.log('修复参与者区域...');
    
    const participantContainer = document.getElementById('participantCheckboxes');
    if (!participantContainer) {
        console.error('❌ 找不到参与者容器 #participantCheckboxes');
        createParticipantContainer();
        return;
    }
    
    // 获取玩家名输入框
    const playerInputs = getPlayerInputs();
    if (playerInputs.length === 0) {
        console.error('❌ 找不到玩家名输入框');
        return;
    }
    
    // 清空并重建参与者区域
    participantContainer.innerHTML = '';
    participantContainer.className = 'checkbox-group'; // 确保有正确的类名
    
    // 为每个玩家创建参与者项目
    playerInputs.forEach((input, index) => {
        createParticipantItem(participantContainer, input, index);
    });
    
    // 添加控制按钮
    addControlButtons(participantContainer);
    
    console.log(`✅ 已创建 ${playerInputs.length} 个参与者项目`);
}

function getPlayerInputs() {
    // 多种方式查找玩家名输入框
    return document.querySelectorAll(`
        .player-name-input,
        input[id*="player"][type="text"],
        input[name*="player"][type="text"],
        [id^="player"][type="text"]:not([type="checkbox"]):not([type="radio"])
    `);
}

function createParticipantItem(container, playerInput, index) {
    const playerId = playerInput.id || `player${index + 1}`;
    const playerName = playerInput.value || playerInput.placeholder || `玩家 ${index + 1}`;
    
    const item = document.createElement('div');
    item.className = 'participant-item';
    item.dataset.playerId = playerId;
    item.dataset.index = index;
    
    item.innerHTML = `
        <input type="checkbox" 
               class="participant-checkbox" 
               id="participant-${playerId}"
               checked>
        <label class="participant-name" for="participant-${playerId}">
            ${playerName}
        </label>
    `;
    
    container.appendChild(item);
    
    // 实时同步玩家名
    playerInput.addEventListener('input', function() {
        const label = item.querySelector('.participant-name');
        const newName = this.value || this.placeholder || `玩家 ${index + 1}`;
        label.textContent = newName;
        console.log(`🔄 更新玩家 ${index + 1}: ${newName}`);
    });
    
    // 点击整行都可以选择/取消
    item.addEventListener('click', function(e) {
        if (e.target.type !== 'checkbox') {
            const checkbox = this.querySelector('.participant-checkbox');
            checkbox.checked = !checkbox.checked;
            this.classList.toggle('selected', checkbox.checked);
        }
    });
    
    // 复选框变化时更新选中状态
    const checkbox = item.querySelector('.participant-checkbox');
    checkbox.addEventListener('change', function() {
        item.classList.toggle('selected', this.checked);
    });
    
    // 初始选中状态
    item.classList.toggle('selected', checkbox.checked);
}

function addControlButtons(container) {
    // 检查是否已经有控制按钮
    if (document.querySelector('.participant-controls')) return;
    
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'participant-controls';
    
    controlsDiv.innerHTML = `
        <button type="button" class="control-btn select-all">
            ✓ 全选
        </button>
        <button type="button" class="control-btn deselect-all">
            ✗ 取消全选
        </button>
    `;
    
    container.parentNode.insertBefore(controlsDiv, container.nextSibling);
    
    // 按钮事件
    controlsDiv.querySelector('.select-all').addEventListener('click', function() {
        document.querySelectorAll('.participant-checkbox').forEach(cb => {
            cb.checked = true;
            cb.closest('.participant-item')?.classList.add('selected');
        });
        console.log('✅ 已全选所有参与者');
    });
    
    controlsDiv.querySelector('.deselect-all').addEventListener('click', function() {
        document.querySelectorAll('.participant-checkbox').forEach(cb => {
            cb.checked = false;
            cb.closest('.participant-item')?.classList.remove('selected');
        });
        console.log('✅ 已取消全选所有参与者');
    });
}

function createParticipantContainer() {
    // 如果容器不存在，创建一个
    const rollSection = document.querySelector('.roll-section');
    if (!rollSection) return;
    
    const container = document.createElement('div');
    container.id = 'participantCheckboxes';
    container.className = 'checkbox-group';
    container.style.padding = '20px';
    container.style.background = '#f8f9fa';
    container.style.borderRadius = '10px';
    container.style.margin = '20px 0';
    container.innerHTML = '<p style="color:#666; text-align:center;">参与者列表将在这里显示</p>';
    
    rollSection.appendChild(container);
    console.log('✅ 已创建参与者容器');
}

// ========== 2. 修复Roll点按钮 ==========
function fixRollButton() {
    console.log('修复Roll点按钮...');
    
    const rollButton = document.getElementById('startRoll');
    if (!rollButton) {
        console.error('❌ 找不到Roll点按钮 #startRoll');
        return;
    }
    
    // 确保按钮有正确的类名
    rollButton.classList.add('btn-image-roll');
    
    // 确保图片正确显示
    const rollImage = rollButton.querySelector('img');
    if (rollImage) {
        rollImage.classList.add('roll-btn-img');
        rollImage.style.objectFit = 'contain'; // 确保完整显示
    }
    
    console.log('✅ Roll点按钮已修复');
}

// ========== 3. 同步玩家名 ==========
function syncPlayerNames() {
    console.log('同步玩家名...');
    
    // 监听所有玩家名输入框的变化
    document.querySelectorAll('.player-name-input').forEach(input => {
        input.addEventListener('input', function() {
            // 这里可以添加其他需要同步的地方
            console.log(`玩家名变化: ${this.value}`);
        });
    });
    
    console.log('✅ 玩家名同步已设置');
}

// ========== 4. 修复头部图片倾斜 ==========
function fixHeaderImage() {
    console.log('修复头部图片倾斜...');
    
    const headerImage = document.querySelector('.header-image');
    if (headerImage) {
        headerImage.style.transform = 'rotate(0deg)';
        console.log('✅ 头部图片倾斜已修复');
    }
}

// ========== 错误处理 ==========
window.addEventListener('error', function(e) {
    console.error('脚本错误:', e.message, 'at', e.filename, e.lineno);
});

// 导出函数供调试使用
window.FixManager = {
    reload: executeAllFixes,
    getPlayerInputs: getPlayerInputs,
    fixParticipants: fixParticipantArea
};

console.log('📦 修复脚本加载完成，等待执行...');
