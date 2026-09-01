import { todayKey, dateFromKey, addDays } from './time'

// A recurrence is stored as:
//   { type: 'daily' }
//   { type: 'weekly', days: [1,3,5] }        // 0 = Sunday
//   { type: 'custom', everyN: 3 }            // every 3 days from the anchor
export const recurrenceLabel = (r) => {
  if (!r) return null
  if (r.type === 'daily') return 'Every day'
  if (r.type === 'weekly') {
    const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    if (!r.days?.length) return 'Weekly'
    return r.days.map((d) => names[d]).join(', ')
  }
  if (r.type === 'custom') return `Every ${r.everyN} days`
  return null
}

/** Should a recurring task appear on `key`? */
export const dueOn = (task, key = todayKey()) => {
  const r = task.recur
  if (!r) return false
  if (r.type === 'daily') return true
  if (r.type === 'weekly') return (r.days || []).includes(dateFromKey(key).getDay())
  if (r.type === 'custom') {
    const n = Math.max(1, r.everyN || 1)
    const anchor = r.anchor || task.createdAt?.slice(0, 10) || key
    const days = Math.round((dateFromKey(key) - dateFromKey(anchor)) / 86400000)
    return days >= 0 && days % n === 0
  }
  return false
}

/**
 * Called once whenever the app notices the date has changed. Recurring tasks that
 * are due today come back to life; a fresh copy of their checklist, no carried-over
 * time. Non-recurring finished tasks just stay finished.
 */
export const rollOver = (tasks, key = todayKey()) =>
  tasks.map((t) => {
    if (!t.recur) return t
    if (t.lastReset === key) return t
    if (!dueOn(t, key)) return t
    return {
      ...t,
      status: 'focus',
      actualSec: 0,
      completedAt: null,
      lastReset: key,
      due: key,
      subtasks: (t.subtasks || []).map((s) => ({ ...s, done: false })),
    }
  })

export const nextOccurrence = (task, from = todayKey()) => {
  if (!task.recur) return null
  for (let i = 1; i <= 366; i++) {
    const k = addDays(from, i)
    if (dueOn(task, k)) return k
  }
  return null
}
