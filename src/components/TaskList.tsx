import { useMemo, useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useTodoStore } from '../store'
import type { Task } from '../types'
import { classifyDeadline, type DeadlineStatus } from '../lib/deadline'
import { canViewProject } from '../lib/permissions'
import { TaskItem } from './TaskItem'

const GROUP_ORDER: DeadlineStatus[] = ['overdue', 'today', 'soon', 'later', 'none']
const GROUP_TITLE: Record<DeadlineStatus, string> = {
  overdue: 'Vencidas',
  today: 'Hoy',
  soon: 'Próximos 3 días',
  later: 'Más adelante',
  none: 'Sin fecha',
}

export function TaskList({ projectId }: { projectId: string | null }) {
  const tasks = useTodoStore((s) => s.tasks)
  const projects = useTodoStore((s) => s.projects)
  const users = useTodoStore((s) => s.users)
  const currentUserId = useTodoStore((s) => s.currentUserId)
  const [showCompleted, setShowCompleted] = useState(false)

  const projectById = useMemo(() => new Map(projects.map((p) => [p.id, p])), [projects])

  const currentUser = useMemo(
    () => users.find((u) => u.id === currentUserId),
    [users, currentUserId],
  )

  const scoped = useMemo(
    () =>
      tasks.filter((t) => {
        if (projectId !== null && t.projectId !== projectId) return false
        const project = projectById.get(t.projectId)
        return project ? canViewProject(currentUser, project) : false
      }),
    [tasks, projectId, projectById, currentUser],
  )

  const open = scoped.filter((t) => !t.done)
  const completed = scoped.filter((t) => t.done).sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0))

  const groups = useMemo(() => {
    const map = new Map<DeadlineStatus, Task[]>()
    for (const status of GROUP_ORDER) map.set(status, [])
    for (const t of open) {
      map.get(classifyDeadline(t.deadline))!.push(t)
    }
    for (const list of map.values()) {
      list.sort((a, b) => (a.deadline ?? '9999').localeCompare(b.deadline ?? '9999'))
    }
    return map
  }, [open])

  if (scoped.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
        No hay tareas todavía. ¡Añade la primera arriba!
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto pb-6">
      {GROUP_ORDER.map((status) => {
        const list = groups.get(status) ?? []
        if (list.length === 0) return null
        return (
          <section key={status}>
            <h2 className="mb-1.5 px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              {GROUP_TITLE[status]} · {list.length}
            </h2>
            <ul className="space-y-0.5">
              {list.map((t) => (
                <TaskItem
                  key={t.id}
                  task={t}
                  project={projectId === null ? projectById.get(t.projectId) : undefined}
                />
              ))}
            </ul>
          </section>
        )
      })}

      {completed.length > 0 && (
        <section>
          <button
            onClick={() => setShowCompleted((v) => !v)}
            className="mb-1.5 flex items-center gap-1 px-1 text-xs font-semibold uppercase tracking-wide text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            {showCompleted ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            Completadas · {completed.length}
          </button>
          {showCompleted && (
            <ul className="space-y-0.5">
              {completed.map((t) => (
                <TaskItem
                  key={t.id}
                  task={t}
                  project={projectId === null ? projectById.get(t.projectId) : undefined}
                />
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  )
}
