// ========== AUF计时器核心逻辑 ==========
class AufTimer {
    constructor() {
        // 计时器配置
        this.timerConfig = {
            mainDR: { duration: 60, element: 'MainDR', name: "MDR", upText: "MDR's up!" },
            mainDP: { duration: 90, element: 'MainDP', name: "MDP", upText: "MDP's up!" },
            stun: { duration: 60, element: 'Stun', name: "STUN", upText: "STUN's up!" },
            sed: { duration: 30, element: 'SED', name: "SED", upText: "SED's up!" },
            cloneDP: { duration: 60, element: 'CloneDP', name: "CDP", upText: "CDP's up!" },
            cloneDR: { duration: 60, element: 'CloneDR', name: "CDR", upText: "CDR's up!" }
        };

        // 计时器状态
        this.timers = {
            mainDR: { remaining: 60, running: false, completed: false, interval: null, paused: false },
            mainDP: { remaining: 90, running: false, completed: false, interval: null, paused: false },
            stun: { remaining: 60, running: false, completed: false, interval: null, paused: false },
            sed: { remaining: 30, running: false, completed: false, interval: null, paused: false },
            cloneDP: { remaining: 60, running: false, completed: false, interval: null, paused: false },
            cloneDR: { remaining: 60, running: false, completed: false, interval: null, paused: false }
        };

        this.roomCode = null;
        this.socket = null;  // WebSocket连接
        
        // 双击检测
        this.clickTimeout = null;
        this.clickCount = 0;
        
        // 震动支持
        this.vibrationSupported = 'vibrate' in navigator;
        
        this.init();
    }

