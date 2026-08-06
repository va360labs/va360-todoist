import { differenceInCalendarDays, format, isValid, parseISO } from 'date-fns'

export type DeadlineStatus = 'overdue' | 'today' | 'soon' | 'later' | 'none'

export function classifyDeadline(deadline?: string): DeadlineStatus {
  if (!deadline) return 'none'
  const date = parseISO(deadline)
  if (!isValid(date)) return 'none'
  const diff = differenceInCalendarDays(date, new Date())
  if (diff < 0) return 'overdue'
  if (diff === 0) return 'today'
  if (diff <= 3) return 'soon'
  return 'later'
}

export function formatDeadline(deadline?: string): string {
  if (!deadline) return ''
  const date = parseISO(deadline)
  if (!isValid(date)) return ''
  return format(date, 'd MMM')
}

export const DEADLINE_STYLES: Record<DeadlineStatus, string> = {
  overdue: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-950/40 dark:border-red-900',
  today: 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-950/40 dark:border-orange-900',
  soon: 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900',
  later: 'text-slate-600 bg-slate-50 border-slate-200 dark:bg-slate-800/60 dark:border-slate-700',
  none: 'text-slate-400 bg-transparent border-transparent',
}

export const DEADLINE_LABEL: Record<DeadlineStatus, string> = {
  overdue: 'Vencida',
  today: 'Hoy',
  soon: 'Pronto',
  later: '',
  none: '',
}
