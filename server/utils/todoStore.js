// server/utils/todoStore.js
import fs from 'fs/promises';
import path from 'path';

const dataPath = path.resolve(process.cwd(), 'server/data/todos.json');

// Initialize todos as an empty array
let todos = [];

// Load todos from file
async function loadTodos() {
  try {
    const data = await fs.readFile(dataPath, 'utf8');
    todos = JSON.parse(data);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      console.error('Error loading todos:', err);
    }
    // If file doesn't exist, initialize with empty array
    todos = [];
  }
}

// Save todos to file
async function saveTodos() {
  try {
    await fs.writeFile(dataPath, JSON.stringify(todos, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving todos:', err);
  }
}

// Initialize todos by calling loadTodos when needed (lazy loading)
let isInitialized = false;
async function ensureInitialized() {
  if (!isInitialized) {
    await loadTodos();
    isInitialized = true;
  }
}

export { todos, saveTodos, ensureInitialized };