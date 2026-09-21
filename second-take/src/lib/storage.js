import content from '../data/content.json'

// Everything the demo remembers lives under this one key in localStorage
// (the browser's own small storage box). No server, no account, no cost.
const STORAGE_KEY = 'second-take-demo-v1'

export function blankState() {
  return {
    version: content.version,
    entries: content.entries.map((entry) => ({ ...entry })),
    quizAnswers: {},
    startingPoint: null,
    completedLessons: [],
    interviewResponses: {},
    activityLog: []
  }
}

export function loadState() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return blankState()
    const parsed = JSON.parse(saved)
    if (parsed.version !== content.version) return blankState()
    return { ...blankState(), ...parsed }
  } catch (err) {
    // A blocked or full localStorage should never break the demo.
    console.warn('Could not read saved data, starting fresh.', err)
    return blankState()
  }
}

export function saveState(state) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch (err) {
    console.warn('Could not save data.', err)
  }
}

export function clearState() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch (err) {
    console.warn('Could not clear saved data.', err)
  }
}

export function makeId(prefix = 'new') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
}

export function logEntry(message) {
  return {
    id: makeId('log'),
    message,
    time: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  }
}
