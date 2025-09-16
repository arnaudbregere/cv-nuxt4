// server/api/todos/[id].js
import fs from 'fs/promises'
import path from 'path'

const dataPath = path.resolve('./data/todos.json')

async function readTodos() {
  try {
    const data = await fs.readFile(dataPath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    if (error.code === 'ENOENT') return []
    throw error
  }
}

async function writeTodos(todos) {
  const dataDir = path.dirname(dataPath)
  await fs.mkdir(dataDir, { recursive: true })
  await fs.writeFile(dataPath, JSON.stringify(todos, null, 2), 'utf8')
}

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const { id: todoId } = event.context.params  // ✅ correct way

  if (!todoId) {
    throw createError({ statusCode: 400, statusMessage: 'ID de la tâche requis' })
  }

  const todos = await readTodos()
  const index = todos.findIndex(t => t.id === todoId)

  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Tâche introuvable' })
  }

  if (method === 'GET') {
    return todos[index]
  }

  if (method === 'PUT') {
    const body = await readBody(event)
    const updatedTodo = {
      ...todos[index],
      ...body,
      id: todoId,
      updatedAt: new Date().toISOString()
    }
    if (updatedTodo.title) updatedTodo.title = updatedTodo.title.trim()
    if (updatedTodo.description) updatedTodo.description = updatedTodo.description.trim()

    todos[index] = updatedTodo
    await writeTodos(todos)
    return updatedTodo
  }

  if (method === 'DELETE') {
    const deleted = todos.splice(index, 1)[0]
    await writeTodos(todos)
    return { success: true, message: 'Tâche supprimée', deleted }
  }

  throw createError({ statusCode: 405, statusMessage: 'Méthode non autorisée' })
})
