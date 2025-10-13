<template>
  <div class="todo-container">
    <h1 class="title">TODO LIST</h1>

    <!-- Formulaire d'ajout -->
    <form @submit.prevent="addTodo" class="add-form">
      <input
        v-model="newTodo.title"
        type="text"
        placeholder="Titre de la tâche..."
        required
        class="input-field"
      />
      <input
        v-model="newTodo.description"
        type="text"
        placeholder="Description (optionnelle)..."
        class="input-field"
      />
      <select v-model="newTodo.priority" class="select-field">
        <option value="low">Faible</option>
        <option value="medium">Moyenne</option>
        <option value="high">Élevée</option>
      </select>
      <button type="submit" class="btn-add">Ajouter</button>
    </form>

    <!-- Filtres -->
    <div class="filters">
      <button 
        @click="filter = 'all'" 
        :class="{ active: filter === 'all' }"
        class="filter-btn"
      >
        Toutes ({{ todos.length }})
      </button>
      <button 
        @click="filter = 'active'" 
        :class="{ active: filter === 'active' }"
        class="filter-btn"
      >
        Actives ({{ activeTodos.length }})
      </button>
      <button 
        @click="filter = 'completed'" 
        :class="{ active: filter === 'completed' }"
        class="filter-btn"
      >
        Terminées ({{ completedTodos.length }})
      </button>
    </div>

    <!-- Message de chargement -->
    <div v-if="loading" class="loading">Chargement...</div>

    <!-- Message d'erreur -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Liste des tâches -->
    <div class="todos-list">
      <div 
        v-for="todo in filteredTodos" 
        :key="todo.id"
        :class="['todo-item', { completed: todo.completed, [`priority-${todo.priority}`]: true }]"
      >
        <div v-if="editingId !== todo.id" class="todo-display">
          <input 
            type="checkbox" 
            v-model="todo.completed" 
            @change="updateTodo(todo)"
            class="checkbox"
          />
          <div class="todo-content">
            <h3 class="todo-title">{{ todo.title }}</h3>
            <p v-if="todo.description" class="todo-description">{{ todo.description }}</p>
            <div class="todo-meta">
              <span class="priority">{{ getPriorityText(todo.priority) }}</span>
              <span class="date">{{ formatDate(todo.createdAt) }}</span>
            </div>
          </div>
          <div class="todo-actions">
            <button @click="() => deleteTodo(todo.id)" class="btn-delete">Supprimer</button>
            <button @click="startEdit(todo)" class="btn-edit">Modifier</button>
          </div>
        </div>

        <!-- Mode édition -->
        <div v-else class="todo-edit">
          <input 
            v-model="editForm.title" 
            type="text" 
            class="edit-input"
            @keyup.enter="saveEdit(todo.id)"
            @keyup.escape="cancelEdit"
          />
          <input 
            v-model="editForm.description" 
            type="text" 
            placeholder="Description..."
            class="edit-input"
          />
          <select v-model="editForm.priority" class="edit-select">
            <option value="low">Faible</option>
            <option value="medium">Moyenne</option>
            <option value="high">Élevée</option>
          </select>
          <div class="edit-actions">
            <button @click="saveEdit(todo.id)" class="btn-save">Sauvegarder</button>
            <button @click="cancelEdit" class="btn-cancel">Annuler</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions globales -->
    <div v-if="todos.length > 0" class="global-actions">
      <button @click="markAllCompleted" class="btn-global">Tout marquer comme terminé</button>
      <button @click="clearCompleted" class="btn-global">Supprimer les terminées</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTodos } from '~/composables/useTodos'
import { getPriorityText, formatDate } from '~/utils/todo'

// Utilisation du composable
const {
  // État
  todos,
  loading,
  error,
  filter,
  editingId,
  
  // Formulaires
  newTodo,
  editForm,
  
  // Computed
  activeTodos,
  completedTodos,
  filteredTodos,
  
  // Actions
  addTodo,
  updateTodo,
  deleteTodo,
  startEdit,
  saveEdit,
  cancelEdit,
  markAllCompleted,
  clearCompleted,
  initTodos
} = useTodos()

// Initialisation
onMounted(() => {
  initTodos()
})
</script>

<style scoped lang="scss">
.todo-container {
  font-family: 'Courier New', monospace;
  background: var(--bg-deepest);
  color: var(--text-light);
  padding: 0.1rem;
  min-height: 100vh;
  max-width: 160rem;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.title {
  text-align: center;
  color: var(--electric-cyan);
  text-shadow: 0 0 1rem var(--neon-blue), 0 0 2rem var(--accent-purple);
  margin-bottom: 2rem;
  font-size: 2.5rem;
  position: relative;
  z-index: 1;
}

.add-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--glass-bg);
  border: 0.2rem solid var(--glass-border);
  border-radius: 0.8rem;
  backdrop-filter: blur(0.5rem);
  box-shadow: var(--neo-shadow);
  @include respond-to(tablet) {
    flex-direction: row;
  }
}

