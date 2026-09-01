// Formats and small date helpers. Everything is local-time based on purpose:
// "today" should mean the user's today, not UTC's.

export const todayKey = (d = new Date()) => {
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export const dateFromKey = (key) => {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const addDays = (key, n) => {
  const d = dateFromKey(key)
  d.setDate(d.getDate() + n)
  return todayKey(d)
}

/** Last 7 day-keys, oldest first, ending today. */
export const lastNDays = (n, end = todayKey()) =>
  Array.from({ length: n }, (_, i) => addDays(end, -(n - 1 - i)))

/** 3600 -> "60:00". Minutes are never truncated to an hour column. */
export const clock = (totalSec) => {
  const s = Math.max(0, Math.round(totalSec))
  const m = Math.floor(s / 60)
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

/** 75 -> "75 min (1.3 hrs)" */
export const minutesLabel = (min) => {
  const hrs = min / 60
  if (min < 60) return `${min} min`
  return `${min} min (${hrs.toFixed(1)} hrs)`
}

/** 4530 seconds -> "1h 15m", 300 -> "5m", 40 -> "40s" */
export const humanDuration = (sec) => {
  const s = Math.round(sec)
  if (s < 60) return `${s}s`
  const m = Math.round(s / 60)
  if (m < 60) return `${m}m`
  return `${Math.floor(m / 60)}h ${m % 60}m`
}

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export const dueLabel = (key) => {
  if (!key) return null
  const t = todayKey()
  if (key === t) return 'Today'
  if (key === addDays(t, 1)) return 'Tomorrow'
  if (key === addDays(t, -1)) return 'Yesterday'
  const d = dateFromKey(key)
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()}/${d.getMonth() + 1}`
}

export const isOverdue = (key) => !!key && key < todayKey()
