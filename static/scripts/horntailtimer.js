// ========== Horntail计时器核心逻辑 ==========
class HorntailTimer {
    constructor() {
        // 计时器配置 - 12个计时器
        this.timerConfig = {
            'laSed1': { duration: 180, element: 'LASED1', name: "LA SED#1", upText: "LA SED#1's up!" },
            'laSed2': { duration: 180, element: 'LASED2', name: "LA SED#2", upText: "LA SED#2's up!" },
            'laSed3': { duration: 180, element: 'LASED3', name: "LA SED#3", upText: "LA SED#3's up!" },
            'laMass': { duration: 60, element: 'LAMass', name: "LA MASS", upText: "LA MASS's up!" },
            'raSed1': { duration: 180, element: 'RASED1', name: "RA SED#1", upText: "RA SED#1's up!" },
            'raSed2': { duration: 180, element: 'RASED2', name: "RA SED#2", upText: "RA SED#2's up!" },
            'raSed3': { duration: 180, element: 'RASED3', name: "RA SED#3", upText: "RA SED#3's up!" },
            'raMass': { duration: 60, element: 'RAMass', name: "RA MASS", upText: "RA MASS's up!" },
            'laDp1': { duration: 300, element: 'LADP1', name: "LA DP#1", upText: "LA DP#1's up!" },
            'laDp2': { duration: 180, element: 'LADP2', name: "LA DP#2", upText: "LA DP#2's up!" },
            'mhDp1': { duration: 300, element: 'MHDP1', name: "MH DP#1", upText: "MH DP#1's up!" },
            'mhDp2': { duration: 180, element: 'MHDP2', name: "MH DP#2", upText: "MH DP#2's up!" }
        };

        // 初始化计时器状态
        this.timers = {};
        Object.keys(this.timerConfig).forEach(timerId => {
            this.timers[timerId] = {
                remaining: this.timerConfig[timerId].duration,
                running: false,
                completed: false,
                interval: null,
                paused: false
            };
        });

        this.roomCode = null;
        this.clickTimeout = null;
        this.clickCount = 0;
        this.vibrationSupported = 'vibrate' in navigator;

        this.init();
    }

    adjustCircleLayout() {
        // 这个方法现在是可选的，因为CSS已经处理了布局
        // 如果需要更精确的控制，可以在这里添加逻辑
        const circles = document.querySelectorAll('.timer-circle');
        const gridItems = document.querySelectorAll('.grid-item');
        
        if (circles.length === 0 || gridItems.length === 0) return;
        
        // 获取第一个网格项的尺寸
        const gridItem = gridItems[0];
        const itemRect = gridItem.getBoundingClientRect();
        
        // 使用最小尺寸确保圆形
        const size = Math.min(itemRect.width, itemRect.height) * 0.85;
        
        // 设置所有圆形尺寸
        circles.forEach(circle => {
            circle.style.width = `${size}px`;
            circle.style.height = `${size}px`;
        });
    }

    init() {
        console.log('Horntail Timer 初始化');
        this.cacheElements();
        this.bindEvents();
        
        // 初始化所有计时器的进度条
        Object.keys(this.timers).forEach(timerId => {
            this.updateCircularProgress(timerId, this.timerConfig[timerId].duration);
        });
        
        // 初始调整布局
        setTimeout(() => {
            this.adjustCircleSizes();
        }, 100);
    }

    cacheElements() {
        // 房间设置界面
        this.roomSetup = document.getElementById('roomSetup');
        this.timerPage = document.getElementById('timerPage');
        this.roomCodeInput = document.getElementById('roomCode');
        this.joinRoomBtn = document.getElementById('joinRoom');
        this.createRoomBtn = document.getElementById('createRoom');
        this.howToUseBtn = document.getElementById('howToUse');
        
        // 计时器界面
        this.currentRoom = document.getElementById('currentRoom');
        this.leaveRoomBtn = document.getElementById('leaveRoom');
        this.footerRoomCode = document.getElementById('footerRoomCode');
        
        // 弹窗
        this.howToUseModal = document.getElementById('howToUseModal');
        this.closeHowTo = document.getElementById('closeHowTo');
    }

