// PinkBean Timer - 主要功能实现 (基于HorntailTimer设计)

// 计时器配置 - 按照HorntailTimer的模式
const TIMER_CONFIG = [
    // 主要计时器 - 大尺寸
    { id: 'zombie', label: 'Zombie', duration: 120, type: 'large', color: '#ff66cc' },
    { id: 'dr', label: 'DR', duration: 60, type: 'large', color: '#ff66cc' },
    
    // RESS 计时器组 - 粉色系
    { id: 'ress1', label: 'RESS #1', duration: 1800, type: 'ress', color: '#ff66cc' },
    { id: 'ress2', label: 'RESS #2', duration: 1800, type: 'ress', color: '#ff66cc' },
    { id: 'ress3', label: 'RESS #3', duration: 1800, type: 'ress', color: '#ff66cc' },
    { id: 'ress4', label: 'RESS #4', duration: 1800, type: 'ress', color: '#ff66cc' },
    { id: 'ress5', label: 'RESS #5', duration: 1800, type: 'ress', color: '#ff66cc' },
    
    // TL 计时器组 - 紫色系
    { id: 'tl1', label: 'TL #1', duration: 1200, type: 'tl', color: '#cc66ff' },
    { id: 'tl2', label: 'TL #2', duration: 1200, type: 'tl', color: '#cc66ff' },
    { id: 'tl3', label: 'TL #3', duration: 1200, type: 'tl', color: '#cc66ff' },
    { id: 'tl4', label: 'TL #4', duration: 1200, type: 'tl', color: '#cc66ff' }
];

// 全局状态
let currentRoomCode = '';
let timers = {};
let isInRoom = false;
let roomInterval = null;

// 双击检测
let lastClickTime = 0;
const DOUBLE_CLICK_DELAY = 300; // 300ms内为双击

// DOM元素
const roomSetup = document.getElementById('roomSetup');
const timerPage = document.getElementById('timerPage');
const roomCodeInput = document.getElementById('roomCodeInput');
const joinRoomBtn = document.getElementById('joinRoomBtn');
const createRoomBtn = document.getElementById('createRoomBtn');
const quickStartBtn = document.getElementById('quickStartBtn');
const currentRoomCodeEl = document.getElementById('currentRoomCode');
const footerRoomCodeEl = document.getElementById('footerRoomCode');
const roomStatusEl = document.getElementById('roomStatus');
const timerGrid = document.getElementById('timerGrid');
const showInstructionsBtn = document.getElementById('showInstructionsBtn');
const leaveRoomBtn = document.getElementById('leaveRoomBtn');
const instructionsModal = document.getElementById('instructionsModal');
const closeInstructionsBtn = document.getElementById('closeInstructionsBtn');

// 初始化函数
function init() {
    setupEventListeners();
    // 不再自动加载上次房间
    generateTimerElements();
    updateUI();
}

// 设置事件监听器
function setupEventListeners() {
    // 房间设置按钮
    joinRoomBtn.addEventListener('click', joinRoom);
    createRoomBtn.addEventListener('click', generateAndFillRoomCode); // 改为生成代码填充
    quickStartBtn.addEventListener('click', quickStart);
    
    // 房间代码输入框回车键支持
    roomCodeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            joinRoom();
        }
    });
    
    // 计时器页面按钮
    showInstructionsBtn.addEventListener('click', showInstructions);
    leaveRoomBtn.addEventListener('click', leaveRoom);
    closeInstructionsBtn.addEventListener('click', hideInstructions);
    
    // 点击弹窗外部关闭
    instructionsModal.addEventListener('click', function(e) {
        if (e.target === instructionsModal) {
            hideInstructions();
        }
    });
}

// 生成并填充房间代码到输入框
function generateAndFillRoomCode() {
    const roomCode = generateRoomCode();
    roomCodeInput.value = roomCode;
    roomCodeInput.focus();
    roomCodeInput.select();
    showNotification('房间代码已生成，点击"加入房间"或按Enter键', 'info');
}

