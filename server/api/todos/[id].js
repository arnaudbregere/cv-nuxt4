// server/api/todos/[id].js
import fs from 'fs/promises'
import path from 'path'

// Chemin vers le fichier JSON
const dataPath = path.resolve('./data/todos.json')

// Fonction utilitaire pour lire les données
async function readTodos() {
  try {
    const data = await fs.readFile(dataPath, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    if (error.code === 'ENOENT') {
      return []
    }
    throw error
  }
}

// Fonction utilitaire pour écrire les données
async function writeTodos(todos) {
  const dataDir = path.dirname(dataPath)
  try {
    await fs.mkdir(dataDir, { recursive: true })
  } catch (error) {
    // Le dossier existe déjà
  }
  
  await fs.writeFile(dataPath, JSON.stringify(todos, null, 2), 'utf8')
}

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const todoId = getRouterParam(event, 'id')

  if (!todoId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID de la tâche requis'
    })
  }

  try {
    const todos = await readTodos()
    const todoIndex = todos.findIndex(todo => todo.id === todoId)

    if (method === 'GET') {
      // GET /api/todos/[id] - Récupérer une tâche spécifique
      if (todoIndex === -1) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Tâche introuvable'
        })
      }
      
      return todos[todoIndex]
      
    } else if (method === 'PUT') {
      // PUT /api/todos/[id] - Mettre à jour une tâche
      if (todoIndex === -1) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Tâche introuvable'
        })
      }

      const body = await readBody(event)
      
      // Validation des données
      if (body.title !== undefined) {
        if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Le titre ne peut pas être vide'
          })
        }
      }

      // Valider la priorité si fournie
      if (body.priority !== undefined) {
        const validPriorities = ['low', 'medium', 'high']
        if (!validPriorities.includes(body.priority)) {
          throw createError({
            statusCode: 400,
            statusMessage: 'Priorité invalide. Utilisez: low, medium, ou high'
          })
        }
      }

      // Valider completed si fourni
      if (body.completed !== undefined && typeof body.completed !== 'boolean') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Le statut completed doit être un booléen'
        })
      }

      // Mettre à jour la tâche
      const updatedTodo = {
        ...todos[todoIndex],
        ...body,
        id: todoId, // S'assurer que l'ID ne change pas
        updatedAt: new Date().toISOString()
      }

      // Nettoyer les champs
      if (updatedTodo.title) {
        updatedTodo.title = updatedTodo.title.trim()
      }
      if (updatedTodo.description) {
        updatedTodo.description = updatedTodo.description.trim()
      }

      todos[todoIndex] = updatedTodo
      await writeTodos(todos)
      
      return updatedTodo
      
    } else if (method === 'DELETE') {
      // DELETE /api/todos/[id] - Supprimer une tâche
      if (todoIndex === -1) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Tâche introuvable'
        })
      }

      const deletedTodo = todos[todoIndex]
      todos.splice(todoIndex, 1)
      await writeTodos(todos)
      
      return {
        success: true,
        message: 'Tâche supprimée avec succès',
        deletedTodo
      }
      
    } else {
      // Méthode non supportée
      throw createError({
        statusCode: 405,
        statusMessage: 'Méthode non autorisée'
      })
    }
    
  } catch (error) {
    // Si c'est déjà une erreur HTTP, la relancer
    if (error.statusCode) {
      throw error
    }
    
    // Sinon, créer une erreur 500
    console.error('Erreur API todo [id]:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur interne du serveur'
    })
  }
})