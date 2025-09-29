import type { 
  Todo, 
  TodoApiResponse, 
  NewTodoForm, 
  EditTodoForm, 
  TodoFilter 
} from '~/types/todo'

export const useTodos = () => {
  // État local
  const todos = ref<Todo[]>([])
  const loading = ref(false)
  const error = ref('')
  const filter = ref<TodoFilter>('all')
  const editingId = ref<string | number | null>(null)

  // Formulaires
  const newTodo = ref<NewTodoForm>({
    title: '',
    description: '',
    priority: 'medium'
  })

  const editForm = ref<EditTodoForm>({
    title: '',
    description: '',
    priority: 'medium'
  })

  // Computed
  const activeTodos = computed(() => 
    todos.value.filter(todo => !todo.completed)
  )
  
  const completedTodos = computed(() => 
    todos.value.filter(todo => todo.completed)
  )

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

  // Conversion des réponses API
  const convertApiResponse = (apiTodo: TodoApiResponse): Todo => ({
    id: apiTodo.id,
    title: apiTodo.title,
    description: apiTodo.description,
    priority: apiTodo.priority,
    completed: apiTodo.completed,
    createdAt: apiTodo.createdAt,
    updatedAt: apiTodo.updatedAt
  })

  // Fonctions API
  const fetchTodos = async () => {
    loading.value = true
    error.value = ''
    try {
      const response = await $fetch<TodoApiResponse[]>('/api/todos')
      todos.value = response.map(convertApiResponse)
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
      const response = await $fetch<TodoApiResponse>('/api/todos', {
        method: 'POST',
        body: {
          title: newTodo.value.title.trim(),
          description: newTodo.value.description.trim(),
          priority: newTodo.value.priority
        }
      })
      
      const newTodoItem = convertApiResponse(response)
      todos.value.unshift(newTodoItem)
      
      // Reset du formulaire
      newTodo.value = { title: '', description: '', priority: 'medium' }
    } catch (err) {
      error.value = 'Erreur lors de l\'ajout de la tâche'
      console.error('Add todo error:', err)
    } finally {
      loading.value = false
    }
  }

  const updateTodo = async (todo: Todo) => {
    loading.value = true
    error.value = ''
    try {
      const response = await $fetch<TodoApiResponse>(`/api/todos/${todo.id}`, {
        method: 'PUT',
        body: todo
      })
      
      const updatedTodo = convertApiResponse(response)
      const index = todos.value.findIndex(t => t.id === todo.id)
      if (index !== -1) {
        todos.value[index] = updatedTodo
      }
    } catch (err) {
      error.value = 'Erreur lors de la mise à jour'
      console.error('Update todo error:', err)
    } finally {
      loading.value = false
    }
  }

  const deleteTodo = async (id: string | number) => {
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

  // Fonctions d'édition
  const startEdit = (todo: Todo) => {
    editingId.value = todo.id
    editForm.value = {
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority
    }
  }

  const saveEdit = async (id: string | number) => {
    const todo = todos.value.find(t => t.id === id)
    if (!todo) return
    
    const updatedTodo: Todo = {
      ...todo,
      title: editForm.value.title.trim(),
      description: editForm.value.description.trim(),
      priority: editForm.value.priority,
      updatedAt: new Date().toISOString()
    }
    
    await updateTodo(updatedTodo)
    cancelEdit()
  }

  const cancelEdit = () => {
    editingId.value = null
    editForm.value = { title: '', description: '', priority: 'medium' }
  }

  // Actions globales
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

  // Initialisation
  const initTodos = () => {
    fetchTodos()
  }

  return {
    // État
    todos: readonly(todos),
    loading: readonly(loading),
    error: readonly(error),
    filter,
    editingId: readonly(editingId),
    
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
  }
}