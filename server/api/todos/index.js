// server/api/todos/index.js
import { todos } from '../../utils/todoStore'

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  if (method === 'GET') {
    return todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  if (method === 'POST') {
    const body = await readBody(event)

    if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
      throw createError({ statusCode: 400, statusMessage: 'Le titre est requis' })
    }

    const validPriorities = ['low', 'medium', 'high']
    if (body.priority && !validPriorities.includes(body.priority)) {
      throw createError({ statusCode: 400, statusMessage: 'Priorité invalide' })
    }

    const newTodo = {
      id: 'todo_' + String(todos.length + 1).padStart(3, '0'),
      title: body.title.trim(),
      description: body.description ? body.description.trim() : '',
      completed: false,
      priority: body.priority || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    todos.push(newTodo)
    return newTodo
  }

  throw createError({ statusCode: 405, statusMessage: 'Méthode non autorisée' })
})
