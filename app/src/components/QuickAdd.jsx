import { useEffect, useRef, useState } from 'react'
import { Icon, Segmented, Sheet, icons } from './ui'
import { useStore } from '../state/store'
import { todayKey } from '../lib/time'

const QUICK = [10, 15, 25, 45, 60]

/** Always one tap away, on every screen. */
export default function QuickAdd({ open, setOpen, defaultStatus = 'focus' }) {
  const { dispatch } = useStore()
  const [title, setTitle] = useState('')
  const [estMin, setEstMin] = useState(25)
  const [status, setStatus] = useState(defaultStatus)
  const input = useRef(null)

  useEffect(() => { if (open) { setStatus(defaultStatus); setTimeout(() => input.current?.focus(), 80) } }, [open, defaultStatus])

  const submit = (e, keepOpen = false) => {
    e?.preventDefault()
    if (!title.trim()) return
    dispatch({
      type: 'add-task',
      task: { title, estMin: Math.max(1, Number(estMin) || 25), status, due: status === 'future' ? null : todayKey() },
    })
    setTitle('')
    if (!keepOpen) setOpen(false)
    else input.current?.focus()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Add a task"
        className="fixed right-5 z-30 grid h-14 w-14 place-items-center rounded-full bg-gold text-navy-900 shadow-lg shadow-gold/25 transition active:scale-95"
        style={{ bottom: 'max(5.5rem, calc(env(safe-area-inset-bottom) + 5.5rem))' }}
      >
        <Icon path={icons.plus} className="h-7 w-7" />
      </button>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Quick add"
        footer={
          <div className="flex gap-2">
            <button className="btn-ghost" onClick={(e) => submit(e, true)} disabled={!title.trim()}>Save &amp; add another</button>
            <button className="btn-primary flex-1" onClick={(e) => submit(e)} disabled={!title.trim()}>Add task</button>
          </div>
        }
      >
        <form onSubmit={submit} className="space-y-5">
          <input
            ref={input}
            className="field text-lg"
            placeholder="What needs doing?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            enterKeyHint="done"
          />
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-navy-900/50 dark:text-white/50">
              How long?
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {QUICK.map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setEstMin(m)}
                  className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                    Number(estMin) === m ? 'bg-blue text-white' : 'bg-black/5 dark:bg-white/10'
                  }`}
                >
                  {m}m
                </button>
              ))}
              <input
                type="number" min="1" max="600" inputMode="numeric"
                className="field !w-20 !px-2 !py-1.5 text-right"
                value={estMin}
                onChange={(e) => setEstMin(e.target.value === '' ? '' : Number(e.target.value))}
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-navy-900/50 dark:text-white/50">
              When?
            </label>
            <Segmented
              className="w-full"
              value={status}
              onChange={setStatus}
              options={[{ value: 'focus', label: 'Today' }, { value: 'future', label: 'Future' }]}
            />
          </div>
        </form>
      </Sheet>
    </>
  )
}
