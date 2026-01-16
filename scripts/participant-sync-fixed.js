// 修复版：参与者同步脚本
console.log('参与者同步脚本开始加载...');

// 等待DOM完全加载
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM已加载，开始同步参与者...');
    
    // 使用更可靠的选择器
    function initParticipantSync() {
        console.log('初始化参与者同步...');
        
        // 方法1：尝试通过ID查找
        let participantContainer = document.getElementById('participantCheckboxes');
        
        // 方法2：如果找不到，尝试通过类名查找
        if (!participantContainer) {
            participantContainer = document.querySelector('.checkbox-group');
            console.log('通过类名找到容器:', participantContainer);
        }
        
        // 方法3：查找任何包含checkbox的容器
        if (!participantContainer) {
            const allContainers = document.querySelectorAll('[class*="checkbox"], [id*="checkbox"]');
            participantContainer = allContainers[0];
            console.log('找到可能的复选框容器:', participantContainer);
        }
        
        if (!participantContainer) {
            console.error('错误：找不到参与者复选框容器！');
            
            // 显示错误提示
            const rollSection = document.querySelector('.roll-section');
            if (rollSection) {
                const errorDiv = document.createElement('div');
                errorDiv.style.color = 'red';
                errorDiv.style.padding = '10px';
                errorDiv.style.margin = '10px 0';
                errorDiv.style.border = '1px solid red';
                errorDiv.style.borderRadius = '5px';
                errorDiv.textContent = '错误：找不到参与者复选框容器。请检查HTML结构。';
                rollSection.prepend(errorDiv);
            }
            return;
        }
        
        console.log('找到参与者容器:', participantContainer);
        
        // 获取玩家输入框
        const playerInputs = document.querySelectorAll('.player-name-input, input[name*="player"], [id*="player"]');
        console.log('找到玩家输入框:', playerInputs.length);
        
        if (playerInputs.length === 0) {
            console.error('错误：找不到玩家名输入框！');
            return;
        }
        
        // 清除容器内容
        participantContainer.innerHTML = '';
        
        // 创建新的复选框
        playerInputs.forEach((input, index) => {
            const playerId = input.id || `player${index + 1}`;
            const playerName = input.value || input.placeholder || `玩家 ${index + 1}`;
            
            const checkboxId = `participant-${playerId}`;
            
            const checkboxItem = document.createElement('div');
            checkboxItem.className = 'checkbox-item';
            checkboxItem.style.display = 'flex';
            checkboxItem.style.alignItems = 'center';
            checkboxItem.style.gap = '10px';
            checkboxItem.style.padding = '10px';
            checkboxItem.style.margin = '5px 0';
            checkboxItem.style.background = 'white';
            checkboxItem.style.border = '1px solid #ddd';
            checkboxItem.style.borderRadius = '6px';
            
            checkboxItem.innerHTML = `
                <input type="checkbox" 
                       id="${checkboxId}" 
                       checked 
                       style="width: 18px; height: 18px;">
                <label for="${checkboxId}" 
                       style="font-weight: 500; cursor: pointer;">
                    ${playerName}
                </label>
            `;
            
            participantContainer.appendChild(checkboxItem);
            
            // 实时更新玩家名
            input.addEventListener('input', function() {
                const label = checkboxItem.querySelector('label');
                const newName = this.value || this.placeholder || `玩家 ${index + 1}`;
                label.textContent = newName;
                console.log(`更新玩家 ${index + 1} 名称为: ${newName}`);
            });
        });
        
        // 添加选择控制按钮
        addSelectionControls(participantContainer);
        
        console.log('参与者同步完成！');
    }
    
    // 添加选择控制按钮
    function addSelectionControls(container) {
        const controlsDiv = document.createElement('div');
        controlsDiv.style.marginTop = '15px';
        controlsDiv.style.display = 'flex';
        controlsDiv.style.gap = '10px';
        controlsDiv.style.justifyContent = 'center';
        
        controlsDiv.innerHTML = `
            <button type="button" class="select-all-btn" 
                    style="padding: 8px 16px; background: #FF6B35; color: white; 
                           border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">
                全选
            </button>
            <button type="button" class="deselect-all-btn" 
                    style="padding: 8px 16px; background: #f0f0f0; color: #333; 
                           border: 1px solid #ccc; border-radius: 6px; font-weight: 600; cursor: pointer;">
                取消全选
            </button>
        `;
        
        container.parentNode.insertBefore(controlsDiv, container.nextSibling);
        
        // 按钮事件
        controlsDiv.querySelector('.select-all-btn').addEventListener('click', function() {
            container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                cb.checked = true;
            });
        });
        
        controlsDiv.querySelector('.deselect-all-btn').addEventListener('click', function() {
            container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                cb.checked = false;
            });
        });
    }
    
    // 延迟执行以确保所有元素都已加载
    setTimeout(initParticipantSync, 100);
});

// 如果DOMContentLoaded已经触发，直接执行
if (document.readyState === 'loading') {
    console.log('文档还在加载中...');
} else {
    console.log('文档已加载完成，立即执行');
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(initParticipantSync, 100);
    });
}
