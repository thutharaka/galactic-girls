const PROGRESS_KEY = 'galacticProgress';

function getProgress() {
    return JSON.parse(sessionStorage.getItem(PROGRESS_KEY)) || {
        points: 0,
        stars: 0
    };
}

function saveProgress(progress) {
    sessionStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

function awardStar() {
    const progress = getProgress();
    progress.stars += 1;
    progress.points += 10;
    saveProgress(progress);
}
