import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTodoStore } from '../store'
import type { Priority } from '../types'
import { PRIORITY_LABEL } from '../types'
import { AssigneePicker } from './AssigneePicker'
import { canViewProject } from '../lib/permissions'

const PRIORITY_DOT: Record<Priority, string> = {
  low: 'bg-slate-400',
  medium: 'bg-amber-500',
  high: 'bg-red-500',
}

export function NewTaskForm({ activeProjectId }: { activeProjectId: string }) {
  const projects = useTodoStore((s) => s.projects)
  const selectedProjectId = useTodoStore((s) => s.selectedProjectId)
  const addTask = useTodoStore((s) => s.addTask)
  const users = useTodoStore((s) => s.users)
  const currentUserId = useTodoStore((s) => s.currentUserId)

  const [title, setTitle] = useState('')
  const [deadline, setDeadline] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [projectId, setProjectId] = useState(activeProjectId)
  const [assigneeId, setAssigneeId] = useState<string | undefined>(undefined)

  const showProjectPicker = selectedProjectId === null
  const currentUser = users.find((u) => u.id === currentUserId)
  const visibleProjects = projects.filter((p) => canViewProject(currentUser, p))

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    addTask({
      title: trimmed,
      projectId: showProjectPicker ? projectId : activeProjectId,
      deadline: deadline || undefined,
      priority,
      assigneeId,
    })
    setTitle('')
    setDeadline('')
    setPriority('medium')
    setAssigneeId(undefined)
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <Plus className="h-4 w-4 shrink-0 text-slate-400" />
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Añadir una tarea..."
        className="min-w-[10rem] flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 dark:text-slate-100"
      />

      {showProjectPicker && (
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
        >
          {visibleProjects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      )}

      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
      />

      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
      >
        {(Object.keys(PRIORITY_LABEL) as Priority[]).map((p) => (
          <option key={p} value={p}>
            {PRIORITY_LABEL[p]}
          </option>
        ))}
      </select>
      <span className={`h-2 w-2 rounded-full ${PRIORITY_DOT[priority]}`} />

      <AssigneePicker value={assigneeId} onChange={setAssigneeId} />

      <button
        type="submit"
        className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
      >
        Añadir
      </button>
    </form>
  )
}
