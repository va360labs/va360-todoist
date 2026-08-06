import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Priority, Project, Task } from './types'

const INBOX_ID = 'inbox'

interface TodoState {
  projects: Project[]
  tasks: Task[]
  selectedProjectId: string | null
  showCompleted: boolean

  selectProject: (id: string | null) => void
  toggleShowCompleted: () => void

  addProject: (name: string, color: string) => void
  renameProject: (id: string, name: string) => void
  recolorProject: (id: string, color: string) => void
  deleteProject: (id: string) => void

  addTask: (input: {
    title: string
    projectId: string
    deadline?: string
    priority: Priority
    notes?: string
  }) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  updateTask: (id: string, patch: Partial<Omit<Task, 'id'>>) => void
}

const uid = () => crypto.randomUUID()

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      projects: [
        { id: INBOX_ID, name: 'Bandeja de entrada', color: '#64748b', createdAt: Date.now() },
      ],
      tasks: [],
      selectedProjectId: null,
      showCompleted: false,

      selectProject: (id) => set({ selectedProjectId: id }),
      toggleShowCompleted: () => set((s) => ({ showCompleted: !s.showCompleted })),

      addProject: (name, color) =>
        set((s) => ({
          projects: [...s.projects, { id: uid(), name, color, createdAt: Date.now() }],
        })),

      renameProject: (id, name) =>
        set((s) => ({
          projects: s.projects.map((p) => (p.id === id ? { ...p, name } : p)),
        })),

      recolorProject: (id, color) =>
        set((s) => ({
          projects: s.projects.map((p) => (p.id === id ? { ...p, color } : p)),
        })),

      deleteProject: (id) =>
        set((s) => {
          if (id === INBOX_ID) return s
          return {
            projects: s.projects.filter((p) => p.id !== id),
            tasks: s.tasks.map((t) => (t.projectId === id ? { ...t, projectId: INBOX_ID } : t)),
            selectedProjectId: s.selectedProjectId === id ? null : s.selectedProjectId,
          }
        }),

      addTask: ({ title, projectId, deadline, priority, notes }) =>
        set((s) => ({
          tasks: [
            ...s.tasks,
            {
              id: uid(),
              projectId,
              title,
              notes,
              deadline,
              priority,
              done: false,
              createdAt: Date.now(),
            },
          ],
        })),

      toggleTask: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id
              ? { ...t, done: !t.done, completedAt: !t.done ? Date.now() : undefined }
              : t,
          ),
        })),

      deleteTask: (id) =>
        set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      updateTask: (id, patch) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
        })),
    }),
    { name: 'todo-app-storage' },
  ),
)

export { INBOX_ID }
