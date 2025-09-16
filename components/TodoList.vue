<template>
  <div class="todo-container">
    <h1 class="title">Liste de Tâches</h1>

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
            <!-- ✅ on force l’envoi de la string id -->
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

<script setup>
import { ref, computed, onMounted } from 'vue'

// État local
const todos = ref([])
const loading = ref(false)
const error = ref('')
const filter = ref('all')
const editingId = ref(null)

// Formulaires
const newTodo = ref({
  title: '',
  description: '',
  priority: 'medium'
})

const editForm = ref({
  title: '',
  description: '',
  priority: 'medium'
})

// Computed
const activeTodos = computed(() => todos.value.filter(todo => !todo.completed))
const completedTodos = computed(() => todos.value.filter(todo => todo.completed))

const filteredTodos = computed(() => {
  switch (filter.value) {
    case 'active':
      return activeTodos.value
    case 'completed':
      return completedTodos.value
    default:
      return todos.value
  }
})

// Fonctions utilitaires
const getPriorityText = (priority) => {
  const priorities = { low: 'Faible', medium: 'Moyenne', high: 'Élevée' }
  return priorities[priority] || priority
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Fonctions API
const fetchTodos = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await $fetch('/api/todos')
    todos.value = response
  } catch (err) {
    error.value = 'Erreur lors du chargement des tâches'
    console.error('Fetch todos error:', err)
  } finally {
    loading.value = false
  }
}

const addTodo = async () => {
  if (!newTodo.value.title.trim()) return
  
  loading.value = true
  error.value = ''
  try {
    const response = await $fetch('/api/todos', {
      method: 'POST',
      body: {
        title: newTodo.value.title.trim(),
        description: newTodo.value.description.trim(),
        priority: newTodo.value.priority
      }
    })
    
    todos.value.unshift(response)
    
    newTodo.value = { title: '', description: '', priority: 'medium' }
  } catch (err) {
    error.value = 'Erreur lors de l\'ajout de la tâche'
    console.error('Add todo error:', err)
  } finally {
    loading.value = false
  }
}

const updateTodo = async (todo) => {
  loading.value = true
  error.value = ''
  try {
    const response = await $fetch(`/api/todos/${todo.id}`, {
      method: 'PUT',
      body: todo
    })
    
    const index = todos.value.findIndex(t => t.id === todo.id)
    if (index !== -1) {
      todos.value[index] = response
    }
  } catch (err) {
    error.value = 'Erreur lors de la mise à jour'
    console.error('Update todo error:', err)
  } finally {
    loading.value = false
  }
}

const deleteTodo = async (id) => {
  console.log('deleteTodo called with id:', id) // ✅ debug
  if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return
  
  loading.value = true
  error.value = ''
  try {
    await $fetch(`/api/todos/${id}`, { method: 'DELETE' })
    todos.value = todos.value.filter(todo => todo.id !== id)
  } catch (err) {
    error.value = 'Erreur lors de la suppression'
    console.error('Delete todo error:', err)
  } finally {
    loading.value = false
  }
}

const startEdit = (todo) => {
  editingId.value = todo.id
  editForm.value = {
    title: todo.title,
    description: todo.description || '',
    priority: todo.priority
  }
}

const saveEdit = async (id) => {
  const todo = todos.value.find(t => t.id === id)
  if (!todo) return
  
  const updatedTodo = {
    ...todo,
    title: editForm.value.title.trim(),
    description: editForm.value.description.trim(),
    priority: editForm.value.priority,
    updatedAt: new Date().toISOString()
  }
  
  await updateTodo(updatedTodo)
  editingId.value = null
}

const cancelEdit = () => {
  editingId.value = null
  editForm.value = { title: '', description: '', priority: 'medium' }
}

const markAllCompleted = async () => {
  const updates = activeTodos.value.map(todo => 
    updateTodo({ ...todo, completed: true })
  )
  await Promise.all(updates)
}

const clearCompleted = async () => {
  const completedIds = completedTodos.value.map(todo => todo.id)
  const deletions = completedIds.map(id => deleteTodo(id))
  await Promise.all(deletions)
}

// Lifecycle
onMounted(() => {
  fetchTodos()
})
</script>

