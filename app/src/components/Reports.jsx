import { useMemo } from 'react'
import { ProgressBar } from './ui'
import { useStore } from '../state/store'
import { WEEKDAYS, dateFromKey, humanDuration, lastNDays, minutesLabel, todayKey } from '../lib/time'

export default function Reports() {
  const { state } = useStore()
  const today = todayKey()

  const todays = state.tasks.filter((t) => t.status !== 'future')
  const done = todays.filter((t) => t.status === 'done')
  const pct = todays.length ? (done.length / todays.length) * 100 : 0
  const estTotal = todays.reduce((s, t) => s + t.estMin, 0)
  const actualSec = todays.reduce((s, t) => s + (t.actualSec || 0), 0)

  const week = useMemo(() => {
    const days = lastNDays(7, today)
    const rows = days.map((key) => {
      const entries = state.log.filter((l) => l.date === key)
      return {
        key,
        label: WEEKDAYS[dateFromKey(key).getDay()],
        count: entries.length,
        estMin: entries.reduce((s, e) => s + (e.estMin || 0), 0),
        actualMin: Math.round(entries.reduce((s, e) => s + (e.actualSec || 0), 0) / 60),
      }
    })
    const peak = Math.max(1, ...rows.map((r) => r.count))
    return { rows, peak }
  }, [state.log, today])

  const tracked = state.tasks.filter((t) => (t.actualSec || 0) > 0 || t.status === 'done')
  const weekTotals = week.rows.reduce(
    (a, r) => ({ count: a.count + r.count, estMin: a.estMin + r.estMin, actualMin: a.actualMin + r.actualMin }),
    { count: 0, estMin: 0, actualMin: 0 },
  )

  return (
    <div className="space-y-4">
      <section className="card p-5">
        <div className="mb-3 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl">Today</h2>
            <p className="text-xs text-navy-900/50 dark:text-white/50">
              {done.length} of {todays.length} done · {minutesLabel(estTotal)} planned
            </p>
          </div>
          <span className="font-display text-5xl leading-none text-blue">{Math.round(pct)}%</span>
        </div>
        <ProgressBar value={pct} tone={pct >= 100 ? 'gold' : 'blue'} className="h-3" />
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl bg-black/5 px-3 py-2 dark:bg-white/5">
            <p className="text-[11px] uppercase tracking-widest text-navy-900/50 dark:text-white/50">Estimated</p>
            <p className="font-display text-2xl">{estTotal}m</p>
          </div>
          <div className="rounded-xl bg-black/5 px-3 py-2 dark:bg-white/5">
            <p className="text-[11px] uppercase tracking-widest text-navy-900/50 dark:text-white/50">Focused</p>
            <p className="font-display text-2xl">{humanDuration(actualSec)}</p>
          </div>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="mb-1 font-display text-2xl">This week</h2>
        <p className="mb-4 text-xs text-navy-900/50 dark:text-white/50">
          {weekTotals.count} task{weekTotals.count === 1 ? '' : 's'} finished · {weekTotals.actualMin}m focused against {weekTotals.estMin}m estimated
        </p>
        <div className="flex h-36 gap-2">
          {week.rows.map((r) => (
            <div key={r.key} className="flex flex-1 flex-col items-center">
              <span className="mb-1 h-4 text-[10px] font-semibold tabular-nums text-navy-900/45 dark:text-white/45">
                {r.count || ''}
              </span>
              {/* A definite-height track, so the bar's percentage has something to measure against. */}
              <div className="relative w-full flex-1 rounded-md bg-black/5 dark:bg-white/5">
                {r.count > 0 && (
                  <div
                    className={`absolute bottom-0 w-full rounded-md transition-[height] duration-500 ${r.key === today ? 'bg-gold' : 'bg-blue'}`}
                    style={{ height: `${Math.max(6, (r.count / week.peak) * 100)}%` }}
                    title={`${r.count} finished · ${r.actualMin}m actual`}
                  />
                )}
              </div>
              <span className={`mt-1.5 text-[10px] ${r.key === today ? 'font-bold text-gold-600 dark:text-gold' : 'text-navy-900/45 dark:text-white/45'}`}>
                {r.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="card p-5">
        <h2 className="mb-1 font-display text-2xl">Estimated vs actual</h2>
        <p className="mb-4 text-xs text-navy-900/50 dark:text-white/50">
          The gap is the useful part — it teaches you what your guesses are worth.
        </p>
        {tracked.length === 0 ? (
          <p className="text-sm text-navy-900/50 dark:text-white/50">
            Run a focus session and the comparison shows up here.
          </p>
        ) : (
          <ul className="space-y-3.5">
            {tracked.map((t) => {
              const actualMin = (t.actualSec || 0) / 60
              const worst = Math.max(t.estMin, actualMin, 1)
              const over = actualMin > t.estMin * 1.1
              return (
                <li key={t.id}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <span className="truncate text-sm font-medium">{t.title}</span>
                    <span className={`shrink-0 font-mono text-xs tabular-nums ${over ? 'text-fire' : 'text-emerald-600 dark:text-emerald-400'}`}>
                      {Math.round(actualMin)}m / {t.estMin}m
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="h-1.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                      <div className="h-full rounded-full bg-blue/50" style={{ width: `${(t.estMin / worst) * 100}%` }} />
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                      <div className={`h-full rounded-full ${over ? 'bg-fire' : 'bg-emerald-500'}`} style={{ width: `${(actualMin / worst) * 100}%` }} />
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
        <p className="mt-4 flex gap-4 text-[11px] text-navy-900/45 dark:text-white/45">
          <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-4 rounded-full bg-blue/50" /> estimated</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-4 rounded-full bg-emerald-500" /> actual</span>
        </p>
      </section>
    </div>
  )
}
