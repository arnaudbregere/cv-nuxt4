// types/todo.ts

export interface Todo {
  id: string | number
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  createdAt: string
  updatedAt?: string
}

export interface TodoApiResponse {
  id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high'
  completed: boolean
  createdAt: string
  updatedAt?: string
}

export interface NewTodoForm {
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
}

export interface EditTodoForm {
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
}

export type TodoFilter = 'all' | 'active' | 'completed'

export const TODO_PRIORITIES = {
  low: 'Faible',
  medium: 'Moyenne',
  high: 'Élevée'
} as const