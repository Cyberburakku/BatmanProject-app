import { useMemo, useRef, useState } from 'react'
import { useStore } from '../state/store'
import { minutesLabel, todayKey } from '../lib/time'
import { ProgressBar } from './ui'

const ROWS = 5
const QUICK = [10, 15, 25, 45, 60]

/**
 * Two steps and you are working. Step one asks for names only, because deciding
 * what to do and deciding how long it takes are different kinds of thinking and
 * mixing them is what makes planning feel slow.
 */
export default function Onboarding() {
  const { state, dispatch } = useStore()
  const [step, setStep] = useState(1)
  const [rows, setRows] = useState(() => Array.from({ length: ROWS }, () => ({ title: '', estMin: 25 })))
  const inputs = useRef([])

  const filled = useMemo(() => rows.filter((r) => r.title.trim()), [rows])
  const total = filled.reduce((s, r) => s + (Number(r.estMin) || 0), 0)

  const setRow = (i, patch) => setRows((rs) => rs.map((r, j) => (i === j ? { ...r, ...patch } : r)))

  const finish = () => {
    if (filled.length) {
      dispatch({
        type: 'add-many',
        tasks: filled.map((r) => ({
          title: r.title,
          estMin: Math.max(1, Number(r.estMin) || 25),
          status: 'focus',
          due: todayKey(),
        })),
      })
    }
    dispatch({ type: 'settings', patch: { onboardedOn: todayKey() } })
  }

  const skip = () => dispatch({ type: 'settings', patch: { onboardedOn: todayKey() } })

  const onNameKey = (e, i) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    if (i < ROWS - 1) inputs.current[i + 1]?.focus()
    else if (filled.length) setStep(2)
  }

  const greeting = (() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  })()

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col px-5 pb-8 pt-10">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-display text-xl tracking-widest text-blue">FLOWDECK</span>
        <span className="text-xs font-semibold uppercase tracking-widest text-navy-900/40 dark:text-white/40">
          Step {step} of 2
        </span>
      </div>
      <ProgressBar value={step === 1 ? 50 : 100} className="mb-8" />

      {step === 1 ? (
        <>
          <p className="text-sm font-semibold uppercase tracking-widest text-fire">{greeting}</p>
          <h1 className="mt-1 font-display text-5xl leading-none sm:text-6xl">What must you do today?</h1>
          <p className="mt-3 text-sm text-navy-900/60 dark:text-white/55">
            Up to five things. You can add more later — this is just the shortlist that matters.
          </p>

          <div className="mt-7 space-y-2.5">
            {rows.map((r, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-6 shrink-0 font-display text-2xl text-navy-900/25 dark:text-white/25">{i + 1}</span>
                <input
                  ref={(el) => { inputs.current[i] = el }}
                  className="field"
                  value={r.title}
                  autoFocus={i === 0}
                  enterKeyHint={i === ROWS - 1 ? 'done' : 'next'}
                  placeholder={i === 0 ? 'e.g. Finish the client proposal' : 'Add another…'}
                  onChange={(e) => setRow(i, { title: e.target.value })}
                  onKeyDown={(e) => onNameKey(e, i)}
                />
              </div>
            ))}
          </div>

          <div className="mt-auto pt-8">
            <button className="btn-primary w-full !py-3.5 text-base" disabled={!filled.length} onClick={() => setStep(2)}>
              Next — set the time
            </button>
            <button onClick={skip} className="mt-3 w-full text-sm font-medium text-navy-900/45 hover:text-navy-900 dark:text-white/45 dark:hover:text-white">
              Skip for now
            </button>
          </div>
        </>
      ) : (
        <>
          <h1 className="font-display text-5xl leading-none sm:text-6xl">How long will each take?</h1>
          <p className="mt-3 text-sm text-navy-900/60 dark:text-white/55">
            A rough guess is fine. The app compares it to reality later, and your guesses get sharper.
          </p>

          <div className="card mt-6 flex items-baseline justify-between px-4 py-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-navy-900/50 dark:text-white/50">
              Total daily time
            </span>
            <span className="font-display text-3xl text-blue">{minutesLabel(total)}</span>
          </div>

          <div className="mt-5 space-y-3">
            {filled.map((r) => {
              const i = rows.indexOf(r)
              return (
                <div key={i} className="card p-3.5">
                  <p className="mb-2.5 font-medium">{r.title}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    {QUICK.map((m) => (
                      <button
                        key={m}
                        onClick={() => setRow(i, { estMin: m })}
                        className={`rounded-lg px-2.5 py-1.5 text-sm font-semibold transition ${
                          Number(r.estMin) === m
                            ? 'bg-blue text-white'
                            : 'bg-black/5 text-navy-900/70 hover:bg-black/10 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/20'
                        }`}
                      >
                        {m}m
                      </button>
                    ))}
                    <label className="ml-auto flex items-center gap-1.5 text-sm">
                      <input
                        type="number"
                        min="1"
                        max="600"
                        inputMode="numeric"
                        className="field !w-20 !px-2 !py-1.5 text-right"
                        value={r.estMin}
                        onChange={(e) => setRow(i, { estMin: e.target.value === '' ? '' : Number(e.target.value) })}
                      />
                      <span className="text-navy-900/50 dark:text-white/50">min</span>
                    </label>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-auto pt-8">
            <button className="btn-gold w-full !py-3.5 text-base" onClick={finish}>
              Start my day
            </button>
            <button onClick={() => setStep(1)} className="mt-3 w-full text-sm font-medium text-navy-900/45 hover:text-navy-900 dark:text-white/45 dark:hover:text-white">
              Back
            </button>
          </div>
        </>
      )}
      {state.tasks.length > 0 && (
        <p className="mt-4 text-center text-xs text-navy-900/40 dark:text-white/40">
          Your existing {state.tasks.length} task{state.tasks.length === 1 ? '' : 's'} are safe — these get added to them.
        </p>
      )}
    </div>
  )
}
