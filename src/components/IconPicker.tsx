import { PROJECT_ICON_NAMES, ProjectIconGlyph } from '../lib/icons'

export function IconPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (icon: string) => void
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {PROJECT_ICON_NAMES.map((name) => (
        <button
          type="button"
          key={name}
          onClick={() => onChange(name)}
          className={`flex h-7 w-7 items-center justify-center rounded-md border transition-colors ${
            value === name
              ? 'border-blue-400 bg-blue-100 text-blue-700 dark:border-blue-500 dark:bg-blue-900/50 dark:text-blue-300'
              : 'border-slate-200 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
          }`}
          aria-label={`Icono ${name}`}
          aria-pressed={value === name}
        >
          <ProjectIconGlyph icon={name} className="h-4 w-4" />
        </button>
      ))}
    </div>
  )
}
