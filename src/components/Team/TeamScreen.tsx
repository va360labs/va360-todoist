import { useState } from 'react'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { useTodoStore } from '../../store'
import type { Role } from '../../types'
import { PROJECT_COLORS } from '../../types'
import { isAdmin } from '../../lib/permissions'
import { ROLE_LABEL } from './roleLabels'
import { TeamMemberRow } from './TeamMemberRow'

export function TeamScreen() {
  const users = useTodoStore((s) => s.users)
  const currentUserId = useTodoStore((s) => s.currentUserId)
  const closeTeam = useTodoStore((s) => s.closeTeam)
  const addUser = useTodoStore((s) => s.addUser)

  const currentUser = users.find((u) => u.id === currentUserId)
  const canManage = isAdmin(currentUser)

  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [color, setColor] = useState(PROJECT_COLORS[0])
  const [role, setRole] = useState<Role>('member')

  function submitMember(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    addUser(trimmed, color, role)
    setName('')
    setColor(PROJECT_COLORS[Math.floor(Math.random() * PROJECT_COLORS.length)])
    setRole('member')
    setCreating(false)
  }

  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
      <button
        onClick={closeTeam}
        className="flex w-fit items-center gap-1 rounded px-1 py-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </button>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Equipo</h1>
        {canManage && (
          <button
            onClick={() => setCreating((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            {creating ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {creating ? 'Cancelar' : 'Añadir miembro'}
          </button>
        )}
      </div>

      {canManage && creating && (
        <form
          onSubmit={submitMember}
          className="flex flex-wrap items-center gap-2 rounded-lg bg-slate-50 p-3 shadow-sm dark:bg-slate-900"
        >
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre del compañero/a"
            className="min-w-[10rem] flex-1 rounded border border-slate-200 px-2 py-1.5 text-sm outline-none focus:border-blue-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
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
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="rounded border border-slate-200 px-2 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
          >
            {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
              <option key={r} value={r}>
                {ROLE_LABEL[r]}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Añadir
          </button>
        </form>
      )}

      <ul className="space-y-1">
        {users.map((u) => (
          <TeamMemberRow
            key={u.id}
            user={u}
            isActive={u.id === currentUserId}
            canRemove={users.length > 1}
            canManage={canManage}
          />
        ))}
      </ul>
    </div>
  )
}