    bindEvents() {
        // 房间设置事件
        this.joinRoomBtn.addEventListener('click', () => this.joinRoom());
        this.createRoomBtn.addEventListener('click', () => this.createRoom());
        this.howToUseBtn.addEventListener('click', () => this.showHowToUse());
        
        this.roomCodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.joinRoom();
        });

        // 计时器控制事件
        this.leaveRoomBtn.addEventListener('click', () => this.leaveRoom());

        // 弹窗事件
        this.closeHowTo.addEventListener('click', () => this.hideHowToUse());
        
        this.howToUseModal.addEventListener('click', (e) => {
            if (e.target === this.howToUseModal) {
                this.hideHowToUse();
            }
        });

        // 为圆形计时器绑定事件
        this.bindCircleEvents();
        
        // 监听窗口大小变化
        window.addEventListener('resize', () => {
            if (window.horntailTimer) {
                window.horntailTimer.adjustLayout();
            }
        });
    }

    bindCircleEvents() {
        console.log('绑定圆形计时器事件...');
        
        document.querySelectorAll('.timer-circle').forEach(circle => {
            circle.addEventListener('click', (e) => {
                this.handleCircleClick(circle);
            });
            
            circle.addEventListener('touchstart', () => {
                circle.classList.add('active');
            }, { passive: true });
            
            circle.addEventListener('touchend', () => {
                setTimeout(() => {
                    circle.classList.remove('active');
                }, 600);
            }, { passive: true });
        });
    }

    handleCircleClick(circleElement) {
        const timerId = circleElement.dataset.timer;
        if (!timerId) return;
        
        // 触发水波纹效果
        circleElement.classList.add('active');
        setTimeout(() => {
            circleElement.classList.remove('active');
        }, 600);
        
        // 震动反馈
        this.vibrate(50);
        
        this.clickCount++;
        
        if (this.clickCount === 1) {
            this.clickTimeout = setTimeout(() => {
                // 单击 - 开始/暂停/继续
                this.handleSingleClick(timerId);
                this.clickCount = 0;
            }, 250);
        } else if (this.clickCount === 2) {
            // 双击 - 重置
            clearTimeout(this.clickTimeout);
            this.handleDoubleClick(timerId);
            this.clickCount = 0;
        }
    }

    vibrate(duration) {
        if (this.vibrationSupported) {
            try {
                navigator.vibrate(duration);
            } catch (e) {
                console.log('震动失败:', e);
            }
        }
    }

    handleSingleClick(timerId) {
        const timer = this.timers[timerId];
        const config = this.timerConfig[timerId];
        
        if (timer.completed) {
            // 如果计时已完成，重新开始
            this.resetTimer(timerId);
            this.startTimer(timerId);
        } else if (timer.running) {
            // 如果正在运行，暂停
            this.pauseTimer(timerId);
        } else if (timer.paused) {
            // 如果是暂停状态，继续
            this.resumeTimer(timerId);
        } else {
            // 其他情况，开始计时
            this.startTimer(timerId);
        }
    }

    handleDoubleClick(timerId) {
        // 双击震动稍强
        this.vibrate([50, 30, 50]);
        this.resetTimer(timerId);
        this.showNotification(`${this.timerConfig[timerId].name} 已重置 | Reset`, 'info');
    }

    // ========== 房间功能 ==========
    createRoom() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let roomCode = '';
        for (let i = 0; i < 4; i++) {
            roomCode += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        this.roomCodeInput.value = roomCode;
        this.showNotification(`已创建房间: ${roomCode} | Created room: ${roomCode}`, 'success');
        this.roomCodeInput.focus();
        this.vibrate(100);
    }

    joinRoom() {
        const roomCode = this.roomCodeInput.value.trim().toUpperCase();
        
        if (!roomCode.match(/^[A-Za-z0-9]{4,6}$/)) {
            this.showNotification('请输入4-6位数字或字母作为房间号 | Please enter 4-6 digits/letters as room code', 'error');
            this.roomCodeInput.focus();
            this.vibrate([100, 50, 100]);
            return;
        }

        this.vibrate(100);
        this.connectToRoom(roomCode);
    }

    connectToRoom(roomCode) {
        this.joinRoomBtn.textContent = '连接中... | Connecting...';
        this.joinRoomBtn.disabled = true;

        setTimeout(() => {
            this.roomCode = roomCode;
            
            this.currentRoom.textContent = roomCode;
            this.footerRoomCode.textContent = roomCode;
            
            this.roomSetup.style.display = 'none';
            this.timerPage.style.display = 'block';
            
            this.joinRoomBtn.textContent = '加入房间';
            this.joinRoomBtn.disabled = false;
            
            this.showNotification(`成功加入房间: ${roomCode} | Joined room: ${roomCode}`, 'success');
            this.vibrate([100, 50, 100]);
            
            setTimeout(() => {
                this.adjustLayout(); // 调用布局调整
            }, 100);
            
        }, 800);
    }

    leaveRoom() {
        const confirmMsg = '确定要离开当前房间吗？ | Are you sure you want to leave the room?';
        
        if (confirm(confirmMsg)) {
            this.resetAllTimers();
            
            this.timerPage.style.display = 'none';
            this.roomSetup.style.display = 'flex';
            
            this.roomCodeInput.value = '';
            
            this.showNotification('已离开房间 | Left the room', 'info');
            this.vibrate(100);
        }
    }

    // ========== 计时器功能 ==========
    startTimer(timerId) {
    if (!this.timers[timerId]) return;
    
    const timer = this.timers[timerId];
    const config = this.timerConfig[timerId];
    
    if (timer.completed) {
        this.resetTimer(timerId);
    }
    
    if (!timer.running) {
        timer.running = true;
        timer.completed = false;
        timer.paused = false;
        
        // 开始计时：立即显示进度条（dashoffset: 0）
        const elementName = config.element;
        const progressElement = document.querySelector(`#timer${elementName} .circle-progress`);
        if (progressElement) {
            progressElement.setAttribute('style', 'stroke-dashoffset: 0; stroke: #FF4D7A;');
        }
        
        // 立即更新一次，确保状态正确
        this.updateCircularProgress(timerId, config.duration);
        
        timer.interval = setInterval(() => {
            timer.remaining--;
            
            this.updateTimerDisplay(timerId);
            this.updateCircularProgress(timerId, config.duration);
            
            if (timer.remaining <= 0) {
                this.completeTimer(timerId);
            }
            
        }, 1000);
        
        this.playSound('start');
        this.showNotification(`${config.name} 开始计时 | ${config.name} started`, 'info');
        this.vibrate(50);
    }
}

    stopTimer(timerId) {
        if (!this.timers[timerId]) return;
        
        const timer = this.timers[timerId];
        if (timer.interval) {
            clearInterval(timer.interval);
            timer.interval = null;
        }
        timer.running = false;
    }

    completeTimer(timerId) {
        if (!this.timers[timerId]) return;
        
        const timer = this.timers[timerId];
        const config = this.timerConfig[timerId];
        
        this.stopTimer(timerId);
        timer.completed = true;
        timer.running = false;
        timer.paused = false;
        
        this.showCompleteAnimation(timerId);
        this.playBeepSound();
        this.showNotification(config.upText, 'success');
        this.vibrate([100, 50, 100]);
        
        this.updateTimerDisplay(timerId);
        this.updateCircularProgress(timerId, config.duration);
    }

    updateCircularProgress(timerId, totalDuration) {
    const timer = this.timers[timerId];
    const config = this.timerConfig[timerId];
    
    const elementName = config.element;
    const progressElement = document.querySelector(`#timer${elementName} .circle-progress`);
    const circleElement = document.getElementById(`timer${elementName}`);
    
    if (!progressElement || !circleElement) {
        console.error(`找不到元素: timer${elementName}`);
        return;
    }
    
    const circumference = 282.6;
    
    // 调试信息
    const remainingRatio = timer.remaining / totalDuration;
    const dashoffset = circumference * (1 - remainingRatio);
    console.log(`更新 ${timerId}: remaining=${timer.remaining}, 剩余比例=${remainingRatio}, dashoffset=${dashoffset}`);
    
    if (timer.completed || timer.remaining <= 0) {
        // 计时完成 - 绿色完整圆（完全显示）
        progressElement.setAttribute('style', 'stroke-dashoffset: 0; stroke: var(--green-ready);');
        progressElement.classList.add('complete');
        circleElement.classList.add('completed');
    } else if (timer.running || timer.paused) {
        // 正在计时或暂停 - 剩余时间越少，dashoffset越大
        progressElement.setAttribute('style', `stroke-dashoffset: ${dashoffset}; stroke: var(--purple-primary);`);
        progressElement.classList.remove('complete');
        circleElement.classList.remove('completed');
    } else {
        // 重置状态 - 完全隐藏（dashoffset = 周长）
        progressElement.setAttribute('style', 'stroke-dashoffset: 282.6; stroke: var(--purple-primary);');
        progressElement.classList.remove('complete');
        circleElement.classList.remove('completed');
    }
}

    showCompleteAnimation(timerId) {
        const config = this.timerConfig[timerId];
        const circle = document.getElementById(`timer${config.element}`);
        if (circle) {
            circle.classList.add('completed');
            setTimeout(() => {
                circle.classList.remove('completed');
            }, 1000);
        }
    }

    resetTimer(timerId) {
        if (!this.timers[timerId]) return;
        
        const timer = this.timers[timerId];
        const config = this.timerConfig[timerId];
        
        this.stopTimer(timerId);
        timer.remaining = config.duration;
        timer.completed = false;
        timer.paused = false;
        
        this.updateTimerDisplay(timerId);
        this.updateCircularProgress(timerId, config.duration);
        
        this.playSound('reset');
    }

    pauseTimer(timerId) {
        if (this.timers[timerId] && this.timers[timerId].running) {
            const timer = this.timers[timerId];
            const config = this.timerConfig[timerId];
            
            if (timer.interval) {
                clearInterval(timer.interval);
                timer.interval = null;
            }
            
            timer.running = false;
            timer.paused = true;
            
            this.showNotification(`${config.name} 已暂停 | ${config.name} paused`, 'info');
            this.vibrate(50);
        }
    }

    resumeTimer(timerId) {
        if (!this.timers[timerId] || this.timers[timerId].running) return;
        
        const timer = this.timers[timerId];
        const config = this.timerConfig[timerId];
        
        timer.running = true;
        timer.paused = false;
        
        timer.interval = setInterval(() => {
            timer.remaining--;
            
            this.updateTimerDisplay(timerId);
            this.updateCircularProgress(timerId, config.duration);
            
            if (timer.remaining <= 0) {
                this.completeTimer(timerId);
            }
            
        }, 1000);
        
        this.showNotification(`${config.name} 继续计时 | ${config.name} resumed`, 'info');
        this.vibrate(50);
    }

    updateTimerDisplay(timerId) {
        const timer = this.timers[timerId];
        const config = this.timerConfig[timerId];
        const element = document.getElementById(`time${config.element}`);
        
        if (element) {
            if (timer.completed) {
                element.textContent = 'UP!';
                element.classList.add('complete');
            } else {
                // 格式化时间显示
                if (config.duration >= 60) {
                    // 显示分钟和秒
                    const minutes = Math.floor(timer.remaining / 60);
                    const seconds = timer.remaining % 60;
                    element.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                } else {
                    element.textContent = timer.remaining;
                }
                element.classList.remove('complete');
            }
        }
    }

    resetAllTimers() {
        Object.keys(this.timers).forEach(timerId => {
            this.resetTimer(timerId);
        });
    }

    // ========== 布局调整 ==========
    adjustLayout() {
        // 调用新的布局调整方法
        this.adjustCircleLayout();
    }
    
    // 调整圆形尺寸以确保是圆形
    adjustCircleSizes() {
        const gridItems = document.querySelectorAll('.grid-item');
        const circles = document.querySelectorAll('.timer-circle');
        
        if (gridItems.length === 0 || circles.length === 0) return;
        
        // 获取第一个网格项的尺寸（所有应该相同）
        const gridItem = gridItems[0];
        const itemRect = gridItem.getBoundingClientRect();
        
        // 使用最小尺寸确保圆形
        const size = Math.min(itemRect.width, itemRect.height) * 0.85;
        
        // 设置所有圆形尺寸
        circles.forEach(circle => {
            circle.style.width = `${size}px`;
            circle.style.height = `${size}px`;
        });
    }

    // ========== 音频功能 ==========
    playBeepSound() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.frequency.value = 800 + (i * 100);
                    oscillator.type = 'sine';
                    
                    gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
                    
                    oscillator.start();
                    oscillator.stop(audioContext.currentTime + 0.08);
                }, i * 150);
            }
        } catch (e) {
            console.log('音频播放失败:', e);
        }
    }

    playSound(type) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            let frequency = 600;
            let duration = 0.1;
            
            if (type === 'reset') {
                frequency = 500;
                duration = 0.15;
            }
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + duration);
        } catch (e) {
            // 静默失败
        }
    }

    // ========== 辅助功能 ==========
    showHowToUse() {
        this.howToUseModal.style.display = 'flex';
        this.vibrate(50);
    }

    hideHowToUse() {
        this.howToUseModal.style.display = 'none';
    }

    showNotification(message, type = 'info') {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 2000);
        
        this.addNotificationStyles();
    }

    addNotificationStyles() {
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 12px 16px;
                    border-radius: 8px;
                    color: white;
                    z-index: 1000;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    min-width: 200px;
                    max-width: 300px;
                    animation: slideIn 0.3s ease;
                    backdrop-filter: blur(10px);
                }
                .notification-success {
                    background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
                }
                .notification-error {
                    background: linear-gradient(135deg, #F44336 0%, #D32F2F 100%);
                }
                .notification-info {
                    background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    margin-left: 10px;
                    padding: 0 5px;
                    opacity: 0.8;
                }
                .notification-close:hover {
                    opacity: 1;
                }
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @media (max-width: 768px) {
                    .notification {
                        left: 20px;
                        right: 20px;
                        max-width: none;
                        top: 10px;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// ========== 初始化应用 ==========
document.addEventListener('DOMContentLoaded', () => {
    try {
        const horntailTimer = new HorntailTimer();
        window.horntailTimer = horntailTimer;
    } catch (error) {
        console.error('Horntail Timer 初始化失败:', error);
        alert('页面加载失败，请刷新重试。 | Page load failed, please refresh and try again.');
    }
});