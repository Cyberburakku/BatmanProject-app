import { Icon, PRIORITY, STATUS, icons } from './ui'
import { clock, dueLabel, humanDuration, isOverdue } from '../lib/time'
import { recurrenceLabel } from '../lib/recurrence'

export default function TaskRow({ task, onOpen, onStart, onToggleDone, dragHandle, style, setRef, dimmed }) {
  const done = task.status === 'done'
  const subs = task.subtasks || []
  const subsDone = subs.filter((s) => s.done).length
  // Being in today's list already communicates "today"; repeating it on every row is noise.
  const dueRaw = dueLabel(task.due)
  const due = dueRaw === 'Today' ? null : dueRaw
  const overdue = !done && isOverdue(task.due)
  const rec = recurrenceLabel(task.recur)

  return (
    <li ref={setRef} style={style} className={dimmed ? 'opacity-50' : undefined}>
      <div className={`card flex items-stretch gap-1 overflow-hidden p-0 ${done ? 'opacity-60' : ''}`}>
        <button
          {...dragHandle}
          className="flex w-8 shrink-0 items-center justify-center text-navy-900/25 hover:text-navy-900/60 dark:text-white/25 dark:hover:text-white/60"
        >
          <Icon path={icons.grip} className="h-4 w-4" />
        </button>

        <button
          onClick={() => onToggleDone(task)}
          aria-label={done ? 'Mark as not done' : 'Mark as done'}
          className={`my-auto grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition ${
            done
              ? 'border-emerald-500 bg-emerald-500 text-white'
              : 'border-navy-900/20 text-transparent hover:border-blue dark:border-white/25'
          }`}
        >
          <Icon path={icons.check} className="h-3.5 w-3.5" />
        </button>

        <button onClick={() => onOpen(task)} className="min-w-0 flex-1 py-3 pl-2.5 pr-1 text-left">
          <p className={`truncate font-medium ${done ? 'line-through decoration-2' : ''}`}>
            {task.title || 'Untitled task'}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-navy-900/55 dark:text-white/55">
            <span className={`tag ${STATUS[task.status].cls}`}>{STATUS[task.status].label}</span>
            <span className="font-semibold text-navy-900/70 dark:text-white/70">{task.estMin}m</span>
            {task.actualSec > 0 && <span>· actual {humanDuration(task.actualSec)}</span>}
            {task.priority !== 'normal' && (
              <span className={`tag ${PRIORITY[task.priority].cls}`}>{PRIORITY[task.priority].label}</span>
            )}
            {subs.length > 0 && <span>· {subsDone}/{subs.length} steps</span>}
            {rec && (
              <span className="inline-flex items-center gap-1">
                · <Icon path={icons.repeat} className="h-3 w-3" /> {rec}
              </span>
            )}
            {due && <span className={overdue ? 'font-semibold text-fire' : ''}>· {due}</span>}
          </div>
        </button>

        {!done && (
          <button
            onClick={() => onStart(task)}
            aria-label={`Start focus timer for ${task.title}`}
            className="shrink-0 border-l border-black/5 px-4 text-blue transition hover:bg-blue/10 dark:border-white/10"
          >
            <span className="flex flex-col items-center gap-0.5">
              <Icon path={icons.play} className="h-4 w-4" />
              <span className="font-mono text-[10px] tabular-nums opacity-70">{clock(task.estMin * 60)}</span>
            </span>
          </button>
        )}
      </div>
    </li>
  )
}
