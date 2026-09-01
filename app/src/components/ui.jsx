import { useEffect } from 'react'

export const STATUS = {
  focus: { label: 'Focus', cls: 'bg-blue/15 text-blue-700 dark:bg-blue/20 dark:text-blue' },
  future: { label: 'Future', cls: 'bg-fire/15 text-fire-600 dark:bg-fire/20 dark:text-fire' },
  done: { label: 'Done', cls: 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-400/20 dark:text-emerald-300' },
}

export const PRIORITY = {
  high: { label: 'High', dot: 'bg-fire', cls: 'bg-fire/15 text-fire-600 dark:text-fire' },
  normal: { label: 'Normal', dot: 'bg-blue', cls: 'bg-blue/15 text-blue-700 dark:text-blue' },
  low: { label: 'Low', dot: 'bg-navy-600/60', cls: 'bg-black/5 text-navy-900/60 dark:bg-white/10 dark:text-white/60' },
}

export function ProgressBar({ value, className = '', tone = 'blue' }) {
  const pct = Math.max(0, Math.min(100, value))
  const fill = tone === 'gold' ? 'bg-gold' : tone === 'fire' ? 'bg-fire' : 'bg-blue'
  return (
    <div
      className={`h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10 ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={`h-full rounded-full ${fill} transition-[width] duration-500`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export function Sheet({ open, onClose, title, children, footer }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label={title}>
      {/* Tapping outside closes. Not a button: it would announce a second
          "Close" control to a screen reader, and Escape already covers keyboards. */}
      <div className="absolute inset-0 bg-navy-900/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 flex max-h-[92vh] w-full flex-col rounded-t-3xl bg-white shadow-2xl dark:bg-navy-800 sm:max-w-lg sm:rounded-3xl">
        <div className="flex items-center justify-between gap-3 border-b border-black/5 px-5 py-4 dark:border-white/10">
          <h2 className="font-display text-2xl">{title}</h2>
          <button type="button" onClick={onClose} className="btn-ghost !px-3 !py-1.5 text-sm" aria-label="Close">Close</button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="border-t border-black/5 px-5 py-4 dark:border-white/10" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>{footer}</div>}
      </div>
    </div>
  )
}

export function Segmented({ value, onChange, options, className = '' }) {
  return (
    <div className={`inline-flex rounded-xl bg-black/5 p-1 dark:bg-white/10 ${className}`} role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={`flex-1 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
            value === o.value
              ? 'bg-white text-navy-900 shadow-sm dark:bg-navy-600 dark:text-white'
              : 'text-navy-900/55 hover:text-navy-900 dark:text-white/55 dark:hover:text-white'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export const Icon = ({ path, className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    {path}
  </svg>
)

export const icons = {
  play: <polygon points="6 4 20 12 6 20" fill="currentColor" stroke="none" />,
  pause: <><rect x="7" y="5" width="3.5" height="14" rx="1" fill="currentColor" stroke="none" /><rect x="13.5" y="5" width="3.5" height="14" rx="1" fill="currentColor" stroke="none" /></>,
  check: <polyline points="4 12.5 9.5 18 20 6" />,
  plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
  search: <><circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" /></>,
  grip: <><circle cx="9" cy="6" r="1.4" fill="currentColor" stroke="none" /><circle cx="15" cy="6" r="1.4" fill="currentColor" stroke="none" /><circle cx="9" cy="12" r="1.4" fill="currentColor" stroke="none" /><circle cx="15" cy="12" r="1.4" fill="currentColor" stroke="none" /><circle cx="9" cy="18" r="1.4" fill="currentColor" stroke="none" /><circle cx="15" cy="18" r="1.4" fill="currentColor" stroke="none" /></>,
  sun: <><circle cx="12" cy="12" r="4.2" /><line x1="12" y1="2" x2="12" y2="4" /><line x1="12" y1="20" x2="12" y2="22" /><line x1="2" y1="12" x2="4" y2="12" /><line x1="20" y1="12" x2="22" y2="12" /><line x1="5" y1="5" x2="6.5" y2="6.5" /><line x1="17.5" y1="17.5" x2="19" y2="19" /><line x1="5" y1="19" x2="6.5" y2="17.5" /><line x1="17.5" y1="6.5" x2="19" y2="5" /></>,
  moon: <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />,
  cog: <><circle cx="12" cy="12" r="2.8" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.4l-.1.1a2 2 0 1 1-2.8-2.9l.1-.1a1.7 1.7 0 0 0-1.2-2.9H2.9a2 2 0 1 1 0-4H3a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.4-1.9l-.1-.1a2 2 0 1 1 2.9-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H10a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.9l-.1.1a1.7 1.7 0 0 0 .3 1.9v.1a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4H21a1.7 1.7 0 0 0-1.6 1Z" /></>,
  lock: <><rect x="4.5" y="10.5" width="15" height="10" rx="2.5" /><path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" /></>,
  trash: <><polyline points="4 7 20 7" /><path d="M9 7V5h6v2" /><path d="M6.5 7l.8 13h9.4l.8-13" /></>,
  repeat: <><polyline points="17 2 21 6 17 10" /><path d="M21 6H8a5 5 0 0 0-5 5v1" /><polyline points="7 22 3 18 7 14" /><path d="M3 18h13a5 5 0 0 0 5-5v-1" /></>,
  chart: <><line x1="4" y1="20" x2="20" y2="20" /><rect x="6" y="11" width="3" height="9" /><rect x="11" y="6" width="3" height="14" /><rect x="16" y="14" width="3" height="6" /></>,
  cloud: <path d="M7 18h10a4 4 0 0 0 .4-8A5.5 5.5 0 0 0 6.6 11 3.5 3.5 0 0 0 7 18Z" />,
}
