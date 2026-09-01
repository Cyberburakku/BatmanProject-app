import { useCallback, useEffect, useRef, useState } from 'react'
import { useStore } from './store'
import { alertEnd, unlockAudio } from '../lib/sound'

const KEY = 'flowdeck.timer.v1'

const loadTimer = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null') } catch { return null }
}

/**
 * A countdown that survives a refresh and a backgrounded tab, because it stores
 * the moment it should finish rather than counting ticks. A phone that sleeps for
 * ten minutes wakes up with the correct time left.
 */
export default function useTimer() {
  const { state, dispatch } = useStore()
  const { workMin, breakMin, longBreakMin, roundsBeforeLong, sound, vibrate } = state.settings

  const [timer, setTimer] = useState(() => loadTimer())
  const [now, setNow] = useState(() => Date.now())
  const uncommitted = useRef(0)
  const lastTick = useRef(Date.now())
  const firedFor = useRef(null)

  useEffect(() => {
    if (timer) localStorage.setItem(KEY, JSON.stringify(timer))
    else localStorage.removeItem(KEY)
  }, [timer])

  const durationFor = useCallback(
    (mode, round) => {
      if (mode === 'break') {
        const isLong = roundsBeforeLong > 0 && round % roundsBeforeLong === 0
        return (isLong ? longBreakMin : breakMin) * 60
      }
      return workMin * 60
    },
    [workMin, breakMin, longBreakMin, roundsBeforeLong],
  )

  const remaining = (() => {
    if (!timer) return 0
    if (!timer.running) return Math.max(0, timer.leftSec ?? 0)
    return Math.max(0, Math.round((timer.endAt - now) / 1000))
  })()

  const commit = useCallback(() => {
    const whole = Math.floor(uncommitted.current)
    if (whole > 0 && timer?.taskId) {
      dispatch({ type: 'add-time', id: timer.taskId, sec: whole })
      uncommitted.current -= whole
    }
  }, [dispatch, timer?.taskId])

  // one heartbeat, driving both the display and the time-on-task tally
  useEffect(() => {
    const tick = () => {
      const t = Date.now()
      const deltaSec = (t - lastTick.current) / 1000
      lastTick.current = t
      setNow(t)
      if (timer?.running && timer.mode === 'work' && deltaSec > 0 && deltaSec < 300) {
        uncommitted.current += deltaSec
        if (uncommitted.current >= 10) commit()
      }
    }
    lastTick.current = Date.now()
    const id = setInterval(tick, 500)
    const onVisible = () => tick()
    document.addEventListener('visibilitychange', onVisible)
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', onVisible) }
  }, [timer?.running, timer?.mode, commit])

  // session finished
  useEffect(() => {
    if (!timer?.running || remaining > 0) return
    const stamp = `${timer.mode}-${timer.endAt}`
    if (firedFor.current === stamp) return
    firedFor.current = stamp

    commit()
    alertEnd({ sound, vibrate, kind: timer.mode === 'work' ? 'work-end' : 'break-end' })

    if (timer.mode === 'work') {
      const round = timer.round
      const secs = durationFor('break', round)
      setTimer({ ...timer, mode: 'break', round, running: false, leftSec: secs, endAt: Date.now() + secs * 1000, justEnded: 'work' })
    } else {
      const secs = durationFor('work', timer.round + 1)
      setTimer({ ...timer, mode: 'work', round: timer.round + 1, running: false, leftSec: secs, endAt: Date.now() + secs * 1000, justEnded: 'break' })
    }
  }, [remaining, timer, commit, durationFor, sound, vibrate])

  const start = useCallback((taskId, minutes) => {
    unlockAudio()
    const secs = Math.max(1, Math.round((minutes ?? workMin) * 60))
    uncommitted.current = 0
    lastTick.current = Date.now()
    firedFor.current = null
    setTimer({ taskId, mode: 'work', round: 1, running: true, endAt: Date.now() + secs * 1000, leftSec: secs, justEnded: null })
  }, [workMin])

  const pause = useCallback(() => {
    commit()
    setTimer((t) => (t && t.running ? { ...t, running: false, leftSec: Math.max(0, Math.round((t.endAt - Date.now()) / 1000)) } : t))
  }, [commit])

  const resume = useCallback(() => {
    unlockAudio()
    lastTick.current = Date.now()
    firedFor.current = null
    setTimer((t) => (t && !t.running ? { ...t, running: true, endAt: Date.now() + (t.leftSec ?? 0) * 1000, justEnded: null } : t))
  }, [])

  const stop = useCallback(() => {
    commit()
    setTimer(null)
  }, [commit])

  /** Jump straight to the next block without waiting it out. */
  const skip = useCallback(() => {
    commit()
    setTimer((t) => {
      if (!t) return t
      firedFor.current = null
      if (t.mode === 'work') {
        const secs = durationFor('break', t.round)
        return { ...t, mode: 'break', running: true, endAt: Date.now() + secs * 1000, leftSec: secs, justEnded: null }
      }
      const secs = durationFor('work', t.round + 1)
      return { ...t, mode: 'work', round: t.round + 1, running: true, endAt: Date.now() + secs * 1000, leftSec: secs, justEnded: null }
    })
  }, [commit, durationFor])

  const addMinutes = useCallback((mins) => {
    setTimer((t) => {
      if (!t) return t
      firedFor.current = null
      const extra = mins * 60 * 1000
      return t.running
        ? { ...t, endAt: t.endAt + extra }
        : { ...t, leftSec: Math.max(0, (t.leftSec ?? 0) + mins * 60) }
    })
  }, [])

  const total = timer ? durationFor(timer.mode, timer.round) : 0
  const task = timer ? state.tasks.find((t) => t.id === timer.taskId) : null

  return { timer, task, remaining, total, start, pause, resume, stop, skip, addMinutes }
}
