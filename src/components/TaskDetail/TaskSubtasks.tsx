import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useTodoStore } from '../../store'
import type { Task } from '../../types'

export function TaskSubtasks({ task }: { task: Task }) {
  const addSubtask = useTodoStore((s) => s.addSubtask)
  const toggleSubtask = useTodoStore((s) => s.toggleSubtask)
  const deleteSubtask = useTodoStore((s) => s.deleteSubtask)

  const [title, setTitle] = useState('')

  const completed = task.subtasks.filter((st) => st.done).length
  const total = task.subtasks.length

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    addSubtask(task.id, trimmed)
    setTitle('')
  }

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Subtareas</h2>
        {total > 0 && (
          <span className="text-xs text-slate-400">
            {completed}/{total} completadas
          </span>
        )}
      </div>

      {total === 0 ? (
        <p className="text-xs text-slate-400">Sin subtareas todavía.</p>
      ) : (
        <ul className="flex flex-col gap-1">
          {task.subtasks.map((st) => (
            <li
              key={st.id}
              className="group flex items-center gap-2 rounded px-1.5 py-1 hover:bg-slate-50 dark:hover:bg-slate-800/60"
            >
              <input
                type="checkbox"
                checked={st.done}
                onChange={() => toggleSubtask(task.id, st.id)}
                className="h-4 w-4 shrink-0 cursor-pointer accent-blue-600"
              />
              <span
                className={`flex-1 text-sm ${
                  st.done ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                {st.title}
              </span>
              <button
                onClick={() => deleteSubtask(task.id, st.id)}
                className="hidden shrink-0 rounded p-1 text-slate-400 hover:bg-red-100 hover:text-red-600 group-hover:block dark:hover:bg-red-950/50"
                aria-label="Eliminar subtarea"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={submit} className="flex items-center gap-2">
        <Plus className="h-4 w-4 shrink-0 text-slate-400" />
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Añadir subtarea..."
          className="min-w-[8rem] flex-1 rounded border border-slate-200 bg-white px-2 py-1 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700"
        >
          Añadir
        </button>
      </form>
    </section>
  )
}
