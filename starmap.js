// Star Map - Enhanced version
document.addEventListener('DOMContentLoaded', function() {
    const starMap = document.getElementById('star-map');
    
    // Load completed tasks count
    let completedTasks = parseInt(localStorage.getItem('completedTasks') || '0');
    
    // Clear and create stars
    updateStars(completedTasks);
    
    // Listen for task completion updates (from other tabs/pages)
    window.addEventListener('storage', function(e) {
        if (e.key === 'completedTasks') {
            const newCount = parseInt(e.newValue || '0');
            updateStars(newCount);
        }
    });
    
    // Also update from task changes in same tab
    setInterval(() => {
        const newCount = parseInt(localStorage.getItem('completedTasks') || '0');
        if (newCount !== completedTasks) {
            completedTasks = newCount;
            updateStars(completedTasks);
        }
    }, 1000);
});

function updateStars(count) {
    const starMap = document.getElementById('star-map');
    if (!starMap) return;
    
    // Clear existing stars
    starMap.innerHTML = '';
    
    // Pre-defined FIXED positions (no movement)
    const fixedPositions = [
        // Format: [left%, top%, size]
        [15, 25, 6], [30, 20, 8], [45, 30, 5], [60, 25, 7], [75, 35, 6],
        [20, 45, 7], [35, 50, 6], [50, 40, 8], [65, 55, 5], [80, 45, 7],
        [25, 65, 6], [40, 70, 8], [55, 60, 5], [70, 75, 7], [85, 65, 6],
        [10, 50, 5], [90, 30, 8], [5, 75, 6], [95, 60, 7], [85, 80, 5]
    ];
    
    // Create stars for completed tasks
    for (let i = 0; i < count && i < fixedPositions.length; i++) {
        const [left, top, size] = fixedPositions[i];
        createGlowingStar(left, top, size);
    }
    
    // Update counter display
    const counter = document.getElementById('star-counter');
    if (counter) {
        counter.textContent = `Glowing Stars: ${count}`;
    }
}

function createGlowingStar(left, top, size) {
    const starMap = document.getElementById('star-map');
    
    const star = document.createElement('div');
    star.className = 'star static-glow';
    
    // FIXED position - absolutely no movement
    star.style.left = `${left}%`;
    star.style.top = `${top}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    
    // Add to map
    starMap.appendChild(star);
}