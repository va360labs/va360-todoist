import type { ProjectVisibility, User } from '../types'

export function VisibilityPicker({
  value,
  onChange,
  users,
  currentUserId,
}: {
  value: ProjectVisibility
  onChange: (visibility: ProjectVisibility) => void
  users: User[]
  /** Id of the user making this change — included by default when switching to a restricted allowlist, so they don't lock themselves out. */
  currentUserId: string
}) {
  const restricted = Array.isArray(value)
  const selectedIds = restricted ? value : []

  function toggleUser(id: string) {
    const current = restricted ? value : []
    const next = current.includes(id)
      ? current.filter((memberId) => memberId !== id)
      : [...current, id]
    onChange(next)
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-1 rounded-md border border-slate-200 p-0.5 text-xs dark:border-slate-700">
        <button
          type="button"
          onClick={() => onChange('everyone')}
          aria-pressed={!restricted}
          className={`flex-1 rounded px-2 py-1 font-medium transition-colors ${
            !restricted
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
              : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          Todos
        </button>
        <button
          type="button"
          onClick={() => onChange(restricted ? value : [currentUserId])}
          aria-pressed={restricted}
          className={`flex-1 rounded px-2 py-1 font-medium transition-colors ${
            restricted
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200'
              : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
        >
          Solo estos usuarios
        </button>
      </div>

      {restricted && (
        <ul className="max-h-32 space-y-0.5 overflow-y-auto rounded-md border border-slate-200 p-1 dark:border-slate-700">
          {users.map((u) => (
            <li key={u.id}>
              <label className="flex cursor-pointer items-center gap-2 rounded px-1.5 py-1 text-xs text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(u.id)}
                  onChange={() => toggleUser(u.id)}
                  className="h-3.5 w-3.5 rounded border-slate-300 dark:border-slate-600"
                />
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: u.color }} />
                <span className="flex-1 truncate">{u.name}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
