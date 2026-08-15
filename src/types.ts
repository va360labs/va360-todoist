export type Priority = 'low' | 'medium' | 'high'

export type Role = 'admin' | 'member'

export interface User {
  id: string
  name: string
  color: string
  role: Role
  createdAt: number
}

/** 'everyone' = visible para todos; string[] = ids de usuario con acceso (además de los admins) */
export type ProjectVisibility = 'everyone' | string[]

export interface Project {
  id: string
  name: string
  color: string
  icon: string
  visibility: ProjectVisibility
  createdAt: number
}

export interface Subtask {
  id: string
  title: string
  done: boolean
}

export interface Comment {
  id: string
  authorId: string
  body: string
  createdAt: number
}

export interface Attachment {
  id: string
  name: string
  mimeType: string
  size: number
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
  assigneeId?: string
  subtasks: Subtask[]
  comments: Comment[]
  attachments: Attachment[]
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
