import { useMemo, useState } from 'react'
import { ListTodo, Plus, Trash2, X } from 'lucide-react'
import { useTodoStore, INBOX_ID } from '../store'
import { PROJECT_COLORS } from '../types'

export function Sidebar() {
  const projects = useTodoStore((s) => s.projects)
  const tasks = useTodoStore((s) => s.tasks)
  const selectedProjectId = useTodoStore((s) => s.selectedProjectId)
  const selectProject = useTodoStore((s) => s.selectProject)
  const addProject = useTodoStore((s) => s.addProject)
  const deleteProject = useTodoStore((s) => s.deleteProject)

  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [color, setColor] = useState(PROJECT_COLORS[6])

  const openCount = useMemo(() => {
    const map = new Map<string, number>()
    for (const t of tasks) {
      if (t.done) continue
      map.set(t.projectId, (map.get(t.projectId) ?? 0) + 1)
    }
    return map
  }, [tasks])

  const totalOpen = tasks.filter((t) => !t.done).length

  function submitProject(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    addProject(trimmed, color)
    setName('')
    setColor(PROJECT_COLORS[Math.floor(Math.random() * PROJECT_COLORS.length)])
    setCreating(false)
  }

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
      <div className="px-4 py-5">
        <h1 className="flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-slate-100">
          <ListTodo className="h-5 w-5 text-blue-600" />
          Mis tareas
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto px-2">
        <button
          onClick={() => selectProject(null)}
          className={`mb-1 flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            selectedProjectId === null
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
              : 'text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          <span>Todas</span>
          {totalOpen > 0 && <span className="text-xs text-slate-400">{totalOpen}</span>}
        </button>

        <div className="mt-3 mb-1 flex items-center justify-between px-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Proyectos
          </span>
          <button
            onClick={() => setCreating((v) => !v)}
            className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Nuevo proyecto"
          >
            {creating ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </button>
        </div>

        {creating && (
          <form onSubmit={submitProject} className="mb-2 space-y-2 rounded-lg bg-white p-2 shadow-sm dark:bg-slate-800">
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del proyecto"
              className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            <div className="flex flex-wrap gap-1.5">
              {PROJECT_COLORS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`h-5 w-5 rounded-full transition-transform ${
                    color === c ? 'scale-110 ring-2 ring-offset-1 ring-slate-400' : ''
                  }`}
                  aria-label={c}
                />
              ))}
            </div>
            <button
              type="submit"
              className="w-full rounded bg-blue-600 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Crear proyecto
            </button>
          </form>
        )}

        <ul className="space-y-0.5">
          {projects.map((p) => (
            <li key={p.id} className="group flex items-center">
              <button
                onClick={() => selectProject(p.id)}
                className={`flex flex-1 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                  selectedProjectId === p.id
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
                    : 'text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: p.color }}
                />
                <span className="flex-1 truncate">{p.name}</span>
                {(openCount.get(p.id) ?? 0) > 0 && (
                  <span className="text-xs text-slate-400">{openCount.get(p.id)}</span>
                )}
              </button>
              {p.id !== INBOX_ID && (
                <button
                  onClick={() => deleteProject(p.id)}
                  className="hidden shrink-0 rounded p-1.5 text-slate-400 hover:bg-red-100 hover:text-red-600 group-hover:block dark:hover:bg-red-950/50"
                  aria-label={`Eliminar ${p.name}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
