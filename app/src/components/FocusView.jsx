import { useEffect, useRef, useState } from 'react'
import { Icon, ProgressBar, icons } from './ui'
import { useStore } from '../state/store'
import { clock, humanDuration } from '../lib/time'

const HOLD_MS = 1200

/**
 * One task, one number. Strict Mode makes leaving deliberate: the exit needs a
 * press and hold, the tab warns before it closes, and nothing else is on screen.
 */
export default function FocusView({ timer, task, remaining, total, onPause, onResume, onStop, onSkip, onAddMinutes }) {
  const { state, dispatch } = useStore()
  const strict = state.settings.strict
  const [holding, setHolding] = useState(0)
  const holdRef = useRef(null)

  const isBreak = timer.mode === 'break'
  const pct = total > 0 ? ((total - remaining) / total) * 100 : 0
  const finished = remaining <= 0

  // Warn before the tab closes mid-session, but only in Strict Mode — an
  // unasked-for "are you sure" dialog is its own kind of friction.
  useEffect(() => {
    if (!strict || !timer.running) return
    const onBefore = (e) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', onBefore)
    return () => window.removeEventListener('beforeunload', onBefore)
  }, [strict, timer.running])

  useEffect(() => {
    document.title = timer ? `${clock(remaining)} · ${isBreak ? 'Break' : task?.title || 'Focus'}` : 'FlowDeck'
    return () => { document.title = 'FlowDeck' }
  }, [remaining, isBreak, task?.title, timer])

  const startHold = () => {
    const began = Date.now()
    holdRef.current = setInterval(() => {
      const p = Math.min(100, ((Date.now() - began) / HOLD_MS) * 100)
      setHolding(p)
      if (p >= 100) { clearInterval(holdRef.current); setHolding(0); onStop() }
    }, 40)
  }
  const endHold = () => { clearInterval(holdRef.current); setHolding(0) }
  useEffect(() => () => clearInterval(holdRef.current), [])

  const subs = task?.subtasks || []

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-navy-900 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background: isBreak
            ? 'radial-gradient(ellipse at 50% -10%, rgba(255,107,0,.20), transparent 60%)'
            : 'radial-gradient(ellipse at 50% -10%, rgba(0,163,255,.22), transparent 60%)',
        }}
      />

      <div className="relative flex items-center justify-between px-5 pt-5" style={{ paddingTop: 'max(1.25rem, env(safe-area-inset-top))' }}>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
          {isBreak ? 'Break' : `Round ${timer.round}`}
        </span>
        <button
          onClick={() => dispatch({ type: 'settings', patch: { strict: !strict } })}
          className={`tag ${strict ? 'bg-gold text-navy-900' : 'bg-white/10 text-white/60'}`}
        >
          <Icon path={icons.lock} className="h-3 w-3" /> Strict {strict ? 'on' : 'off'}
        </button>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center">
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
          {isBreak ? 'Step away from the screen' : 'Focusing on'}
        </p>
        <h1 className="mb-8 max-w-md font-display text-3xl leading-tight text-white sm:text-4xl">
          {isBreak ? 'Rest' : task?.title || 'Focus session'}
        </h1>

        <div
          className={`font-mono text-[19vw] font-bold leading-none tabular-nums sm:text-[8rem] ${
            finished ? 'animate-pulse text-gold' : isBreak ? 'text-fire' : 'text-white'
          }`}
        >
          {clock(remaining)}
        </div>

        <div className="mt-8 w-full max-w-sm">
          <ProgressBar value={pct} tone={isBreak ? 'fire' : 'blue'} />
          <div className="mt-2 flex justify-between text-[11px] text-white/40">
            <span>{isBreak ? `${Math.round(total / 60)} min break` : `${Math.round(total / 60)} min block`}</span>
            {task?.actualSec > 0 && <span>Total on task: {humanDuration(task.actualSec)}</span>}
          </div>
        </div>

        {finished && (
          <p className="mt-6 font-display text-2xl text-gold">
            {timer.justEnded === 'work' ? 'Block done — take the break' : 'Break over — back to it'}
          </p>
        )}

        {!isBreak && subs.length > 0 && (
          <ul className="mt-8 w-full max-w-sm space-y-2 text-left">
            {subs.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => dispatch({ type: 'toggle-subtask', id: task.id, subId: s.id })}
                  className="flex w-full items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5 text-left transition hover:bg-white/10"
                >
                  <span className={`grid h-5 w-5 shrink-0 place-items-center rounded border-2 ${s.done ? 'border-emerald-400 bg-emerald-400 text-navy-900' : 'border-white/30 text-transparent'}`}>
                    <Icon path={icons.check} className="h-3 w-3" />
                  </span>
                  <span className={`text-sm ${s.done ? 'line-through opacity-50' : ''}`}>{s.title}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="relative px-5 pb-6" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
        <div className="mx-auto flex max-w-sm flex-col gap-3">
          <div className="flex items-center justify-center gap-3">
            <button className="btn bg-white/10 text-white hover:bg-white/20 !px-3 !py-2 text-sm" onClick={() => onAddMinutes(5)}>
              +5 min
            </button>
            {timer.running ? (
              <button className="btn-gold flex-1 !py-3.5 text-base" onClick={onPause}>
                <Icon path={icons.pause} className="h-5 w-5" /> Pause
              </button>
            ) : (
              <button className="btn-primary flex-1 !py-3.5 text-base" onClick={onResume}>
                <Icon path={icons.play} className="h-5 w-5" /> {finished ? (isBreak ? 'Start break' : 'Start next block') : 'Resume'}
              </button>
            )}
            <button className="btn bg-white/10 text-white hover:bg-white/20 !px-3 !py-2 text-sm" onClick={onSkip}>
              Skip
            </button>
          </div>

          {task && !isBreak && (
            <button
              className="btn bg-emerald-500 text-white hover:bg-emerald-600 !py-3"
              onClick={() => { dispatch({ type: 'set-status', id: task.id, status: 'done' }); onStop() }}
            >
              <Icon path={icons.check} className="h-4 w-4" /> Task finished
            </button>
          )}

          {strict ? (
            <button
              onPointerDown={startHold}
              onPointerUp={endHold}
              onPointerLeave={endHold}
              onPointerCancel={endHold}
              className="relative overflow-hidden rounded-xl border border-white/15 py-3 text-sm font-semibold text-white/60"
              style={{ touchAction: 'none' }}
            >
              <span className="absolute inset-y-0 left-0 bg-fire/40 transition-[width] duration-75" style={{ width: `${holding}%` }} />
              <span className="relative">{holding > 0 ? 'Keep holding to leave…' : 'Press and hold to leave'}</span>
            </button>
          ) : (
            <button onClick={onStop} className="py-2 text-sm font-medium text-white/45 hover:text-white">
              End session
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
