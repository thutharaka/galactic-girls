// === STARMAP STAR GLOW BASED ON TASK PROGRESS ===

const TASK_PROGRESS_KEY = 'galacticTaskProgress';

function getTaskProgress() {
    const saved = localStorage.getItem(TASK_PROGRESS_KEY);
    return saved ? JSON.parse(saved) : {
        totalCompleted: 0,
        userCompleted: 0,
        categoryCompleted: 0,
        completionPercentage: 0,
        totalTasks: 12
    };
}

function updateStarmapStars() {
    const progress = getTaskProgress();
    const totalCompleted = progress.totalCompleted;
    
    // Get all star elements in the starmap
    const starElements = document.querySelectorAll('.star, [class*="star"], .star-point, .constellation-star, circle, .star-dot');
    
    if (totalCompleted > 0 && starElements.length > 0) {
        const glowIntensity = 1 + (totalCompleted * 0.2);
        const glowSpread = totalCompleted * 2;
        
        starElements.forEach((star, index) => {
            // Add glow class
            star.classList.add('glow');
            
            // Calculate individual variations for more dynamic effect
            const individualIntensity = glowIntensity * (0.8 + Math.random() * 0.4);
            const pulseSpeed = 2 / individualIntensity;
            
            // Apply glow effects
            star.style.boxShadow = 
                `0 0 ${10 * individualIntensity}px ${glowSpread}px #f5d5e0,
                 0 0 ${20 * individualIntensity}px ${glowSpread * 1.5}px #c874b2,
                 0 0 ${30 * individualIntensity}px ${glowSpread * 2}px #7B337D`;
            
            // Add pulsing animation with staggered delays
            star.style.animation = `pulse ${pulseSpeed}s infinite alternate`;
            star.style.animationDelay = `${(index % 10) * 0.2}s`;
            
            // Make SVG stars glow
            if (star.tagName === 'circle' || star.tagName === 'path') {
                star.setAttribute('fill', '#f5d5e0');
                star.setAttribute('stroke', '#c874b2');
                star.setAttribute('stroke-width', '2');
                star.setAttribute('filter', `url(#glowFilter)`);
            }
        });
        
        // Update constellation lines if they exist
        const lines = document.querySelectorAll('.constellation-line, line, .line');
        lines.forEach(line => {
            line.style.stroke = '#f5d5e0';
            line.style.strokeWidth = '2px';
            line.style.filter = `drop-shadow(0 0 ${totalCompleted * 2}px #f5d5e0)`;
            line.style.opacity = '0.8';
            
            if (line.tagName === 'line' || line.tagName === 'path') {
                line.setAttribute('stroke', '#f5d5e0');
                line.setAttribute('stroke-width', '2');
                line.setAttribute('stroke-opacity', '0.8');
            }
        });
        
        // Create glow filter for SVG elements if it doesn't exist
        createGlowFilter();
        
        // Update progress indicator
        updateProgressIndicator(progress.completionPercentage);
        
        // Add celebration effect if all tasks are complete
        if (totalCompleted === progress.totalTasks) {
            celebrateCompletion();
        }
    } else if (starElements.length > 0) {
        // Reset stars to normal state
        starElements.forEach(star => {
            star.classList.remove('glow');
            star.style.boxShadow = '';
            star.style.animation = '';
            
            if (star.tagName === 'circle' || star.tagName === 'path') {
                star.setAttribute('fill', 'white');
                star.setAttribute('stroke', '');
                star.setAttribute('stroke-width', '0');
                star.setAttribute('filter', '');
            }
        });
        
        const lines = document.querySelectorAll('.constellation-line, line, .line');
        lines.forEach(line => {
            line.style.stroke = '';
            line.style.strokeWidth = '';
            line.style.filter = '';
            line.style.opacity = '';
            
            if (line.tagName === 'line' || line.tagName === 'path') {
                line.setAttribute('stroke', 'white');
                line.setAttribute('stroke-width', '1');
                line.setAttribute('stroke-opacity', '0.5');
            }
        });
    }
}

function createGlowFilter() {
    // Create SVG filter for glowing effect if it doesn't exist
    if (!document.getElementById('glowFilter')) {
        const svgNS = "http://www.w3.org/2000/svg";
        const filter = document.createElementNS(svgNS, "filter");
        filter.setAttribute("id", "glowFilter");
        filter.setAttribute("x", "-50%");
        filter.setAttribute("y", "-50%");
        filter.setAttribute("width", "200%");
        filter.setAttribute("height", "200%");
        
        // Create feGaussianBlur
        const feGaussianBlur = document.createElementNS(svgNS, "feGaussianBlur");
        feGaussianBlur.setAttribute("stdDeviation", "3");
        feGaussianBlur.setAttribute("result", "coloredBlur");
        
        // Create feMerge
        const feMerge = document.createElementNS(svgNS, "feMerge");
        
        const feMergeNode1 = document.createElementNS(svgNS, "feMergeNode");
        feMergeNode1.setAttribute("in", "coloredBlur");
        
        const feMergeNode2 = document.createElementNS(svgNS, "feMergeNode");
        feMergeNode2.setAttribute("in", "SourceGraphic");
        
        feMerge.appendChild(feMergeNode1);
        feMerge.appendChild(feMergeNode2);
        
        filter.appendChild(feGaussianBlur);
        filter.appendChild(feMerge);
        
        // Add to SVG defs or create new SVG
        let svg = document.querySelector('svg');
        if (!svg) {
            svg = document.createElementNS(svgNS, "svg");
            svg.setAttribute("style", "position: absolute; width: 0; height: 0;");
            document.body.appendChild(svg);
        }
        
        let defs = svg.querySelector('defs');
        if (!defs) {
            defs = document.createElementNS(svgNS, "defs");
            svg.appendChild(defs);
        }
        
        defs.appendChild(filter);
    }
}

