import type { SelectHTMLAttributes } from 'react'
import { useTodoStore } from '../store'

const DEFAULT_CLASS =
  'rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'

type AssigneePickerProps = {
  value?: string
  onChange: (userId: string | undefined) => void
  allowUnassigned?: boolean
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value' | 'onChange'>

/** Selector reutilizable de persona asignada, respaldado por `users` del store. */
export function AssigneePicker({
  value,
  onChange,
  allowUnassigned = true,
  className,
  ...rest
}: AssigneePickerProps) {
  const users = useTodoStore((s) => s.users)

  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value || undefined)}
      className={className ?? DEFAULT_CLASS}
      {...rest}
    >
      {allowUnassigned && <option value="">Sin asignar</option>}
      {users.map((u) => (
        <option key={u.id} value={u.id} style={{ color: u.color }}>
          ● {u.name}
        </option>
      ))}
    </select>
  )
}