// 生成计时器元素 - 恢复简单网格
function generateTimerElements() {
    timerGrid.innerHTML = '';
    
    TIMER_CONFIG.forEach((config, index) => {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        gridItem.id = `timer-${config.id}`;
        
        // 添加类型class
        let circleClass = config.type;
        if (index < 2) { // Zombie和DR
            circleClass += ' large';
        }
        
        gridItem.innerHTML = `
            <div class="timer-circle ${circleClass}" data-timer-id="${config.id}">
                <div class="ripple"></div>
                <svg class="circle-svg" viewBox="0 0 100 100">
                    <circle class="circle-bg" cx="50" cy="50" r="45"></circle>
                    <circle class="circle-progress" cx="50" cy="50" r="45"></circle>
                </svg>
                <div class="circle-content">
                    <div class="circle-time" id="time-${config.id}">${formatTime(config.duration)}</div>
                    <div class="circle-label">${config.label}</div>
                </div>
            </div>
        `;
        
        timerGrid.appendChild(gridItem);
        
        // 添加点击事件 - 支持单击开始/暂停，双击重置
        const timerCircle = gridItem.querySelector('.timer-circle');
        timerCircle.addEventListener('click', handleTimerClick(config.id));
    });
}

// 加入房间
function joinRoom() {
    const roomCode = roomCodeInput.value.trim().toUpperCase();
    
    if (!roomCode) {
        showNotification('请输入房间代码', 'error');
        roomCodeInput.focus();
        return;
    }
    
    if (roomCode.length !== 6) {
        showNotification('房间代码必须是6位', 'error');
        return;
    }
    
    currentRoomCode = roomCode;
    isInRoom = true;
    
    // 从本地存储加载计时器状态
    loadRoomState(roomCode);
    
    // 显示通知
    showNotification(`已加入房间: ${roomCode}`, 'success');
    
    // 切换到计时器页面
    switchToTimerPage();
    
    // 更新房间状态
    updateRoomStatus();
}

// 快速开始（单人模式）
function quickStart() {
    const roomCode = generateRoomCode();
    currentRoomCode = roomCode;
    isInRoom = true;
    
    // 初始化计时器状态
    initTimers();
    
    // 保存到本地存储
    saveToLocalStorage();
    
    // 显示通知
    showNotification(`快速开始: ${roomCode}`, 'info');
    
    // 切换到计时器页面
    switchToTimerPage();
    
    // 更新房间状态
    updateRoomStatus();
}

// 初始化计时器状态
function initTimers() {
    timers = {};
    TIMER_CONFIG.forEach(config => {
        timers[config.id] = {
            id: config.id,
            label: config.label,
            duration: config.duration,
            remaining: config.duration,
            isRunning: false,
            startTime: null,
            interval: null,
            type: config.type
        };
    });
}

// 处理计时器点击事件 - 单击开始/暂停，双击重置
function handleTimerClick(timerId) {
    return function(event) {
        const currentTime = Date.now();
        const timeDiff = currentTime - lastClickTime;
        
        if (timeDiff < DOUBLE_CLICK_DELAY && timeDiff > 0) {
            // 双击 - 重置计时器
            resetTimer(timerId);
        } else {
            // 单击 - 开始/暂停
            toggleTimer(timerId);
        }
        
        lastClickTime = currentTime;
    };
}

// 切换计时器状态 - 单击：开始/暂停
function toggleTimer(timerId) {
    if (!timers[timerId]) return;
    
    const timer = timers[timerId];
    const timerElement = document.getElementById(`timer-${timerId}`);
    const timeElement = document.getElementById(`time-${timerId}`);
    const progressElement = timerElement.querySelector('.circle-progress');
    
    if (timer.isRunning) {
        // 暂停计时器
        clearInterval(timer.interval);
        timer.isRunning = false;
        
        // 更新UI
        timeElement.classList.remove('complete');
        progressElement.classList.remove('complete');
        
        // 移除活动状态
        timerElement.querySelector('.timer-circle').classList.remove('active');
        
        showNotification(`${timer.label} 已暂停`, 'info');
    } else {
        // 开始计时器
        timer.isRunning = true;
        timer.startTime = Date.now() - ((timer.duration - timer.remaining) * 1000);
        
        // 添加活动状态
        timerElement.querySelector('.timer-circle').classList.add('active');
        
        // 开始倒计时
        timer.interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - timer.startTime) / 1000);
            timer.remaining = Math.max(0, timer.duration - elapsed);
            
            // 更新显示时间
            timeElement.textContent = formatTime(timer.remaining);
            
            // 更新进度圆环
            const progress = (timer.remaining / timer.duration) * 100;
            updateProgressCircle(progressElement, progress);
            
            // 检查是否完成
            if (timer.remaining <= 0) {
                timerComplete(timerId);
            }
        }, 100);
        
        showNotification(`${timer.label} 已开始`, 'success');
    }
    
    // 保存状态
    saveToLocalStorage();
}

