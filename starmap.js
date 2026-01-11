document.addEventListener('DOMContentLoaded', () => {
    const progress = getProgress();
    const stars = document.querySelectorAll('.star-box');

    stars.forEach((star, index) => {
        if (index < progress.stars) {
            star.style.opacity = '1';
            star.style.color = 'gold';
            star.style.textShadow = '0 0 15px gold';
        }
    });
});
