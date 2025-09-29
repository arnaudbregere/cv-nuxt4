// utils/todo.ts

import { TODO_PRIORITIES } from '~/types/todo'

export const getPriorityText = (priority: 'low' | 'medium' | 'high'): string => {
  return TODO_PRIORITIES[priority] || priority
}

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}