// 重置计时器 - 双击：重置
function resetTimer(timerId) {
    if (!timers[timerId]) return;
    
    const timer = timers[timerId];
    const timerElement = document.getElementById(`timer-${timerId}`);
    const timeElement = document.getElementById(`time-${timerId}`);
    const progressElement = timerElement.querySelector('.circle-progress');
    
    // 停止计时器
    if (timer.isRunning) {
        clearInterval(timer.interval);
        timer.isRunning = false;
    }
    
    // 重置状态
    timer.startTime = null;
    timer.remaining = timer.duration;
    
    // 更新UI
    timeElement.textContent = formatTime(timer.duration);
    timeElement.classList.remove('complete');
    progressElement.classList.remove('complete');
    updateProgressCircle(progressElement, 100);
    
    // 移除活动状态
    timerElement.querySelector('.timer-circle').classList.remove('active');
    
    showNotification(`${timer.label} 已重置`, 'info');
    
    // 保存状态
    saveToLocalStorage();
}

// 计时器完成
function timerComplete(timerId) {
    const timer = timers[timerId];
    const timerElement = document.getElementById(`timer-${timerId}`);
    const timeElement = document.getElementById(`time-${timerId}`);
    const progressElement = timerElement.querySelector('.circle-progress');
    
    // 停止计时器
    clearInterval(timer.interval);
    timer.isRunning = false;
    
    // 更新UI
    timeElement.textContent = '完成!';
    timeElement.classList.add('complete');
    progressElement.classList.add('complete');
    updateProgressCircle(progressElement, 0);
    
    // 添加完成动画
    timerElement.querySelector('.timer-circle').classList.add('completed');
    setTimeout(() => {
        timerElement.querySelector('.timer-circle').classList.remove('completed');
    }, 500);
    
    // 显示通知（只对重要计时器）
    if (timerId === 'zombie' || timerId === 'dr') {
        showNotification(`${timer.label} 冷却完成!`, 'success');
    }
    
    // 保存状态
    saveToLocalStorage();
}

// 更新进度圆环
function updateProgressCircle(element, percent) {
    const circumference = 282.6; // 2 * π * 45
    const offset = circumference - (percent / 100) * circumference;
    element.style.strokeDashoffset = offset;
}

// 格式化时间显示
function formatTime(seconds) {
    if (seconds >= 3600) {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        return `${hours}:${mins.toString().padStart(2, '0')}`;
    } else if (seconds >= 60) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    } else {
        return seconds.toString().padStart(2, '0');
    }
}

// 生成房间代码
function generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// 切换到计时器页面
function switchToTimerPage() {
    roomSetup.style.display = 'none';
    timerPage.style.display = 'flex';
    
    // 更新房间代码显示
    currentRoomCodeEl.textContent = currentRoomCode;
    footerRoomCodeEl.textContent = currentRoomCode;
    
    // 开始房间状态同步（模拟）
    if (roomInterval) clearInterval(roomInterval);
    roomInterval = setInterval(updateRoomStatus, 5000);
}

// 离开房间
function leaveRoom() {
    if (confirm('确定要离开房间吗？所有计时器进度将被保存。')) {
        // 停止所有计时器
        Object.values(timers).forEach(timer => {
            if (timer.isRunning) {
                clearInterval(timer.interval);
            }
        });
        
        // 清除房间间隔
        if (roomInterval) {
            clearInterval(roomInterval);
            roomInterval = null;
        }
        
        // 重置状态
        currentRoomCode = '';
        isInRoom = false;
        
        // 切换到房间设置页面
        timerPage.style.display = 'none';
        roomSetup.style.display = 'flex';
        
        // 清空输入框
        roomCodeInput.value = '';
        
        // 显示通知
        showNotification('已离开房间', 'info');
    }
}

