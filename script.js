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

// === EVENT LISTENERS ===
document.addEventListener('DOMContentLoaded', initializeApp);
todoForm.addEventListener('submit', handleFormSubmit);

// === INITIALIZATION ===
function initializeApp() {
    createStars();
    setupCategoryListeners();
    updateAllStarGlow(); // Initial star glow check
    render(); // Render user tasks
}

// === STAR CREATION ===
function createStars() {
    starContainer.innerHTML = ''; // Clear existing stars
    stars = [];
    
    const numStars = 100;
    for (let i = 0; i < numStars; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.top = Math.random() * 100 + '%';
        star.style.left = Math.random() * 100 + '%';
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        starContainer.appendChild(star);
        stars.push(star);
    }
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
}

function toggleTodo(id) {
    todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveUserTodos();
    render();
    updateAllStarGlow();
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveUserTodos();
    render();
    updateAllStarGlow();
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

    // Add event listeners to dynamically created elements
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
    // Using sessionStorage - clears when browser tab is closed
    sessionStorage.setItem('userTodos', JSON.stringify(todos));
}

// === CATEGORY TASKS ===
function setupCategoryListeners() {
    const categoryCheckboxes = document.querySelectorAll('.category-checkbox');
    categoryCheckboxes.forEach(cb => {
        cb.addEventListener('change', updateAllStarGlow);
    });
}

// === STAR GLOW LOGIC ===
function updateAllStarGlow() {
    // Count completed user tasks
    const userCompleted = todos.filter(t => t.completed).length;
    
    // Count completed category tasks
    const categoryCheckboxes = document.querySelectorAll('.category-checkbox');
    const categoryCompleted = Array.from(categoryCheckboxes).filter(cb => cb.checked).length;
    
    // Total completed tasks
    const totalCompleted = userCompleted + categoryCompleted;
    
    if (totalCompleted > 0) {
        stars.forEach(star => {
            star.classList.add('glow');
            const glowSize = 5 + totalCompleted * 2;
            const glowSpread = 1 + totalCompleted;
            const outerGlow = 10 + totalCompleted * 3;
            const outerSpread = 2 + totalCompleted;
            
            star.style.boxShadow = 
                `0 0 ${glowSize}px ${glowSpread}px #f5d5e0, 
                 0 0 ${outerGlow}px ${outerSpread}px #c874b2`;
        });
    } else {
        stars.forEach(star => {
            star.classList.remove('glow');
            star.style.boxShadow = '';
        });
    }
}

// === PAGE VISIBILITY HANDLER ===
// Clear tasks when page is closed (sessionStorage does this automatically)
// This is just for additional cleanup if needed
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'hidden') {
        // Optional cleanup can go here
    }
});

// Optional: Clear sessionStorage on page refresh if desired
// window.addEventListener('beforeunload', function() {
//     sessionStorage.removeItem('userTodos');
// });

// Make functions available globally if needed for inline handlers (though we're using event listeners)
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;