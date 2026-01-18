// parent.js - 所有工具都已上线
document.addEventListener('DOMContentLoaded', function() {
    console.log('Boss Assistant 加载完成');
    
    // 图片加载优化
    optimizeImages();
    
    // 卡片交互效果
    initCards();
});

// 优化图片显示
function optimizeImages() {
    const images = document.querySelectorAll('.card-image');
    
    images.forEach(img => {
        img.onerror = function() {
            console.log('图片加载失败:', this.src);
            this.style.opacity = '0.3';
        };
        
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.style.opacity = '0';
            img.onload = function() {
                this.style.opacity = '1';
                this.style.transition = 'opacity 0.5s ease';
            };
        }
    });
}

// 初始化卡片交互 - 所有卡片都有链接，只需添加点击动画
function initCards() {
    const toolCards = document.querySelectorAll('.tool-card');
    
    toolCards.forEach(card => {
        // 所有卡片都有链接，添加统一的点击动画
        card.addEventListener('click', function() {
            // 点击动画
            this.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                this.style.transform = 'translateY(-10px) scale(1.05)';
            }, 150);
        });
        
        // 鼠标悬停效果（可选，增强交互）
        card.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
    });
}

// 页面完全加载
window.addEventListener('load', function() {
    console.log('页面完全加载');
    
    // 检查所有图片是否加载完成
    const images = document.querySelectorAll('.card-image');
    let loadedCount = 0;
    
    images.forEach(img => {
        if (img.complete && img.naturalHeight !== 0) {
            loadedCount++;
        }
    });
    
    console.log(`图片加载完成: ${loadedCount}/${images.length}`);
    
    // 检查所有链接是否有效
    const links = document.querySelectorAll('.tool-card[href]');
    links.forEach(link => {
        console.log(`按钮链接: ${link.id} -> ${link.getAttribute('href')}`);
    });
});