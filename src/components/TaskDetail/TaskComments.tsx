import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { useTodoStore } from '../../store'
import type { Task } from '../../types'

export function TaskComments({ task }: { task: Task }) {
  const users = useTodoStore((s) => s.users)
  const addComment = useTodoStore((s) => s.addComment)
  const deleteComment = useTodoStore((s) => s.deleteComment)

  const [body, setBody] = useState('')

  const comments = [...task.comments].sort((a, b) => a.createdAt - b.createdAt)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = body.trim()
    if (!trimmed) return
    addComment(task.id, trimmed)
    setBody('')
  }

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Comentarios</h2>

      {comments.length === 0 ? (
        <p className="text-xs text-slate-400">Sin comentarios todavía.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {comments.map((c) => {
            const author = users.find((u) => u.id === c.authorId)
            return (
              <li key={c.id} className="group flex gap-2">
                <span
                  className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: author?.color ?? '#94a3b8' }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="font-medium text-slate-600 dark:text-slate-300">
                      {author?.name ?? 'Usuario eliminado'}
                    </span>
                    <span>{format(new Date(c.createdAt), 'd MMM HH:mm')}</span>
                    <button
                      onClick={() => deleteComment(task.id, c.id)}
                      className="ml-auto hidden rounded p-0.5 text-slate-400 hover:bg-red-100 hover:text-red-600 group-hover:block dark:hover:bg-red-950/50"
                      aria-label="Eliminar comentario"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200">
                    {c.body}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      )}

      <form onSubmit={submit} className="flex flex-col gap-2">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Escribe un comentario..."
          rows={2}
          className="w-full resize-none rounded border border-slate-200 bg-white px-2 py-1.5 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
        <button
          type="submit"
          className="w-fit rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
        >
          Comentar
        </button>
      </form>
    </section>
  )
}
