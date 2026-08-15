import { useState } from 'react'
import { Pencil, Trash2, UserCheck } from 'lucide-react'
import { useTodoStore } from '../../store'
import type { Role, User } from '../../types'
import { PROJECT_COLORS } from '../../types'
import { ROLE_LABEL } from './roleLabels'

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export function TeamMemberRow({
  user,
  isActive,
  canRemove,
  canManage,
}: {
  user: User
  isActive: boolean
  canRemove: boolean
  canManage: boolean
}) {
  const updateUser = useTodoStore((s) => s.updateUser)
  const removeUser = useTodoStore((s) => s.removeUser)
  const setCurrentUser = useTodoStore((s) => s.setCurrentUser)

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user.name)
  const [color, setColor] = useState(user.color)
  const [role, setRole] = useState<Role>(user.role)

  function startEdit() {
    setName(user.name)
    setColor(user.color)
    setRole(user.role)
    setEditing(true)
  }

  function save() {
    const trimmed = name.trim()
    updateUser(user.id, { name: trimmed || user.name, color, role })
    setEditing(false)
  }

  if (editing && canManage) {
    return (
      <li className="flex flex-wrap items-center gap-2 rounded-lg border border-blue-200 bg-blue-50/50 p-2.5 dark:border-blue-900 dark:bg-blue-950/30">
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && save()}
          className="min-w-[8rem] flex-1 rounded border border-slate-200 bg-white px-2 py-1 text-sm outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
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
          className="rounded border border-slate-200 bg-white px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
        >
          {(Object.keys(ROLE_LABEL) as Role[]).map((r) => (
            <option key={r} value={r}>
              {ROLE_LABEL[r]}
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
    <li
      className={`group flex items-center gap-3 rounded-lg border px-2.5 py-2 transition-colors ${
        isActive
          ? 'border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/30'
          : 'border-transparent hover:border-slate-200 hover:bg-white dark:hover:border-slate-800 dark:hover:bg-slate-900'
      }`}
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
        style={{ backgroundColor: user.color }}
      >
        {getInitials(user.name)}
      </span>

      <span className="flex-1 truncate text-sm font-medium text-slate-700 dark:text-slate-200">
        {user.name}
      </span>

      <span
        className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${
          user.role === 'admin'
            ? 'border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-900 dark:bg-purple-950/40 dark:text-purple-300'
            : 'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
        }`}
      >
        {ROLE_LABEL[user.role]}
      </span>

      {isActive ? (
        <span className="shrink-0 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-300">
          Tú ahora
        </span>
      ) : (
        <button
          onClick={() => setCurrentUser(user.id)}
          className="flex shrink-0 items-center gap-1 rounded px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950/40"
        >
          <UserCheck className="h-3.5 w-3.5" />
          Actuar como
        </button>
      )}

      {canManage && (
        <button
          onClick={startEdit}
          className="hidden shrink-0 rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 group-hover:block dark:hover:bg-slate-800"
          aria-label={`Editar ${user.name}`}
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      )}

      {canManage && canRemove && (
        <button
          onClick={() => removeUser(user.id)}
          className="hidden shrink-0 rounded p-1.5 text-slate-400 hover:bg-red-100 hover:text-red-600 group-hover:block dark:hover:bg-red-950/50"
          aria-label={`Eliminar ${user.name}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </li>
  )
}
