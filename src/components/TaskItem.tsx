import { useState } from 'react'
import { ExternalLink, Trash2 } from 'lucide-react'
import { useTodoStore } from '../store'
import type { Priority, Project, Task } from '../types'
import { PRIORITY_LABEL } from '../types'
import { classifyDeadline, DEADLINE_LABEL, DEADLINE_STYLES, formatDeadline } from '../lib/deadline'

const PRIORITY_DOT: Record<Priority, string> = {
  low: 'bg-slate-400',
  medium: 'bg-amber-500',
  high: 'bg-red-500',
}

export function TaskItem({ task, project }: { task: Task; project?: Project }) {
  const toggleTask = useTodoStore((s) => s.toggleTask)
  const deleteTask = useTodoStore((s) => s.deleteTask)
  const updateTask = useTodoStore((s) => s.updateTask)
  const openTaskDetail = useTodoStore((s) => s.openTaskDetail)

  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [deadline, setDeadline] = useState(task.deadline ?? '')
  const [priority, setPriority] = useState<Priority>(task.priority)

  const status = classifyDeadline(task.deadline)

  function save() {
    const trimmed = title.trim()
    updateTask(task.id, {
      title: trimmed || task.title,
      deadline: deadline || undefined,
      priority,
    })
    setEditing(false)
  }

  if (editing) {
    return (
      <li className="flex flex-wrap items-center gap-2 rounded-lg border border-blue-200 bg-blue-50/50 p-2.5 dark:border-blue-900 dark:bg-blue-950/30">
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && save()}
          className="min-w-[10rem] flex-1 rounded border border-slate-200 bg-white px-2 py-1 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          className="rounded border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="rounded border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
        >
          {(Object.keys(PRIORITY_LABEL) as Priority[]).map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABEL[p]}
            </option>
          ))}
        </select>
        <button
          onClick={save}
          className="rounded bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700"
        >
          Guardar
        </button>
        <button
          onClick={() => setEditing(false)}
          className="rounded px-2.5 py-1 text-xs text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800"
        >
          Cancelar
        </button>
      </li>
    )
  }

  return (
    <li className="group flex items-center gap-3 rounded-lg border border-transparent px-2.5 py-2 hover:border-slate-200 hover:bg-white dark:hover:border-slate-800 dark:hover:bg-slate-900">
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => toggleTask(task.id)}
        className="h-4 w-4 shrink-0 cursor-pointer accent-blue-600"
      />

      <span className={`h-2 w-2 shrink-0 rounded-full ${PRIORITY_DOT[task.priority]}`} title={PRIORITY_LABEL[task.priority]} />

      <button
        onClick={() => setEditing(true)}
        className={`flex-1 truncate text-left text-sm ${
          task.done ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'
        }`}
      >
        {task.title}
      </button>

      {project && (
        <span
          className="flex shrink-0 items-center gap-1 truncate text-xs text-slate-400"
          title={project.name}
        >
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: project.color }} />
          {project.name}
        </span>
      )}

      {task.deadline && (
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-xs ${DEADLINE_STYLES[status]}`}
        >
          {DEADLINE_LABEL[status] ? `${DEADLINE_LABEL[status]} · ` : ''}
          {formatDeadline(task.deadline)}
        </span>
      )}

      <button
        onClick={() => openTaskDetail(task.id)}
        className="hidden shrink-0 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 group-hover:block dark:hover:bg-slate-800"
        aria-label="Abrir detalle de la tarea"
      >
        <ExternalLink className="h-3.5 w-3.5" />
      </button>

      <button
        onClick={() => deleteTask(task.id)}
        className="hidden shrink-0 rounded p-1 text-slate-400 hover:bg-red-100 hover:text-red-600 group-hover:block dark:hover:bg-red-950/50"
        aria-label="Eliminar tarea"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </li>
  )
}