.input-field, .select-field {
  background: var(--bg-darker);
  border: 0.1rem solid var(--neon-blue);
  color: var(--text-light);
  padding: 0.75rem;
  font-family: inherit;
  border-radius: 0.4rem;
  transition: all 0.3s ease;
  &:focus {
    outline: none;
    border-color: var(--electric-cyan);
    box-shadow: 0 0 1.5rem var(--border-glow);
  }
}

.btn-add {
  background: var(--neon-blue);
  color: var(--bright-white);
  border: none;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  border-radius: 0.4rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 0.1rem;
  transition: all 0.3s ease;
  &:hover {
    background: var(--accent-purple);
    box-shadow: 0 0 2rem var(--accent-purple);
  }
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  @include respond-to(tablet) {
    flex-direction: row;
  }
}

.filter-btn {
  background: var(--bg-darker);
  color: var(--text-light);
  border: 0.1rem solid var(--neon-blue);
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  border-radius: 0.4rem;
  transition: all 0.3s ease;
  &.active, &:hover {
    background: var(--electric-cyan);
    color: var(--bg-deepest);
    box-shadow: 0 0 1rem var(--electric-cyan);
  }
}

.loading, .error {
  text-align: center;
  padding: 1rem;
  margin: 1rem 0;
  border: 0.1rem solid var(--neon-blue);
  border-radius: 0.4rem;
}

.error {
  color: var(--accent-pink);
  border-color: var(--accent-pink);
  background: rgba(236, 72, 153, 0.1);
}

.todos-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.todo-item {
  border: 0.1rem solid var(--glass-border);
  padding: 1.5rem;
  background: var(--glass-bg);
  border-radius: 0.8rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  &.completed {
    opacity: 0.7;
    border-color: var(--text-dim);
  }
  &.priority-high {
    border-left: 0.5rem solid var(--accent-pink);
  }
  &.priority-medium {
    border-left: 0.5rem solid var(--accent-purple);
  }
  &.priority-low {
    border-left: 0.5rem solid var(--neon-blue);
  }
}

.todo-display {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  @include respond-to(tablet) {
    flex-direction: row;
    align-items: flex-start;
  }
}

.checkbox {
  margin-top: 0.5rem;
  transform: scale(1.5);
  accent-color: var(--neon-blue);
}

.todo-content {
  flex: 1;
}

.todo-title {
  margin: 0 0 0.5rem 0;
  color: var(--electric-cyan);
  font-size: 1.2rem;
  text-shadow: 0 0 0.5rem var(--neon-blue);
}

.todo-item.completed .todo-title {
  text-decoration: line-through;
  color: var(--text-dim);
}

.todo-description {
  margin: 0 0 0.5rem 0;
  color: var(--text-dim);
  font-size: 1rem;
}

.todo-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  color: var(--text-dim);
}

.todo-actions {
  display: flex;
  gap: 0.5rem;
  @include respond-to(tablet) {
    flex-direction: column;
    justify-content: flex-start;
  }
}

.btn-edit, .btn-delete, .btn-save, .btn-cancel {
  background: var(--bg-darker);
  color: var(--text-light);
  border: 0.1rem solid var(--neon-blue);
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 0.4rem;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  &:hover {
    background: var(--neon-blue);
    color: var(--bright-white);
  }
}

.btn-delete {
  color: var(--accent-pink);
  border-color: var(--accent-pink);
  &:hover {
    background: var(--accent-pink);
    color: var(--bg-deepest);
  }
}

.todo-edit {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.edit-input, .edit-select {
  background: var(--bg-darker);
  border: 0.1rem solid var(--neon-blue);
  color: var(--text-light);
  padding: 0.75rem;
  border-radius: 0.4rem;
  transition: all 0.3s ease;
  &:focus {
    outline: none;
    border-color: var(--electric-cyan);
    box-shadow: 0 0 1.5rem var(--border-glow);
  }
}

.edit-actions {
  display: flex;
  gap: 1rem;
}

.global-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.btn-global {
  background: var(--bg-darker);
  color: var(--accent-purple);
  border: 0.1rem solid var(--accent-purple);
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  border-radius: 0.4rem;
  transition: all 0.3s ease;
  &:hover {
    background: var(--accent-purple);
    color: var(--bright-white);
  }
}

/* Animations */
@keyframes pulse {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}

@keyframes rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Media Queries */
@include respond-to(tablet) {
  .todo-container {
    padding: 2rem;
  }
  .add-form {
    flex-direction: row;
  }
  .todo-display {
    flex-direction: row;
    align-items: flex-start;
  }
  .todo-actions {
    flex-direction: column;
    justify-content: flex-start;
  }
  .filters {
    flex-direction: row;
    align-items: center;
  }
}
</style>