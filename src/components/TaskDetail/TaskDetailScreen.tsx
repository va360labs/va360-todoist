import { ArrowLeft } from 'lucide-react'
import { useTodoStore } from '../../store'

export function TaskDetailScreen() {
  const openTaskId = useTodoStore((s) => s.openTaskId)
  const closeTaskDetail = useTodoStore((s) => s.closeTaskDetail)
  const task = useTodoStore((s) => s.tasks.find((t) => t.id === openTaskId))

  if (!task) {
    closeTaskDetail()
    return null
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
      <h1 className="text-xl font-semibold">{task.title}</h1>
    </div>
  )
}
