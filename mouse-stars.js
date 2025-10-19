// 鼠标星星拖尾效果
document.addEventListener('DOMContentLoaded', function() {
    // 创建星星元素
    function createStar(x, y) {
        const star = document.createElement('div');
        star.className = 'mouse-star';
        star.style.left = x + 'px';
        star.style.top = y + 'px';
        
        // 随机大小
        const size = Math.random() * 3 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        
        // 随机透明度
        star.style.opacity = Math.random() * 0.8 + 0.2;
        
        // 随机动画持续时间
        const duration = Math.random() * 1000 + 500;
        star.style.animationDuration = duration + 'ms';
        
        document.body.appendChild(star);
        
        // 动画结束后移除星星
        setTimeout(() => {
            star.remove();
        }, duration);
    }
    
    // 鼠标移动事件
    let mouseTimer;
    document.addEventListener('mousemove', function(e) {
        // 清除之前的定时器
        clearTimeout(mouseTimer);
        
        // 创建星星
        createStar(e.clientX, e.clientY);
        
        // 设置新的定时器，限制星星创建频率
        mouseTimer = setTimeout(() => {
            // 定时器结束后不做任何事，只是限制频率
        }, 50);
    });
    
    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        .mouse-star {
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            border-radius: 50%;
            background-color: #ffd700;
            box-shadow: 0 0 5px #ffd700;
            animation: starFade 1s ease-out forwards;
        }
        
        @keyframes starFade {
            0% {
                transform: translate(0, 0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(var(--tx), var(--ty)) scale(0);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // 为每个星星设置随机移动方向
    document.addEventListener('mousemove', function(e) {
        const stars = document.querySelectorAll('.mouse-star');
        stars.forEach(star => {
            if (!star.style.getPropertyValue('--tx')) {
                // 随机方向 (-1 到 1)
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 30 + 10;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;
                
                star.style.setProperty('--tx', tx + 'px');
                star.style.setProperty('--ty', ty + 'px');
            }
        });
    });
});