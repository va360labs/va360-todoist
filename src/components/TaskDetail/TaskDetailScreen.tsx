import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useTodoStore } from '../../store'
import type { Priority, Task } from '../../types'
import { PRIORITY_LABEL } from '../../types'
import { classifyDeadline, DEADLINE_LABEL, DEADLINE_STYLES, formatDeadline } from '../../lib/deadline'
import { TaskSubtasks } from './TaskSubtasks'
import { TaskComments } from './TaskComments'
import { TaskAttachments } from './TaskAttachments'

export function TaskDetailScreen() {
  const openTaskId = useTodoStore((s) => s.openTaskId)
  const closeTaskDetail = useTodoStore((s) => s.closeTaskDetail)
  const foundTask = useTodoStore((s) => s.tasks.find((t) => t.id === openTaskId))
  const users = useTodoStore((s) => s.users)
  const toggleTask = useTodoStore((s) => s.toggleTask)
  const updateTask = useTodoStore((s) => s.updateTask)
  const assignTask = useTodoStore((s) => s.assignTask)

  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState(foundTask?.title ?? '')
  const [notesDraft, setNotesDraft] = useState(foundTask?.notes ?? '')

  if (!foundTask) {
    closeTaskDetail()
    return null
  }

  // Re-bind with an explicit, non-optional type so the closures below
  // (which TS cannot re-narrow across function boundaries) stay type-safe.
  const task: Task = foundTask

  const status = classifyDeadline(task.deadline)

  function startEditTitle() {
    setTitleDraft(task.title)
    setEditingTitle(true)
  }

  function saveTitle() {
    const trimmed = titleDraft.trim()
    updateTask(task.id, { title: trimmed || task.title })
    setEditingTitle(false)
  }

  function saveNotes() {
    updateTask(task.id, { notes: notesDraft.trim() || undefined })
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
      <button
        onClick={closeTaskDetail}
        className="flex w-fit items-center gap-1 rounded px-1 py-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </button>

      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={task.done}
            onChange={() => toggleTask(task.id)}
            className="mt-2.5 h-4 w-4 shrink-0 cursor-pointer accent-blue-600"
          />

          {editingTitle ? (
            <input
              autoFocus
              value={titleDraft}
              onChange={(e) => setTitleDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveTitle()}
              onBlur={saveTitle}
              className="flex-1 rounded border border-slate-200 bg-white px-2 py-1 text-xl font-semibold outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          ) : (
            <h1
              onClick={startEditTitle}
              className={`flex-1 cursor-text rounded px-2 py-1 text-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                task.done ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-100'
              }`}
            >
              {task.title}
            </h1>
          )}
        </div>

        <div className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            Prioridad
            <select
              value={task.priority}
              onChange={(e) => updateTask(task.id, { priority: e.target.value as Priority })}
              className="rounded border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              {(Object.keys(PRIORITY_LABEL) as Priority[]).map((p) => (
                <option key={p} value={p}>
                  {PRIORITY_LABEL[p]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            Fecha límite
            <input
              type="date"
              value={task.deadline ?? ''}
              onChange={(e) => updateTask(task.id, { deadline: e.target.value || undefined })}
              className="rounded border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            Asignado a
            <select
              value={task.assigneeId ?? ''}
              onChange={(e) => assignTask(task.id, e.target.value || null)}
              className="rounded border border-slate-200 bg-white px-2 py-1 text-sm text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="">Sin asignar</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </label>

          {task.deadline && (
            <span
              className={`flex h-fit items-center rounded-full border px-2 py-1 text-xs ${DEADLINE_STYLES[status]}`}
            >
              {DEADLINE_LABEL[status] ? `${DEADLINE_LABEL[status]} · ` : ''}
              {formatDeadline(task.deadline)}
            </span>
          )}
        </div>

        <label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          Notas
          <textarea
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
            onBlur={saveNotes}
            rows={4}
            placeholder="Añade una descripción..."
            className="w-full resize-none rounded border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          />
        </label>
      </div>

      <TaskSubtasks task={task} />
      <TaskComments task={task} />
      <TaskAttachments task={task} />
    </div>
  )
}