<style scoped>
.todo-container {
  font-family: 'Courier New', monospace;
  background-color: #000;
  color: #00ff00;
  padding: 2rem;
  min-height: 100vh;
  max-width: 1000px;
  margin: 0 auto;
}

.title {
  text-align: center;
  color: #ffa500;
  text-shadow: 0 0 10px #ffa500;
  margin-bottom: 2rem;
  font-size: 2rem;
}

/* Formulaire d'ajout */
.add-form {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  padding: 1rem;
  border: 2px solid #00ff00;
  background: rgba(0, 255, 0, 0.05);
}

.input-field, .select-field {
  background: #000;
  border: 1px solid #00ff00;
  color: #00ff00;
  padding: 0.5rem;
  font-family: 'Courier New', monospace;
  flex: 1;
  min-width: 150px;
}

.input-field:focus, .select-field:focus {
  outline: none;
  box-shadow: 0 0 5px #00ff00;
}

.btn-add {
  background: #00ff00;
  color: #000;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-weight: bold;
  transition: all 0.2s;
}

.btn-add:hover {
  background: #000;
  color: #00ff00;
  border: 1px solid #00ff00;
  text-shadow: 0 0 5px #00ff00;
}

/* Filtres */
.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
  flex-wrap: wrap;
}

.filter-btn {
  background: transparent;
  color: #00ff00;
  border: 1px solid #00ff00;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  transition: all 0.2s;
}

.filter-btn.active, .filter-btn:hover {
  background: #00ff00;
  color: #000;
  text-shadow: none;
}

/* Messages */
.loading, .error {
  text-align: center;
  padding: 1rem;
  margin: 1rem 0;
  border: 1px solid #00ff00;
}

.error {
  color: #ff0000;
  border-color: #ff0000;
  background: rgba(255, 0, 0, 0.1);
}

/* Liste des tâches */
.todos-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.todo-item {
  border: 1px solid #00ff00;
  padding: 1rem;
  background: rgba(0, 255, 0, 0.05);
  transition: all 0.2s;
}

.todo-item.completed {
  opacity: 0.6;
  border-color: #666;
}

.todo-item.priority-high {
  border-left: 4px solid #ff0000;
}

.todo-item.priority-medium {
  border-left: 4px solid #ffa500;
}

.todo-item.priority-low {
  border-left: 4px solid #00ff00;
}

.todo-display {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.checkbox {
  margin-top: 0.5rem;
  transform: scale(1.2);
}

.todo-content {
  flex: 1;
}

.todo-title {
  margin: 0 0 0.5rem 0;
  color: #00ff00;
  font-size: 1.1rem;
}

.todo-item.completed .todo-title {
  text-decoration: line-through;
  color: #666;
}

.todo-description {
  margin: 0 0 0.5rem 0;
  color: #a9b7c0;
  font-size: 0.9rem;
}

.todo-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: #666;
}

.priority {
  font-weight: bold;
}

.todo-actions {
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
}

.btn-edit, .btn-delete, .btn-save, .btn-cancel {
  background: transparent;
  color: #00ff00;
  border: 1px solid #00ff00;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-delete {
  color: #ff0000;
  border-color: #ff0000;
}

.btn-edit:hover, .btn-save:hover {
  background: #00ff00;
  color: #000;
}

.btn-delete:hover, .btn-cancel:hover {
  background: #ff0000;
  color: #000;
}

/* Mode édition */
.todo-edit {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.edit-input, .edit-select {
  background: #000;
  border: 1px solid #00ff00;
  color: #00ff00;
  padding: 0.5rem;
  font-family: 'Courier New', monospace;
}

.edit-actions {
  display: flex;
  gap: 1rem;
}

/* Actions globales */
.global-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.btn-global {
  background: transparent;
  color: #ffa500;
  border: 1px solid #ffa500;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  transition: all 0.2s;
}

.btn-global:hover {
  background: #ffa500;
  color: #000;
}

/* Responsive */
@media (max-width: 768px) {
  .todo-container {
    padding: 1rem;
  }
  
  .add-form {
    flex-direction: column;
  }
  
  .todo-display {
    flex-direction: column;
    align-items: stretch;
  }
  
  .todo-actions {
    flex-direction: row;
    justify-content: flex-end;
  }
  
  .filters {
    flex-direction: column;
    align-items: center;
  }
}
</style>
