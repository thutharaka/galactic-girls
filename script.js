// === MAIN USER TASKS (SESSION STORAGE FOR RESET ON CLOSE) ===
let todos = JSON.parse(sessionStorage.getItem('userTodos')) || [];

const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const emptyState = document.getElementById('emptyState');
const activeCount = document.getElementById('activeCount');
const completedCount = document.getElementById('completedCount');

todoForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = todoInput.value.trim();
    if (!text) return;

    todos.unshift({
        id: Date.now().toString(),
        text,
        completed: false
    });

    todoInput.value = '';
    saveAndRender();
});

function toggleTodo(id) {
    todos = todos.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
    );
    saveAndRender();
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveAndRender();
}

function saveAndRender() {
    sessionStorage.setItem('userTodos', JSON.stringify(todos));

    // ⭐ MAIN TASKS -> STAR MAP SYNC
    const completedCount = todos.filter(t => t.completed).length;
    sessionStorage.setItem('completedTasks', completedCount.toString());

    render();
}

function render() {
    todoList.innerHTML = todos.map(todo => `
        <div class="todo-item">
            <input type="checkbox" ${todo.completed ? 'checked' : ''}
                onchange="toggleTodo('${todo.id}')">
            <span class="todo-text ${todo.completed ? 'completed' : ''}"
                onclick="toggleTodo('${todo.id}')">
                ${escapeHtml(todo.text)}
            </span>
            <button class="delete-btn"
                onclick="deleteTodo('${todo.id}')">✖</button>
        </div>
    `).join('');

    updateStats();
    emptyState.style.display = todos.length ? 'none' : 'block';
}

function updateStats() {
    const active = todos.filter(t => !t.completed).length;
    const completed = todos.filter(t => t.completed).length;

    activeCount.textContent = `${active} active mission${active !== 1 ? 's' : ''}`;
    completedCount.textContent = completed ? `${completed} completed` : '';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// expose functions
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;

render();
