// Everything the app remembers lives under this one key in localStorage
// (the browser's own small storage box). No server, no account, no cost.
const STORAGE_KEY = 'second-take-mvp-v1'
const UNLOCK_HOURS_KEY = 'second-take-skip-wait'

export function blankState() {
  return {
    version: 1,
    name: '',
    quizAnswers: {},
    scores: null,
    completed: {},      // lesson key -> ISO timestamp of completion
    lessonInputs: {},   // lesson key -> { fieldId: text }
    interviewResponses: {},
    checklist: {},      // checklist item index -> true
    certificates: {}    // module id -> ISO date issued
  }
}

export function loadState() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (!saved) return blankState()
    const parsed = JSON.parse(saved)
    if (parsed.version !== 1) return blankState()
    return { ...blankState(), ...parsed }
  } catch (err) {
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

// Demo switch for the 24-hour lesson wait. Kept under its own key so
// "Start over" does not silently turn it back on.
export function readSkipWait() {
  try {
    return window.localStorage.getItem(UNLOCK_HOURS_KEY) === 'true'
  } catch {
    return false
  }
}

export function writeSkipWait(value) {
  try {
    window.localStorage.setItem(UNLOCK_HOURS_KEY, value ? 'true' : 'false')
  } catch (err) {
    console.warn('Could not save the demo setting.', err)
  }
}
