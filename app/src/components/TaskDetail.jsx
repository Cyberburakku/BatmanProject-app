import { useEffect, useState } from 'react'
import { Icon, PRIORITY, Segmented, Sheet, icons } from './ui'
import { useStore } from '../state/store'
import { WEEKDAYS, humanDuration, todayKey } from '../lib/time'

const STATUS_OPTS = [
  { value: 'focus', label: 'Focus' },
  { value: 'future', label: 'Future' },
  { value: 'done', label: 'Done' },
]

export default function TaskDetail({ task, onClose, onStart }) {
  const { dispatch } = useStore()
  const [sub, setSub] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => { setConfirmDelete(false); setSub('') }, [task?.id])

  if (!task) return null
  const patch = (p) => dispatch({ type: 'update-task', id: task.id, patch: p })
  const recur = task.recur

  const setRecurType = (type) => {
    if (!type) return patch({ recur: null })
    if (type === 'daily') return patch({ recur: { type: 'daily' } })
    if (type === 'weekly') {
      return patch({ recur: { type: 'weekly', days: recur?.days?.length ? recur.days : [new Date().getDay()] } })
    }
    return patch({ recur: { type: 'custom', everyN: recur?.everyN || 3, anchor: todayKey() } })
  }

  const toggleWeekday = (d) => {
    const days = new Set(recur?.days || [])
    days.has(d) ? days.delete(d) : days.add(d)
    patch({ recur: { type: 'weekly', days: [...days].sort() } })
  }

  const addSub = (e) => {
    e.preventDefault()
    if (!sub.trim()) return
    dispatch({ type: 'add-subtask', id: task.id, title: sub })
    setSub('')
  }

  const subs = task.subtasks || []

  return (
    <Sheet
      open={!!task}
      onClose={onClose}
      title="Task"
      footer={
        <div className="flex gap-2">
          {task.status !== 'done' && (
            <button className="btn-primary flex-1" onClick={() => { onStart(task); onClose() }}>
              <Icon path={icons.play} className="h-4 w-4" /> Focus on this
            </button>
          )}
          <button
            className={`btn ${confirmDelete ? 'bg-fire text-white' : 'btn-ghost'}`}
            onClick={() => {
              if (!confirmDelete) return setConfirmDelete(true)
              dispatch({ type: 'delete-task', id: task.id })
              onClose()
            }}
          >
            <Icon path={icons.trash} className="h-4 w-4" />
            {confirmDelete ? 'Tap again to delete' : ''}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-navy-900/50 dark:text-white/50">
            Task name
          </label>
          <input className="field" value={task.title} onChange={(e) => patch({ title: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-navy-900/50 dark:text-white/50">
              Estimate (min)
            </label>
            <input
              type="number" min="1" max="600" inputMode="numeric" className="field"
              value={task.estMin}
              onChange={(e) => patch({ estMin: Math.max(1, Number(e.target.value) || 1) })}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-navy-900/50 dark:text-white/50">
              Due date
            </label>
            <input type="date" className="field" value={task.due || ''} onChange={(e) => patch({ due: e.target.value || null })} />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-navy-900/50 dark:text-white/50">
            Status
          </label>
          <Segmented
            className="w-full"
            value={task.status}
            options={STATUS_OPTS}
            onChange={(v) => dispatch({ type: 'set-status', id: task.id, status: v })}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-navy-900/50 dark:text-white/50">
            Priority
          </label>
          <div className="flex gap-2">
            {['high', 'normal', 'low'].map((p) => (
              <button
                key={p}
                onClick={() => patch({ priority: p })}
                className={`btn flex-1 !py-2 text-sm ${
                  task.priority === p ? 'bg-blue text-white' : 'btn-ghost'
                }`}
              >
                <span className={`h-2 w-2 rounded-full ${PRIORITY[p].dot}`} />
                {PRIORITY[p].label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-navy-900/50 dark:text-white/50">
            <Icon path={icons.repeat} className="h-3.5 w-3.5" /> Repeats
          </label>
          <Segmented
            className="w-full"
            value={recur?.type || 'none'}
            options={[
              { value: 'none', label: 'Never' },
              { value: 'daily', label: 'Daily' },
              { value: 'weekly', label: 'Weekly' },
              { value: 'custom', label: 'Custom' },
            ]}
            onChange={(v) => setRecurType(v === 'none' ? null : v)}
          />
          {recur?.type === 'weekly' && (
            <div className="mt-3 flex gap-1.5">
              {WEEKDAYS.map((name, d) => (
                <button
                  key={d}
                  onClick={() => toggleWeekday(d)}
                  className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${
                    (recur.days || []).includes(d)
                      ? 'bg-blue text-white'
                      : 'bg-black/5 text-navy-900/60 dark:bg-white/10 dark:text-white/60'
                  }`}
                >
                  {name[0]}
                </button>
              ))}
            </div>
          )}
          {recur?.type === 'custom' && (
            <label className="mt-3 flex items-center gap-2 text-sm">
              Every
              <input
                type="number" min="1" max="365" inputMode="numeric" className="field !w-20 !py-1.5 text-center"
                value={recur.everyN}
                onChange={(e) => patch({ recur: { ...recur, everyN: Math.max(1, Number(e.target.value) || 1) } })}
              />
              days
            </label>
          )}
          {recur && (
            <p className="mt-2 text-xs text-navy-900/45 dark:text-white/45">
              When a repeating task is due it comes back automatically, with its checklist reset.
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-navy-900/50 dark:text-white/50">
            Checklist {subs.length > 0 && <span className="text-blue">{subs.filter((s) => s.done).length}/{subs.length}</span>}
          </label>
          <ul className="space-y-1.5">
            {subs.map((s) => (
              <li key={s.id} className="flex items-center gap-2.5">
                <button
                  onClick={() => dispatch({ type: 'toggle-subtask', id: task.id, subId: s.id })}
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded border-2 transition ${
                    s.done ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-navy-900/20 text-transparent dark:border-white/25'
                  }`}
                  aria-label={s.done ? 'Undo step' : 'Complete step'}
                >
                  <Icon path={icons.check} className="h-3 w-3" />
                </button>
                <span className={`flex-1 text-sm ${s.done ? 'line-through opacity-50' : ''}`}>{s.title}</span>
                <button
                  onClick={() => dispatch({ type: 'delete-subtask', id: task.id, subId: s.id })}
                  className="text-navy-900/30 hover:text-fire dark:text-white/30"
                  aria-label="Remove step"
                >
                  <Icon path={icons.trash} className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
          <form onSubmit={addSub} className="mt-2 flex gap-2">
            <input className="field" placeholder="Add a step…" value={sub} onChange={(e) => setSub(e.target.value)} />
            <button className="btn-ghost !px-3" type="submit" aria-label="Add step">
              <Icon path={icons.plus} className="h-4 w-4" />
            </button>
          </form>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-navy-900/50 dark:text-white/50">
            Notes
          </label>
          <textarea
            className="field min-h-[80px] resize-y"
            placeholder="Anything you need to remember…"
            value={task.notes || ''}
            onChange={(e) => patch({ notes: e.target.value })}
          />
        </div>

        <p className="text-xs text-navy-900/45 dark:text-white/45">
          Estimated {task.estMin} min · time actually spent {humanDuration(task.actualSec || 0)}
        </p>
      </div>
    </Sheet>
  )
}
