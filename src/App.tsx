import { useEffect, useMemo, useState } from 'react'
import { Pencil, Check, Users } from 'lucide-react'
import { Sidebar } from './components/Sidebar'
import { NewTaskForm } from './components/NewTaskForm'
import { TaskList } from './components/TaskList'
import { TaskDetailScreen } from './components/TaskDetail/TaskDetailScreen'
import { TeamScreen } from './components/Team/TeamScreen'
import { IconPicker } from './components/IconPicker'
import { VisibilityPicker } from './components/VisibilityPicker'
import { useTodoStore, INBOX_ID } from './store'
import { PROJECT_COLORS } from './types'
import { canViewProject } from './lib/permissions'

function App() {
  const projects = useTodoStore((s) => s.projects)
  const users = useTodoStore((s) => s.users)
  const currentUserId = useTodoStore((s) => s.currentUserId)
  const selectedProjectId = useTodoStore((s) => s.selectedProjectId)
  const selectProject = useTodoStore((s) => s.selectProject)
  const renameProject = useTodoStore((s) => s.renameProject)
  const recolorProject = useTodoStore((s) => s.recolorProject)
  const setProjectIcon = useTodoStore((s) => s.setProjectIcon)
  const setProjectVisibility = useTodoStore((s) => s.setProjectVisibility)
  const view = useTodoStore((s) => s.view)
  const openTeam = useTodoStore((s) => s.openTeam)

  const currentUser = useMemo(
    () => users.find((u) => u.id === currentUserId),
    [users, currentUserId],
  )

  // Visibility-aware by construction: a project the current user can't see is
  // never resolved into activeProject, so its name/color/icon can never paint
  // (even transiently) while the effect below catches up on selectedProjectId.
  const activeProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId && canViewProject(currentUser, p)),
    [projects, selectedProjectId, currentUser],
  )

  // If the currently selected project becomes invisible to the acting user
  // (visibility changed, or "acting as" switched to a restricted user), fall
  // back to "Todas" instead of leaving a now-hidden project selected underneath.
  useEffect(() => {
    if (selectedProjectId === null) return
    const rawProject = projects.find((p) => p.id === selectedProjectId)
    if (rawProject && !canViewProject(currentUser, rawProject)) {
      selectProject(null)
    }
  }, [selectedProjectId, projects, currentUser, selectProject])

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
        <div className="flex justify-end">
          <button
            onClick={openTeam}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <Users className="h-4 w-4" />
            Equipo
          </button>
        </div>

        {view === 'team' ? (
          <TeamScreen />
        ) : view === 'taskDetail' ? (
          <TaskDetailScreen />
        ) : (
          <>
            <header className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
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
              </div>

              {activeProject && activeProject.id !== INBOX_ID && !editingName && (
                <div className="flex flex-wrap items-start gap-5 pl-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Icono
                    </span>
                    <IconPicker
                      value={activeProject.icon}
                      onChange={(icon) => setProjectIcon(activeProject.id, icon)}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Visibilidad
                    </span>
                    <VisibilityPicker
                      value={activeProject.visibility}
                      onChange={(visibility) => setProjectVisibility(activeProject.id, visibility)}
                      users={users}
                    />
                  </div>
                </div>
              )}
            </header>

            <NewTaskForm activeProjectId={activeProject?.id ?? INBOX_ID} />

            <TaskList projectId={selectedProjectId} />
          </>
        )}
      </main>
    </div>
  )
}

export default App
