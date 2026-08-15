import type { Project, User } from '../types'

export function isAdmin(user: User | undefined): boolean {
  return user?.role === 'admin'
}

export function canViewProject(user: User | undefined, project: Project): boolean {
  if (!user) return false
  if (isAdmin(user)) return true
  if (project.visibility === 'everyone') return true
  return project.visibility.includes(user.id)
}
