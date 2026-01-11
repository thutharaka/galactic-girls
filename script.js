// Global state
let todos = [];

// DOM Elements
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const activeCount = document.getElementById('activeCount');
const completedCount = document.getElementById('completedCount');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Load saved todos from localStorage
    const savedTodos = localStorage.getItem('galacticTodos');
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
    }
    
    todoForm.addEventListener('submit', handleFormSubmit);
    render();
});

// Event Handlers
function handleFormSubmit(e) {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (!text) return;

    const newTodo = {
        id: Date.now().toString(),
        text,
        completed: false,
        createdAt: new Date().toISOString()
    };

    todos.unshift(newTodo);
    todoInput.value = '';
    
    // Add animation effect
    todoInput.focus();
    
    saveToLocalStorage();
    render();
}

function toggleTodo(id) {
    todos = todos.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
    );
    saveToLocalStorage();
    render();
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveToLocalStorage();
    render();
}

// Render Functions
function render() {
    const active = todos.filter(t => !t.completed);
    const completed = todos.filter(t => t.completed);
    
    updateStats(active, completed);
    updateEmptyState();
    renderTodoList();
}

function updateStats(active, completed) {
    activeCount.textContent = `${active.length} active mission${active.length !== 1 ? 's' : ''}`;
    completedCount.textContent = completed.length ? `${completed.length} completed` : '';
}

function updateEmptyState() {
    emptyState.style.display = todos.length ? 'none' : 'block';
    todoList.style.display = todos.length ? 'flex' : 'none';
}

function renderTodoList() {
    todoList.innerHTML = todos.map(todo => `
        <div class="todo-item" data-id="${todo.id}">
            <input type="checkbox" class="todo-checkbox"
                ${todo.completed ? 'checked' : ''}
                onchange="toggleTodo('${todo.id}')">
            <span class="todo-text ${todo.completed ? 'completed' : ''}"
                onclick="toggleTodo('${todo.id}')">
                ${escapeHtml(todo.text)}
            </span>
            <button class="delete-btn" onclick="deleteTodo('${todo.id}')" title="Delete mission">
                ✖
            </button>
        </div>
    `).join('');
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function saveToLocalStorage() {
    localStorage.setItem('galacticTodos', JSON.stringify(todos));
}

// Add some keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Focus input on '/' key
    if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        todoInput.focus();
    }
    
    // Clear input on Escape
    if (e.key === 'Escape' && document.activeElement === todoInput) {
        todoInput.value = '';
    }
    
    // Submit on Enter (already handled by form)
});

// Add some visual feedback
todoInput.addEventListener('focus', () => {
    todoInput.style.boxShadow = '0 0 0 2px rgba(56,189,248,0.3)';
});

todoInput.addEventListener('blur', () => {
    todoInput.style.boxShadow = '';
});

// Make functions available globally for inline event handlers
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;