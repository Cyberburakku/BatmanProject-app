import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { emptyState, load, save, uid } from '../lib/storage'
import { rollOver } from '../lib/recurrence'
import { todayKey } from '../lib/time'
import { pullBoard, pushBoard, supabaseReady, watchAuth, watchBoard } from '../lib/supabase'

const StoreCtx = createContext(null)

const move = (arr, from, to) => {
  const next = arr.slice()
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

const newTask = (p = {}) => ({
  id: uid(),
  title: (p.title || '').trim(),
  estMin: Number.isFinite(p.estMin) ? p.estMin : 25,
  status: p.status || 'focus',
  priority: p.priority || 'normal', // low | normal | high
  due: p.due ?? (p.status === 'future' ? null : todayKey()),
  recur: p.recur || null,
  subtasks: p.subtasks || [],
  actualSec: 0,
  notes: '',
  createdAt: new Date().toISOString(),
  completedAt: null,
  lastReset: null,
})

const touch = (state) => ({ ...state, updatedAt: Date.now() })

function reducer(state, action) {
  switch (action.type) {
    case 'replace':
      return action.state

    case 'add-task':
      return touch({ ...state, tasks: [...state.tasks, newTask(action.task)] })

    case 'add-many': {
      const added = action.tasks.filter((t) => t.title?.trim()).map((t) => newTask(t))
      return touch({ ...state, tasks: [...state.tasks, ...added] })
    }

    case 'update-task':
      return touch({
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.id ? { ...t, ...action.patch } : t)),
      })

    case 'delete-task':
      return touch({ ...state, tasks: state.tasks.filter((t) => t.id !== action.id) })

    case 'reorder':
      return touch({ ...state, tasks: move(state.tasks, action.from, action.to) })

    case 'set-status': {
      const now = new Date().toISOString()
      let log = state.log
      const task = state.tasks.find((t) => t.id === action.id)
      // Only write a history row on the move into "done", so a double tap
      // cannot double count the day.
      if (task && action.status === 'done' && task.status !== 'done') {
        log = [
          ...state.log,
          {
            id: uid(),
            taskId: task.id,
            title: task.title,
            date: todayKey(),
            estMin: task.estMin,
            actualSec: task.actualSec || 0,
            at: now,
          },
        ]
      }
      return touch({
        ...state,
        log,
        tasks: state.tasks.map((t) =>
          t.id === action.id
            ? { ...t, status: action.status, completedAt: action.status === 'done' ? now : null }
            : t,
        ),
      })
    }

    case 'add-subtask':
      return touch({
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id
            ? { ...t, subtasks: [...(t.subtasks || []), { id: uid(), title: action.title.trim(), done: false }] }
            : t,
        ),
      })

    case 'toggle-subtask':
      return touch({
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id
            ? {
                ...t,
                subtasks: (t.subtasks || []).map((s) =>
                  s.id === action.subId ? { ...s, done: !s.done } : s,
                ),
              }
            : t,
        ),
      })

    case 'delete-subtask':
      return touch({
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id
            ? { ...t, subtasks: (t.subtasks || []).filter((s) => s.id !== action.subId) }
            : t,
        ),
      })

    case 'add-time':
      return touch({
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.id ? { ...t, actualSec: (t.actualSec || 0) + action.sec } : t,
        ),
      })

    case 'settings':
      return touch({ ...state, settings: { ...state.settings, ...action.patch } })

    case 'roll': {
      const rolled = rollOver(state.tasks, action.key)
      return { ...state, tasks: rolled, lastRoll: action.key, updatedAt: Date.now() }
    }

    case 'reset-all':
      return touch({ ...emptyState(), settings: state.settings })

    default:
      return state
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, load)
  const [user, setUser] = useState(null)
  const [syncStatus, setSyncStatus] = useState(supabaseReady ? 'signed-out' : 'local')
  const applyingRemote = useRef(false)
  const pushTimer = useRef(null)

  // --- save to the browser on every change -------------------------------
  useEffect(() => { save(state) }, [state])

  // --- roll recurring tasks over when the date changes -------------------
  useEffect(() => {
    const check = () => {
      const key = todayKey()
      if (state.lastRoll !== key) dispatch({ type: 'roll', key })
    }
    check()
    const id = setInterval(check, 60_000)
    const onVisible = () => { if (!document.hidden) check() }
    document.addEventListener('visibilitychange', onVisible)
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVisible) }
  }, [state.lastRoll])

  // --- theme -------------------------------------------------------------
  useEffect(() => {
    const dark = state.settings.theme === 'dark'
    document.documentElement.classList.toggle('dark', dark)
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#0A0E1A' : '#f4f6fb')
  }, [state.settings.theme])

  // --- Supabase auth -----------------------------------------------------
  useEffect(() => {
    if (!supabaseReady) return
    return watchAuth(setUser)
  }, [])

  // --- first pull + realtime watch --------------------------------------
  useEffect(() => {
    if (!supabaseReady) return
    if (!user) { setSyncStatus('signed-out'); return }
    let cancelled = false

    ;(async () => {
      setSyncStatus('syncing')
      try {
        const remote = await pullBoard(user.id)
        if (cancelled) return
        // Whichever side was edited most recently wins. Anything else risks
        // silently throwing away work the user can still remember doing.
        if (remote && (remote.updatedAt || 0) > (state.updatedAt || 0)) {
          applyingRemote.current = true
          dispatch({ type: 'replace', state: { ...emptyState(), ...remote } })
        } else {
          await pushBoard(user.id, state)
        }
        setSyncStatus('synced')
      } catch (err) {
        console.warn('Sync failed', err)
        setSyncStatus('error')
      }
    })()

    const stop = watchBoard(user.id, (remote) => {
      if ((remote.updatedAt || 0) > (state.updatedAt || 0)) {
        applyingRemote.current = true
        dispatch({ type: 'replace', state: { ...emptyState(), ...remote } })
      }
    })
    return () => { cancelled = true; stop() }
    // Intentionally keyed on the user only: re-running on every keystroke
    // would re-pull the board mid-edit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  // --- debounced push ----------------------------------------------------
  useEffect(() => {
    if (!supabaseReady || !user) return
    if (applyingRemote.current) { applyingRemote.current = false; return }
    clearTimeout(pushTimer.current)
    pushTimer.current = setTimeout(async () => {
      try {
        setSyncStatus('syncing')
        await pushBoard(user.id, state)
        setSyncStatus('synced')
      } catch (err) {
        console.warn('Push failed', err)
        setSyncStatus('error')
      }
    }, 900)
    return () => clearTimeout(pushTimer.current)
  }, [state, user])

  const value = useMemo(() => ({ state, dispatch, user, syncStatus }), [state, user, syncStatus])
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export const useStore = () => {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}