    init() {
        console.log('AUF Timer 初始化');
        this.cacheElements();
        this.bindEvents();
        
        // 初始化所有计时器的进度条
        Object.keys(this.timers).forEach(timerId => {
            this.updateCircularProgress(timerId, this.timerConfig[timerId].duration);
        });
        
        console.log('震动支持:', this.vibrationSupported);
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
            this.adjustLayout();
        });
    }

    bindCircleEvents() {
        console.log('绑定圆形计时器事件...');
        
        document.querySelectorAll('.timer-circle').forEach(circle => {
            circle.addEventListener('click', (e) => {
                this.handleCircleClick(circle);
            });
            
            // 触摸反馈
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
                if (Array.isArray(duration)) {
                    navigator.vibrate(duration);
                } else {
                    navigator.vibrate(duration);
                }
            } catch (e) {
                console.log('震动失败:', e);
            }
        }
    }

    handleSingleClick(timerId) {
        console.log(`单击: ${timerId}`);
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
        console.log(`双击: ${timerId}`);
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
        const self = this;
        const roomCodeInput = roomCode || this.roomCodeInput.value.trim().toUpperCase();
        
        if (!roomCodeInput.match(/^[A-Za-z0-9]{4,6}$/)) {
            this.showNotification('请输入4-6位数字或字母作为房间号 | Please enter 4-6 digits/letters as room code', 'error');
            this.roomCodeInput.focus();
            this.vibrate([100, 50, 100]);
            return;
        }
        
        // 关闭现有连接
        if (this.socket) {
            this.socket.close();
        }
        
        // 创建WebSocket连接
        this.socket = new WebSocket('ws://localhost:8765');
        
        this.joinRoomBtn.textContent = '连接中... | Connecting...';
        this.joinRoomBtn.disabled = true;
        
        this.socket.onopen = function() {
            console.log('WebSocket连接已建立');
            
            // 发送加入房间消息
            self.socket.send(JSON.stringify({
                type: 'join_room',
                roomCode: roomCodeInput,
                clientType: 'timer'
            }));
        };
        
        this.socket.onmessage = function(event) {
            const data = JSON.parse(event.data);
            
            if (data.type === 'room_joined') {
                // 成功加入房间
                self.roomCode = roomCodeInput;
                self.currentRoom.textContent = roomCodeInput;
                self.footerRoomCode.textContent = roomCodeInput;
                
                self.roomSetup.style.display = 'none';
                self.timerPage.style.display = 'block';
                
                self.joinRoomBtn.textContent = '加入房间';
                self.joinRoomBtn.disabled = false;
                
                self.showNotification(`成功加入房间: ${roomCodeInput} | Joined room: ${roomCodeInput}`, 'success');
                self.vibrate([100, 50, 100]);
                
                setTimeout(() => {
                    self.adjustLayout();
                }, 100);
                
            } else if (data.type === 'timer_sync') {
                // 接收到其他用户的操作同步
                const timerId = data.timerId;
                const action = data.action;
                const timerData = data.data;
                
                if (data.from === 'server') {
                    // 更新本地计时器状态（不触发重复发送）
                    self.timers[timerId].remaining = timerData.remaining;
                    self.timers[timerId].running = timerData.running;
                    self.timers[timerId].completed = timerData.completed;
                    
                    // 更新UI
                    self.updateTimerDisplay(timerId);
                    self.updateCircularProgress(timerId, self.timerConfig[timerId].duration);
                    
                    // 根据状态停止或启动本地计时器
                    if (timerData.running && !self.timers[timerId].interval) {
                        self.timers[timerId].interval = setInterval(() => {
                            self.timers[timerId].remaining--;
                            self.updateTimerDisplay(timerId);
                            self.updateCircularProgress(timerId, self.timerConfig[timerId].duration);
                            if (self.timers[timerId].remaining <= 0) {
                                self.completeTimer(timerId);
                            }
                        }, 1000);
                    } else if (!timerData.running && self.timers[timerId].interval) {
                        clearInterval(self.timers[timerId].interval);
                        self.timers[timerId].interval = null;
                    }
                }
            }
        };
        
        this.socket.onerror = function(error) {
            console.error('WebSocket错误:', error);
            self.showNotification('连接服务器失败，请检查网络 | Connection failed', 'error');
            self.joinRoomBtn.textContent = '加入房间';
            self.joinRoomBtn.disabled = false;
        };
        
        this.socket.onclose = function() {
            console.log('WebSocket连接关闭');
        };
    }

    leaveRoom() {
        // 关闭WebSocket连接
        if (this.socket) {
            if (this.roomCode) {
                this.socket.send(JSON.stringify({
                    type: 'leave_room',
                    roomCode: this.roomCode
                }));
            }
            this.socket.close();
            this.socket = null;
        }
        
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
            
            // 发送同步消息到服务器
            if (this.socket && this.socket.readyState === WebSocket.OPEN && this.roomCode) {
                this.socket.send(JSON.stringify({
                    type: 'timer_action',
                    roomCode: this.roomCode,
                    timerId: timerId,
                    action: 'start',
                    data: {
                        duration: config.duration,
                        remaining: timer.remaining
                    }
                }));
            }
            
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
        
        if (timer.completed || timer.remaining <= 0) {
            // 计时完成 - 绿色完整圆
            progressElement.style.strokeDashoffset = 0;
            progressElement.style.stroke = 'var(--green-ready)';
            progressElement.classList.add('complete');
            circleElement.classList.add('completed');
        } else if (timer.running || timer.paused) {
            // 正在计时或暂停
            const percentage = timer.remaining / totalDuration;
            const dashoffset = circumference * percentage;
            progressElement.style.strokeDashoffset = dashoffset;
            progressElement.style.stroke = 'var(--orange-primary)';
            progressElement.classList.remove('complete');
            circleElement.classList.remove('completed');
        } else {
            // 重置状态
            progressElement.style.strokeDashoffset = circumference;
            progressElement.style.stroke = 'var(--orange-primary)';
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
        
        // 发送同步消息到服务器
        if (this.socket && this.socket.readyState === WebSocket.OPEN && this.roomCode) {
            this.socket.send(JSON.stringify({
                type: 'timer_action',
                roomCode: this.roomCode,
                timerId: timerId,
                action: 'reset',
                data: {
                    duration: config.duration
                }
            }));
        }
        
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
            
            // 发送同步消息到服务器
            if (this.socket && this.socket.readyState === WebSocket.OPEN && this.roomCode) {
                this.socket.send(JSON.stringify({
                    type: 'timer_action',
                    roomCode: this.roomCode,
                    timerId: timerId,
                    action: 'pause'
                }));
            }
            
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
                element.textContent = timer.remaining;
                element.classList.remove('complete');
            }
        }
    }

    resetAllTimers() {
        Object.keys(this.timers).forEach(timerId => {
            this.resetTimer(timerId);
        });
    }

    // 简单布局调整
    adjustLayout() {
        const width = window.innerWidth;
        const timerGrid = document.querySelector('.timer-grid');
        
        if (!timerGrid) return;
        
        if (width <= 480) {
            timerGrid.style.gap = '8px';
        } else if (width <= 768) {
            timerGrid.style.gap = '12px';
        } else {
            timerGrid.style.gap = '15px';
        }
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
                    
                    oscillator.frequency.value = 1000 + (i * 100);
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
            
            let frequency = 800;
            let duration = 0.1;
            
            if (type === 'reset') {
                frequency = 600;
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
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    min-width: 200px;
                    max-width: 300px;
                    animation: slideIn 0.3s ease;
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
        const aufTimer = new AufTimer();
        window.aufTimer = aufTimer;
    } catch (error) {
        console.error('AUF Timer 初始化失败:', error);
        alert('页面加载失败，请刷新重试。 | Page load failed, please refresh and try again.');
    }
});