// 更新房间状态
function updateRoomStatus() {
    if (!isInRoom) return;
    
    // 计算活跃计时器数量
    const activeTimers = Object.values(timers).filter(t => t.isRunning).length;
    
    if (activeTimers > 0) {
        roomStatusEl.textContent = `${activeTimers} 个计时器运行中`;
        roomStatusEl.style.color = '#4dff88';
    } else {
        roomStatusEl.textContent = '准备中';
        roomStatusEl.style.color = '#4dff88';
    }
}

// 显示说明弹窗
function showInstructions() {
    instructionsModal.style.display = 'flex';
}

// 隐藏说明弹窗
function hideInstructions() {
    instructionsModal.style.display = 'none';
}

// 显示通知
function showNotification(message, type = 'info') {
    // 移除现有通知
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 创建新通知
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // 添加关闭事件
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    // 自动移除
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 3000);
}

// 加载房间状态（模拟）
function loadRoomState(roomCode) {
    // 这里应该从服务器获取房间状态
    // 现在只是从本地存储加载
    initTimers();
    const savedState = localStorage.getItem(`pinkbean_room_${roomCode}`);
    
    if (savedState) {
        try {
            const state = JSON.parse(savedState);
            // 应用保存的状态
            Object.keys(state).forEach(timerId => {
                if (timers[timerId] && state[timerId]) {
                    const savedTimer = state[timerId];
                    const timer = timers[timerId];
                    
                    // 恢复计时器状态
                    if (savedTimer.isRunning && savedTimer.startTime) {
                        const elapsed = Math.floor((Date.now() - savedTimer.startTime) / 1000);
                        timer.remaining = Math.max(0, timer.duration - elapsed);
                        
                        if (timer.remaining > 0) {
                            // 重新开始计时器
                            toggleTimer(timerId);
                        } else {
                            // 计时器已完成
                            timer.remaining = 0;
                            timer.isRunning = false;
                        }
                    } else {
                        timer.remaining = savedTimer.remaining || timer.duration;
                        timer.isRunning = false;
                    }
                    
                    // 更新UI
                    updateTimerUI(timerId);
                }
            });
        } catch (e) {
            console.error('加载房间状态失败:', e);
        }
    } else {
        // 如果没有保存的状态，初始化计时器
        initTimers();
    }
}

// 更新计时器UI
function updateTimerUI(timerId) {
    const timer = timers[timerId];
    if (!timer) return;
    
    const timeElement = document.getElementById(`time-${timerId}`);
    const timerElement = document.getElementById(`timer-${timerId}`);
    const progressElement = timerElement?.querySelector('.circle-progress');
    
    if (!timeElement || !progressElement) return;
    
    timeElement.textContent = formatTime(timer.remaining);
    
    const progress = (timer.remaining / timer.duration) * 100;
    updateProgressCircle(progressElement, progress);
    
    if (timer.remaining <= 0) {
        timeElement.classList.add('complete');
        progressElement.classList.add('complete');
    } else {
        timeElement.classList.remove('complete');
        progressElement.classList.remove('complete');
    }
}

// 保存到本地存储
function saveToLocalStorage() {
    if (!currentRoomCode) return;
    
    // 准备保存的状态
    const stateToSave = {};
    Object.keys(timers).forEach(timerId => {
        const timer = timers[timerId];
        stateToSave[timerId] = {
            isRunning: timer.isRunning,
            startTime: timer.startTime,
            remaining: timer.remaining
        };
    });
    
    // 保存到本地存储
    localStorage.setItem(`pinkbean_room_${currentRoomCode}`, JSON.stringify(stateToSave));
    localStorage.setItem('pinkbean_last_room', currentRoomCode);
}

// 更新UI
function updateUI() {
    // 初始化后更新所有计时器UI
    TIMER_CONFIG.forEach(config => {
        if (timers[config.id]) {
            updateTimerUI(config.id);
        }
    });
}

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', init);

// 页面卸载时保存状态
window.addEventListener('beforeunload', () => {
    if (isInRoom) {
        saveToLocalStorage();
    }
});