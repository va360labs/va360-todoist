import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Attachment, Priority, Project, ProjectVisibility, Role, Task, User } from './types'
import { PROJECT_COLORS } from './types'
import { uid } from './lib/id'

const INBOX_ID = 'inbox'
const DEFAULT_ICON = 'Folder'
const ME_ID = 'me'

type View = 'tasks' | 'taskDetail' | 'team'

interface TodoState {
  projects: Project[]
  tasks: Task[]
  users: User[]
  currentUserId: string
  selectedProjectId: string | null
  showCompleted: boolean
  view: View
  openTaskId: string | null

  selectProject: (id: string | null) => void
  toggleShowCompleted: () => void

  openTaskDetail: (id: string) => void
  closeTaskDetail: () => void
  openTeam: () => void
  closeTeam: () => void

  addProject: (name: string, color: string, icon?: string, visibility?: ProjectVisibility) => void
  renameProject: (id: string, name: string) => void
  recolorProject: (id: string, color: string) => void
  setProjectIcon: (id: string, icon: string) => void
  setProjectVisibility: (id: string, visibility: ProjectVisibility) => void
  deleteProject: (id: string) => void

  addTask: (input: {
    title: string
    projectId: string
    deadline?: string
    priority: Priority
    notes?: string
    assigneeId?: string
  }) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  updateTask: (id: string, patch: Partial<Omit<Task, 'id'>>) => void
  assignTask: (taskId: string, userId: string | null) => void

  addSubtask: (taskId: string, title: string) => void
  toggleSubtask: (taskId: string, subtaskId: string) => void
  deleteSubtask: (taskId: string, subtaskId: string) => void

  addComment: (taskId: string, body: string) => void
  deleteComment: (taskId: string, commentId: string) => void

  addAttachment: (taskId: string, attachment: Attachment) => void
  deleteAttachment: (taskId: string, attachmentId: string) => void

  setCurrentUser: (id: string) => void
  addUser: (name: string, color: string, role: Role) => void
  updateUser: (id: string, patch: Partial<Omit<User, 'id' | 'createdAt'>>) => void
  removeUser: (id: string) => void
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set) => ({
      projects: [
        {
          id: INBOX_ID,
          name: 'Bandeja de entrada',
          color: '#64748b',
          icon: DEFAULT_ICON,
          visibility: 'everyone',
          createdAt: Date.now(),
        },
      ],
      tasks: [],
      users: [{ id: ME_ID, name: 'Tú', color: PROJECT_COLORS[6], role: 'admin', createdAt: Date.now() }],
      currentUserId: ME_ID,
      selectedProjectId: null,
      showCompleted: false,
      view: 'tasks',
      openTaskId: null,

      selectProject: (id) => set({ selectedProjectId: id }),
      toggleShowCompleted: () => set((s) => ({ showCompleted: !s.showCompleted })),

      openTaskDetail: (id) => set({ view: 'taskDetail', openTaskId: id }),
      closeTaskDetail: () => set({ view: 'tasks', openTaskId: null }),
      openTeam: () => set({ view: 'team' }),
      closeTeam: () => set({ view: 'tasks' }),

      addProject: (name, color, icon = DEFAULT_ICON, visibility = 'everyone') =>
        set((s) => ({
          projects: [...s.projects, { id: uid(), name, color, icon, visibility, createdAt: Date.now() }],
        })),

      renameProject: (id, name) =>
        set((s) => ({
          projects: s.projects.map((p) => (p.id === id ? { ...p, name } : p)),
        })),

      recolorProject: (id, color) =>
        set((s) => ({
          projects: s.projects.map((p) => (p.id === id ? { ...p, color } : p)),
        })),

      setProjectIcon: (id, icon) =>
        set((s) => ({
          projects: s.projects.map((p) => (p.id === id ? { ...p, icon } : p)),
        })),

      setProjectVisibility: (id, visibility) =>
        set((s) => ({
          projects: s.projects.map((p) => (p.id === id ? { ...p, visibility } : p)),
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

      addTask: ({ title, projectId, deadline, priority, notes, assigneeId }) =>
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
              assigneeId,
              subtasks: [],
              comments: [],
              attachments: [],
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

      assignTask: (taskId, userId) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, assigneeId: userId ?? undefined } : t)),
        })),

      addSubtask: (taskId, title) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? { ...t, subtasks: [...t.subtasks, { id: uid(), title, done: false }] }
              : t,
          ),
        })),

      toggleSubtask: (taskId, subtaskId) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: t.subtasks.map((st) =>
                    st.id === subtaskId ? { ...st, done: !st.done } : st,
                  ),
                }
              : t,
          ),
        })),

      deleteSubtask: (taskId, subtaskId) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? { ...t, subtasks: t.subtasks.filter((st) => st.id !== subtaskId) }
              : t,
          ),
        })),

      addComment: (taskId, body) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  comments: [
                    ...t.comments,
                    { id: uid(), authorId: s.currentUserId, body, createdAt: Date.now() },
                  ],
                }
              : t,
          ),
        })),

      deleteComment: (taskId, commentId) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? { ...t, comments: t.comments.filter((c) => c.id !== commentId) }
              : t,
          ),
        })),

      addAttachment: (taskId, attachment) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId ? { ...t, attachments: [...t.attachments, attachment] } : t,
          ),
        })),

      deleteAttachment: (taskId, attachmentId) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === taskId
              ? { ...t, attachments: t.attachments.filter((a) => a.id !== attachmentId) }
              : t,
          ),
        })),

      setCurrentUser: (id) => set({ currentUserId: id }),

      addUser: (name, color, role) =>
        set((s) => ({
          users: [...s.users, { id: uid(), name, color, role, createdAt: Date.now() }],
        })),

      updateUser: (id, patch) =>
        set((s) => ({
          users: s.users.map((u) => (u.id === id ? { ...u, ...patch } : u)),
        })),

      removeUser: (id) =>
        set((s) => {
          if (s.users.length <= 1) return s
          const remainingUsers = s.users.filter((u) => u.id !== id)
          return {
            users: remainingUsers,
            currentUserId: s.currentUserId === id ? remainingUsers[0].id : s.currentUserId,
            tasks: s.tasks.map((t) => (t.assigneeId === id ? { ...t, assigneeId: undefined } : t)),
            projects: s.projects.map((p) =>
              Array.isArray(p.visibility)
                ? { ...p, visibility: p.visibility.filter((memberId) => memberId !== id) }
                : p,
            ),
          }
        }),
    }),
    {
      name: 'todo-app-storage',
      version: 1,
      migrate: (persisted, version) => {
        const state = persisted as Record<string, unknown>
        if (version < 1) {
          const projects = (state.projects as Array<Record<string, unknown>> | undefined) ?? []
          state.projects = projects.map((p) => ({ icon: DEFAULT_ICON, visibility: 'everyone', ...p }))

          const tasks = (state.tasks as Array<Record<string, unknown>> | undefined) ?? []
          state.tasks = tasks.map((t) => ({ subtasks: [], comments: [], attachments: [], ...t }))

          const users = state.users as User[] | undefined
          if (!users || users.length === 0) {
            state.users = [
              { id: ME_ID, name: 'Tú', color: PROJECT_COLORS[6], role: 'admin', createdAt: Date.now() },
            ]
            state.currentUserId = ME_ID
          }
          state.view = state.view ?? 'tasks'
          state.openTaskId = state.openTaskId ?? null
        }
        return state as unknown as TodoState
      },
    },
  ),
)

export { INBOX_ID }
