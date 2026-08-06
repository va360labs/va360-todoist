export type Priority = 'low' | 'medium' | 'high'

export interface Project {
  id: string
  name: string
  color: string
  createdAt: number
}

export interface Task {
  id: string
  projectId: string
  title: string
  notes?: string
  done: boolean
  deadline?: string
  priority: Priority
  createdAt: number
  completedAt?: number
}

export const PRIORITY_LABEL: Record<Priority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
}

export const PROJECT_COLORS = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#84cc16',
  '#10b981',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#d946ef',
  '#ec4899',
  '#64748b',
]
