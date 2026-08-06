import { useMemo, useState } from 'react'
import { Pencil, Check } from 'lucide-react'
import { Sidebar } from './components/Sidebar'
import { NewTaskForm } from './components/NewTaskForm'
import { TaskList } from './components/TaskList'
import { useTodoStore, INBOX_ID } from './store'
import { PROJECT_COLORS } from './types'

function App() {
  const projects = useTodoStore((s) => s.projects)
  const selectedProjectId = useTodoStore((s) => s.selectedProjectId)
  const renameProject = useTodoStore((s) => s.renameProject)
  const recolorProject = useTodoStore((s) => s.recolorProject)

  const activeProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId),
    [projects, selectedProjectId],
  )

  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft] = useState('')

  function startEditName() {
    if (!activeProject) return
    setNameDraft(activeProject.name)
    setEditingName(true)
  }

  function saveName() {
    if (!activeProject) return
    const trimmed = nameDraft.trim()
    if (trimmed) renameProject(activeProject.id, trimmed)
    setEditingName(false)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar />

      <main className="flex min-w-0 flex-1 flex-col gap-4 overflow-hidden p-6">
        <header className="flex items-center gap-2">
          {activeProject ? (
            <>
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: activeProject.color }}
              />
              {editingName ? (
                <input
                  autoFocus
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && saveName()}
                  onBlur={saveName}
                  className="rounded border border-slate-200 bg-white px-2 py-0.5 text-xl font-semibold outline-none dark:border-slate-700 dark:bg-slate-900"
                />
              ) : (
                <h1 className="text-xl font-semibold">{activeProject.name}</h1>
              )}
              {activeProject.id !== INBOX_ID && !editingName && (
                <button
                  onClick={startEditName}
                  className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                  aria-label="Renombrar proyecto"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              )}
              {activeProject.id !== INBOX_ID && !editingName && (
                <div className="ml-2 flex gap-1">
                  {PROJECT_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => recolorProject(activeProject.id, c)}
                      style={{ backgroundColor: c }}
                      className="flex h-4 w-4 items-center justify-center rounded-full"
                      aria-label={`Color ${c}`}
                    >
                      {activeProject.color === c && <Check className="h-2.5 w-2.5 text-white" />}
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <h1 className="text-xl font-semibold">Todas las tareas</h1>
          )}
        </header>

        <NewTaskForm activeProjectId={activeProject?.id ?? INBOX_ID} />

        <TaskList projectId={selectedProjectId} />
      </main>
    </div>
  )
}

export default App
