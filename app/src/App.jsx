import { useEffect, useMemo, useState } from 'react'
import { useStore } from './state/store'
import useTimer from './state/useTimer'
import { minutesLabel, todayKey } from './lib/time'
import { unlockAudio } from './lib/sound'
import Onboarding from './components/Onboarding'
import TaskList from './components/TaskList'
import TaskDetail from './components/TaskDetail'
import QuickAdd from './components/QuickAdd'
import FocusView from './components/FocusView'
import Reports from './components/Reports'
import Settings from './components/Settings'
import { Icon, ProgressBar, icons } from './components/ui'

const TABS = [
  { id: 'today', label: 'Today' },
  { id: 'future', label: 'Future' },
  { id: 'reports', label: 'Reports' },
]

function Empty({ title, body }) {
  return (
    <div className="card px-6 py-10 text-center">
      <p className="font-display text-2xl">{title}</p>
      <p className="mx-auto mt-2 max-w-xs text-sm text-navy-900/55 dark:text-white/55">{body}</p>
    </div>
  )
}

export default function App() {
  const { state, dispatch, user, syncStatus } = useStore()
  const timer = useTimer()
  const [tab, setTab] = useState('today')
  const [query, setQuery] = useState('')
  const [openTaskId, setOpenTaskId] = useState(null)
  const [quickOpen, setQuickOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const dark = state.settings.theme === 'dark'
  const needsSetup = state.settings.onboardedOn !== todayKey()

  const searching = query.trim().length > 0
  const q = query.trim().toLowerCase()

  const matches = useMemo(
    () =>
      state.tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.notes || '').toLowerCase().includes(q) ||
          (t.subtasks || []).some((s) => s.title.toLowerCase().includes(q)),
      ),
    [state.tasks, q],
  )

  const todays = state.tasks.filter((t) => t.status !== 'future')
  const active = todays.filter((t) => t.status !== 'done')
  const done = todays.filter((t) => t.status === 'done')
  const future = state.tasks.filter((t) => t.status === 'future')

  const totalMin = active.reduce((s, t) => s + t.estMin, 0)
  const pct = todays.length ? (done.length / todays.length) * 100 : 0

  const openTask = state.tasks.find((t) => t.id === openTaskId) || null

  // Space bar pauses and resumes, the way every media player does.
  useEffect(() => {
    const onKey = (e) => {
      const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)
      if (typing) return
      if (e.code === 'Space' && timer.timer) {
        e.preventDefault()
        timer.timer.running ? timer.pause() : timer.resume()
      }
      if (e.key === 'n' && !timer.timer) setQuickOpen(true)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [timer])

  const start = (task) => {
    unlockAudio()
    if (task.status === 'future') dispatch({ type: 'set-status', id: task.id, status: 'focus' })
    timer.start(task.id, state.settings.workMin)
  }

  if (timer.timer) {
    return (
      <FocusView
        timer={timer.timer}
        task={timer.task}
        remaining={timer.remaining}
        total={timer.total}
        onPause={timer.pause}
        onResume={timer.resume}
        onStop={timer.stop}
        onSkip={timer.skip}
        onAddMinutes={timer.addMinutes}
      />
    )
  }

  if (needsSetup) return <Onboarding />

  return (
    <div className="min-h-[100dvh] pb-32">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-[#f4f6fb]/85 backdrop-blur-lg dark:border-white/10 dark:bg-navy-900/85">
        <div className="mx-auto max-w-2xl px-5 pt-4" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
          <div className="flex items-center justify-between gap-3">
            <span className="font-display text-xl tracking-widest text-blue">FLOWDECK</span>
            <div className="flex items-center gap-1.5">
              {user && (
                <span
                  className={`hidden items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide sm:inline-flex ${
                    syncStatus === 'error' ? 'bg-fire/15 text-fire' : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300'
                  }`}
                  title={user.email}
                >
                  <Icon path={icons.cloud} className="h-3 w-3" />
                  {syncStatus === 'syncing' ? 'Syncing' : syncStatus === 'error' ? 'Offline' : 'Synced'}
                </span>
              )}
              <button
                onClick={() => dispatch({ type: 'settings', patch: { theme: dark ? 'light' : 'dark' } })}
                className="btn-ghost !px-2.5 !py-2"
                aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <Icon path={dark ? icons.sun : icons.moon} className="h-4 w-4" />
              </button>
              <button onClick={() => setSettingsOpen(true)} className="btn-ghost !px-2.5 !py-2" aria-label="Settings">
                <Icon path={icons.cog} className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mt-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-navy-900/45 dark:text-white/45">
                Total daily time
              </p>
              <p className="font-display text-4xl leading-none text-navy-900 dark:text-white">
                {minutesLabel(totalMin)}
              </p>
            </div>
            <div className="pb-1 text-right">
              <p className="font-display text-2xl leading-none text-blue">{Math.round(pct)}%</p>
              <p className="text-[11px] text-navy-900/45 dark:text-white/45">{done.length}/{todays.length} done</p>
            </div>
          </div>
          <ProgressBar value={pct} tone={pct >= 100 ? 'gold' : 'blue'} className="mt-2.5" />

          <label className="relative mt-3 block">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-900/35 dark:text-white/35">
              <Icon path={icons.search} className="h-4 w-4" />
            </span>
            <input
              className="field !py-2 !pl-9"
              placeholder="Search all tasks…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {searching && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 py-1 text-xs font-semibold text-navy-900/45 dark:text-white/45"
              >
                Clear
              </button>
            )}
          </label>

          <nav className="-mx-1 mt-3 flex gap-1 pb-2" role="tablist">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => { setTab(t.id); setQuery('') }}
                className={`relative rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  tab === t.id ? 'text-blue' : 'text-navy-900/45 hover:text-navy-900 dark:text-white/45 dark:hover:text-white'
                }`}
              >
                {t.label}
                {t.id === 'future' && future.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-fire/15 px-1.5 py-0.5 text-[10px] text-fire">{future.length}</span>
                )}
                {tab === t.id && <span className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-blue" />}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-5">
        {searching ? (
          <>
            <h2 className="mb-3 font-display text-2xl">
              {matches.length} result{matches.length === 1 ? '' : 's'} for “{query.trim()}”
            </h2>
            <TaskList
              tasks={matches}
              onOpen={(t) => setOpenTaskId(t.id)}
              onStart={start}
              emptyState={<Empty title="Nothing found" body="Try a shorter word, or add it as a new task." />}
            />
          </>
        ) : tab === 'today' ? (
          <div className="space-y-6">
            <section>
              <TaskList
                tasks={active}
                onOpen={(t) => setOpenTaskId(t.id)}
                onStart={start}
                emptyState={
                  <Empty
                    title={done.length ? 'Everything done' : 'Nothing on today'}
                    body={
                      done.length
                        ? 'That is the whole list finished. Go outside.'
                        : 'Tap the gold button to add the first thing you need to do.'
                    }
                  />
                }
              />
            </section>

            {done.length > 0 && (
              <section>
                <h2 className="mb-2.5 text-xs font-semibold uppercase tracking-widest text-navy-900/45 dark:text-white/45">
                  Done today · {done.length}
                </h2>
                <TaskList tasks={done} onOpen={(t) => setOpenTaskId(t.id)} onStart={start} />
              </section>
            )}
          </div>
        ) : tab === 'future' ? (
          <section>
            <p className="mb-3 text-sm text-navy-900/55 dark:text-white/55">
              Things you are not doing today. Hit play on any of them and it moves to Today.
            </p>
            <TaskList
              tasks={future}
              onOpen={(t) => setOpenTaskId(t.id)}
              onStart={start}
              emptyState={<Empty title="Future is empty" body="Park anything here that does not need to happen today." />}
            />
          </section>
        ) : (
          <Reports />
        )}
      </main>

      <QuickAdd open={quickOpen} setOpen={setQuickOpen} defaultStatus={tab === 'future' ? 'future' : 'focus'} />

      {active.length > 0 && (
        <div
          className="fixed inset-x-0 bottom-0 z-20 border-t border-black/5 bg-white/90 px-5 py-3 backdrop-blur-lg dark:border-white/10 dark:bg-navy-800/90"
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          <div className="mx-auto flex max-w-2xl items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-navy-900/45 dark:text-white/45">Up next</p>
              <p className="truncate font-medium">{active[0].title}</p>
            </div>
            <button className="btn-primary shrink-0" onClick={() => start(active[0])}>
              <Icon path={icons.play} className="h-4 w-4" /> Focus {state.settings.workMin}m
            </button>
          </div>
        </div>
      )}

      <TaskDetail task={openTask} onClose={() => setOpenTaskId(null)} onStart={start} />
      <Settings open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}