function createProgressIndicator() {
    // Check if progress indicator already exists
    if (!document.querySelector('.progress-indicator')) {
        const progressHTML = `
            <div class="progress-indicator">
                <div class="progress-title">Mission Progress</div>
                <div class="progress-bar-container">
                    <div class="progress-bar"></div>
                </div>
                <div class="progress-text">0% Complete</div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', progressHTML);
    }
}

function updateProgressIndicator(percentage) {
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    
    if (progressBar && progressText) {
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${percentage}% Complete`;
        
        if (percentage > 0) {
            progressBar.style.backgroundColor = 'linear-gradient(90deg, #7B337D, #f5d5e0)';
            progressBar.style.boxShadow = `0 0 ${percentage/2}px #f5d5e0`;
            progressText.style.color = '#f5d5e0';
            progressText.style.textShadow = `0 0 ${percentage/5}px #f5d5e0`;
        }
    }
}

function celebrateCompletion() {
    // Add celebration effects when all tasks are complete
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.background = `hsl(${Math.random() * 360}, 100%, 70%)`;
        confetti.style.borderRadius = '50%';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = '-20px';
        confetti.style.zIndex = '9999';
        confetti.style.boxShadow = '0 0 10px currentColor';
        
        document.body.appendChild(confetti);
        
        // Animate confetti
        const animation = confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight + 20}px) rotate(${360 + Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: 2000 + Math.random() * 2000,
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
        });
        
        animation.onfinish = () => confetti.remove();
    }
    
    // Add a completion message
    const message = document.createElement('div');
    message.className = 'completion-message';
    message.textContent = '🌟 All Missions Complete! The Galaxy Awaits! 🌟';
    message.style.position = 'fixed';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.background = 'rgba(33, 5, 53, 0.95)';
    message.style.color = '#f5d5e0';
    message.style.padding = '20px 40px';
    message.style.borderRadius = '15px';
    message.style.fontFamily = "'Orbitron', sans-serif";
    message.style.fontSize = '1.5rem';
    message.style.zIndex = '10000';
    message.style.textAlign = 'center';
    message.style.boxShadow = '0 0 50px #f5d5e0';
    message.style.border = '2px solid #f5d5e0';
    
    document.body.appendChild(message);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transition = 'opacity 1s';
        setTimeout(() => message.remove(), 1000);
    }, 5000);
}

// === INITIALIZE STARMAP ===
document.addEventListener('DOMContentLoaded', function() {
    createProgressIndicator();
    updateStarmapStars();
    
    // Update periodically to catch changes from tasks page
    setInterval(updateStarmapStars, 1000);
    
    // Update when page becomes visible
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            updateStarmapStars();
        }
    });
});

// Add CSS for pulse animation if not already present
if (!document.querySelector('#starmap-styles')) {
    const style = document.createElement('style');
    style.id = 'starmap-styles';
    style.textContent = `
        @keyframes pulse {
            0% { opacity: 0.7; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
            100% { opacity: 0.7; transform: scale(1); }
        }
        
        .glow {
            animation: pulse 2s infinite alternate !important;
        }
        
        .progress-indicator {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(33, 5, 53, 0.9);
            padding: 15px;
            border-radius: 10px;
            border: 1px solid #7B337D;
            backdrop-filter: blur(10px);
            z-index: 1000;
            min-width: 200px;
            box-shadow: 0 0 20px rgba(123, 51, 125, 0.5);
        }
        
        .progress-title {
            font-family: 'Orbitron', sans-serif;
            color: #f5d5e0;
            margin-bottom: 8px;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .progress-bar-container {
            height: 8px;
            background: #210535;
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 8px;
        }
        
        .progress-bar {
            height: 100%;
            background: linear-gradient(90deg, #7B337D, #f5d5e0);
            border-radius: 4px;
            transition: width 1s ease, box-shadow 1s ease;
            width: 0%;
        }
        
        .progress-text {
            font-family: 'Inter', sans-serif;
            color: #c874b2;
            font-size: 0.8rem;
            text-align: right;
        }
        
        @media (max-width: 768px) {
            .progress-indicator {
                position: static;
                margin: 20px auto;
                width: 90%;
                max-width: 300px;
            }
        }
    `;
    document.head.appendChild(style);
}