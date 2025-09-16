// server/api/todos/index.js
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
    // Si le fichier n'existe pas, retourner un tableau vide
    if (error.code === 'ENOENT') {
      return []
    }
    throw error
  }
}

// Fonction utilitaire pour écrire les données
async function writeTodos(todos) {
  // Créer le dossier data s'il n'existe pas
  const dataDir = path.dirname(dataPath)
  try {
    await fs.mkdir(dataDir, { recursive: true })
  } catch (error) {
    // Le dossier existe déjà, continuer
  }
  
  await fs.writeFile(dataPath, JSON.stringify(todos, null, 2), 'utf8')
}

// Fonction pour générer un ID unique
// Fonction pour générer un ID incrémental style "todo_001"
async function generateId() {
  const todos = await readTodos()
  const ids = todos
    .map(todo => todo.id)
    .filter(id => id.startsWith("todo_"))
    .map(id => parseInt(id.replace("todo_", ""), 10))
  
  const nextId = ids.length > 0 ? Math.max(...ids) + 1 : 1
  return `todo_${String(nextId).padStart(3, "0")}`
}


export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  try {
    if (method === 'GET') {
      // GET /api/todos - Récupérer toutes les tâches
      const todos = await readTodos()
      
      // Trier par date de création (plus récent en premier)
      const sortedTodos = todos.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      )
      
      return sortedTodos
      
    } else if (method === 'POST') {
      // POST /api/todos - Créer une nouvelle tâche
      const body = await readBody(event)
      
      // Validation des données
      if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Le titre est requis'
        })
      }

      // Valider la priorité
      const validPriorities = ['low', 'medium', 'high']
      if (body.priority && !validPriorities.includes(body.priority)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Priorité invalide. Utilisez: low, medium, ou high'
        })
      }

      const todos = await readTodos()
      
      const newTodo = {
        id: await generateId(),
        title: body.title.trim(),
        description: body.description ? body.description.trim() : '',
        completed: false,
        priority: body.priority || 'medium',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      todos.push(newTodo)
      await writeTodos(todos)
      
      // Retourner la nouvelle tâche créée
      return newTodo
      
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
    console.error('Erreur API todos:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur interne du serveur'
    })
  }
})