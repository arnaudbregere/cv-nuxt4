import { todos, saveTodos, ensureInitialized } from '../../utils/todoStore';

export default defineEventHandler(async (event) => {
  await ensureInitialized(); // Ensure todos are loaded

  const method = event.method.toUpperCase();
  const { id } = event.context.params;

  const index = todos.findIndex(t => t.id === id);
  if (index === -1) {
    throw createError({ statusCode: 404, statusMessage: 'Tâche introuvable' });
  }

  if (method === 'GET') {
    return todos[index];
  }

  if (method === 'PUT') {
    const body = await readBody(event);

    const updatedTodo = {
      ...todos[index],
      ...body,
      id,
      updatedAt: new Date().toISOString()
    };

    if (updatedTodo.title) updatedTodo.title = updatedTodo.title.trim();
    if (updatedTodo.description) updatedTodo.description = updatedTodo.description.trim();

    todos[index] = updatedTodo;
    await saveTodos();
    return updatedTodo;
  }

  if (method === 'DELETE') {
    const deleted = todos.splice(index, 1)[0];
    await saveTodos();
    return { success: true, deleted };
  }

  throw createError({ statusCode: 405, statusMessage: 'Méthode non autorisée' });
});