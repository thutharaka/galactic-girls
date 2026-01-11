// === USER TASKS WITH SESSION STORAGE (clears on close) ===
let todos = JSON.parse(sessionStorage.getItem('userTodos')) || [];
let stars = [];

// DOM Elements
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const activeCount = document.getElementById('activeCount');
const completedCount = document.getElementById('completedCount');
const starContainer = document.getElementById('starContainer');

// === TASK PROGRESS STORAGE ===
const TASK_PROGRESS_KEY = 'galacticTaskProgress';

// === EVENT LISTENERS ===
document.addEventListener('DOMContentLoaded', initializeApp);
todoForm.addEventListener('submit', handleFormSubmit);

// === INITIALIZATION ===
function initializeApp() {
    createStars();
    setupCategoryListeners();
    createProgressIndicator();
    updateAllStarGlow();
    render();
    updateProgressIndicator();
}

// === PROGRESS INDICATOR ===
function createProgressIndicator() {
    // Check if progress indicator already exists
    if (!document.querySelector('.progress-indicator')) {
        const progressHTML = `
            <div class="progress-indicator">
                <div class="progress-title">Starmap Progress</div>
                <div class="progress-bar-container">
                    <div class="progress-bar"></div>
                </div>
                <div class="progress-text">0% Complete</div>
            </div>
        `;
        
        // Insert progress indicator after the container
        const container = document.querySelector('.container');
        if (container) {
            container.insertAdjacentHTML('afterend', progressHTML);
        }
    }
}

function updateProgressIndicator() {
    const progress = getTaskProgress();
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    
    if (progressBar && progressText) {
        progressBar.style.width = `${progress.completionPercentage}%`;
        progressText.textContent = `${progress.completionPercentage}% Complete`;
        
        // Add glow effect based on progress
        if (progress.completionPercentage > 0) {
            progressBar.style.boxShadow = `0 0 ${progress.completionPercentage/2}px #f5d5e0`;
            progressText.style.textShadow = `0 0 ${progress.completionPercentage/5}px #f5d5e0`;
            progressText.style.color = '#f5d5e0';
        }
    }
}

// === STAR CREATION ===
function createStars() {
    starContainer.innerHTML = '';
    stars = [];
    
    const numStars = 150; // More stars for better effect
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.top = Math.random() * 100 + '%';
        star.style.left = Math.random() * 100 + '%';
        const size = Math.random() * 3 + 1; // Slightly larger stars
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random animation delay for twinkling effect
        star.style.animationDelay = `${Math.random() * 3}s`;
        
        starContainer.appendChild(star);
        stars.push(star);
    }
}

// === TASK PROGRESS FUNCTIONS ===
function saveTaskProgress() {
    // Count completed user tasks
    const userCompleted = todos.filter(t => t.completed).length;
    
    // Count completed category tasks
    const categoryCheckboxes = document.querySelectorAll('.category-checkbox');
    const categoryCompleted = Array.from(categoryCheckboxes).filter(cb => cb.checked).length;
    
    // Total completed tasks
    const totalCompleted = userCompleted + categoryCompleted;
    
    // Calculate completion percentage (max 12 tasks: 6 user + 6 category)
    const totalPossibleTasks = 12;
    const completionPercentage = Math.min(100, Math.round((totalCompleted / totalPossibleTasks) * 100));
    
    // Save to localStorage so starmap can access it
    const progressData = {
        totalCompleted,
        userCompleted,
        categoryCompleted,
        completionPercentage,
        lastUpdated: new Date().toISOString(),
        totalTasks: totalPossibleTasks
    };
    
    localStorage.setItem(TASK_PROGRESS_KEY, JSON.stringify(progressData));
    
    return progressData;
}

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

// === TODO FUNCTIONS ===
function handleFormSubmit(e) {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (!text) return;

    todos.unshift({ 
        id: Date.now().toString(), 
        text, 
        completed: false 
    });
    todoInput.value = '';
    saveUserTodos();
    render();
    updateAllStarGlow();
    updateProgressIndicator();
}

function toggleTodo(id) {
    todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveUserTodos();
    render();
    updateAllStarGlow();
    updateProgressIndicator();
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveUserTodos();
    render();
    updateAllStarGlow();
    updateProgressIndicator();
}

function render() {
    if (todos.length === 0) {
        todoList.innerHTML = '';
        updateEmptyState();
        return;
    }
    
    todoList.innerHTML = todos.map(todo => `
        <div class="todo-item" data-id="${todo.id}">
            <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
            <span class="todo-text ${todo.completed ? 'completed' : ''}">
                ${escapeHtml(todo.text)}
            </span>
            <button class="delete-btn">✖</button>
        </div>
    `).join('');

    addTodoEventListeners();
    updateStats();
    updateEmptyState();
}

function addTodoEventListeners() {
    // Add event listeners to checkboxes
    document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const todoItem = this.closest('.todo-item');
            const todoId = todoItem.dataset.id;
            toggleTodo(todoId);
        });
    });

    // Add event listeners to todo text
    document.querySelectorAll('.todo-text').forEach(textSpan => {
        textSpan.addEventListener('click', function() {
            const todoItem = this.closest('.todo-item');
            const todoId = todoItem.dataset.id;
            toggleTodo(todoId);
        });
    });

    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const todoItem = this.closest('.todo-item');
            const todoId = todoItem.dataset.id;
            deleteTodo(todoId);
        });
    });
}

function updateStats() {
    const active = todos.filter(t => !t.completed).length;
    const completed = todos.filter(t => t.completed).length;
    activeCount.textContent = `${active} active mission${active !== 1 ? 's' : ''}`;
    completedCount.textContent = completed ? `${completed} completed` : '';
}

function updateEmptyState() {
    emptyState.style.display = todos.length ? 'none' : 'block';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function saveUserTodos() {
    sessionStorage.setItem('userTodos', JSON.stringify(todos));
}

// === CATEGORY TASKS ===
function setupCategoryListeners() {
    const categoryCheckboxes = document.querySelectorAll('.category-checkbox');
    categoryCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            updateAllStarGlow();
            updateProgressIndicator();
        });
    });
}

// === STAR GLOW LOGIC ===
function updateAllStarGlow() {
    const progress = saveTaskProgress();
    const totalCompleted = progress.totalCompleted;
    
    if (totalCompleted > 0) {
        stars.forEach(star => {
            star.classList.add('glow');
            
            // Calculate glow intensity based on completed tasks
            const glowIntensity = 1 + (totalCompleted * 0.3);
            const glowSize = 5 + totalCompleted * 2;
            const glowSpread = 1 + totalCompleted;
            const outerGlow = 10 + totalCompleted * 3;
            const outerSpread = 2 + totalCompleted;
            
            star.style.boxShadow = 
                `0 0 ${glowSize}px ${glowSpread}px #f5d5e0, 
                 0 0 ${outerGlow}px ${outerSpread}px #c874b2`;
            
            // Add pulsing animation
            star.style.animation = `pulse ${2 / glowIntensity}s infinite alternate, twinkle 3s infinite alternate`;
        });
    } else {
        stars.forEach(star => {
            star.classList.remove('glow');
            star.style.boxShadow = '';
            star.style.animation = 'twinkle 3s infinite alternate';
        });
    }
}

// === SAVE PROGRESS ON PAGE UNLOAD ===
window.addEventListener('beforeunload', function() {
    saveTaskProgress();
});

document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
        saveTaskProgress();
    }
});