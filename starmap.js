document.addEventListener('DOMContentLoaded', () => {
    const starMap = document.getElementById('star-map');
    if (!starMap) return;

    const positions = [
        [15,25,6],[30,20,8],[45,30,5],[60,25,7],[75,35,6],
        [20,45,7],[35,50,6],[50,40,8],[65,55,5],[80,45,7],
        [25,65,6],[40,70,8],[55,60,5],[70,75,7],[85,65,6]
    ];

    function updateStars() {
        const count = parseInt(sessionStorage.getItem('completedTasks') || '0');
        starMap.innerHTML = '';

        for (let i = 0; i < count && i < positions.length; i++) {
            const [x, y, size] = positions[i];
            const star = document.createElement('div');
            star.className = 'star static-glow';
            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;
            starMap.appendChild(star);
        }
    }

    updateStars();

    // live updates if tasks page open in another tab
    window.addEventListener('storage', e => {
        if (e.key === 'completedTasks') updateStars();
    });
});
