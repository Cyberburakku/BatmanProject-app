// The browser is always the source of truth for speed. Supabase, when it is
// configured, is a mirror that lets a second device catch up.
const KEY = 'flowdeck.v1'

export const emptyState = () => ({
  tasks: [],
  log: [],
  settings: {
    theme: 'dark',
    workMin: 25,
    breakMin: 5,
    longBreakMin: 15,
    roundsBeforeLong: 4,
    strict: false,
    sound: true,
    vibrate: true,
    onboardedOn: null,
  },
  lastRoll: null,
  updatedAt: 0,
})

export const load = () => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptyState()
    const parsed = JSON.parse(raw)
    const base = emptyState()
    return {
      ...base,
      ...parsed,
      settings: { ...base.settings, ...(parsed.settings || {}) },
      tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [],
      log: Array.isArray(parsed.log) ? parsed.log : [],
    }
  } catch {
    return emptyState()
  }
}

export const save = (state) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch { /* private mode or a full disk — the app must not crash over it */ }
}

export const uid = () =>
  (crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`)
