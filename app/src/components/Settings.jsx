import { useState } from 'react'
import { Icon, Segmented, Sheet, icons } from './ui'
import { useStore } from '../state/store'
import { signIn, signOut, signUp, supabaseReady } from '../lib/supabase'
import { chime } from '../lib/sound'

function Row({ label, hint, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="text-xs text-navy-900/50 dark:text-white/50">{hint}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ on, onChange, label }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={`relative h-7 w-12 rounded-full transition ${on ? 'bg-blue' : 'bg-black/15 dark:bg-white/20'}`}
    >
      <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${on ? 'left-6' : 'left-1'}`} />
    </button>
  )
}

function NumberField({ value, onChange, min = 1, max = 180, suffix = 'min' }) {
  return (
    <label className="flex items-center gap-1.5 text-sm">
      <input
        type="number" min={min} max={max} inputMode="numeric"
        className="field !w-20 !px-2 !py-1.5 text-right"
        value={value}
        onChange={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || min)))}
      />
      <span className="text-navy-900/50 dark:text-white/50">{suffix}</span>
    </label>
  )
}

function AccountSection() {
  const { user, syncStatus } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('signin')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState(null)

  if (!supabaseReady) {
    return (
      <div className="rounded-xl bg-black/5 p-4 text-sm dark:bg-white/5">
        <p className="font-medium">Saving to this browser only</p>
        <p className="mt-1 text-navy-900/55 dark:text-white/55">
          Your tasks are stored on this device and survive a refresh. To sync across your phone and
          laptop, add your two Supabase keys as environment variables — the steps are in
          <span className="font-mono text-xs"> CLOUDFLARE-SETUP.md</span>. Sign-in appears here automatically once they are set.
        </p>
      </div>
    )
  }

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true); setMsg(null)
    try {
      const run = mode === 'signin' ? signIn : signUp
      await run({ email: email.trim(), password })
      if (mode === 'signup') setMsg('Account created. Check your inbox if confirmation is required.')
    } catch (err) {
      setMsg(err.message || 'That did not work.')
    } finally {
      setBusy(false)
    }
  }

  if (user) {
    return (
      <div className="rounded-xl bg-black/5 p-4 text-sm dark:bg-white/5">
        <p className="font-medium">Signed in as {user.email}</p>
        <p className="mt-1 flex items-center gap-1.5 text-navy-900/55 dark:text-white/55">
          <Icon path={icons.cloud} className="h-4 w-4" />
          {syncStatus === 'synced' ? 'Synced across your devices' : syncStatus === 'syncing' ? 'Syncing…' : 'Sync problem — check your connection'}
        </p>
        <button className="btn-ghost mt-3 !py-2 text-sm" onClick={() => signOut()}>Sign out</button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl bg-black/5 p-4 dark:bg-white/5">
      <Segmented
        className="w-full"
        value={mode}
        onChange={setMode}
        options={[{ value: 'signin', label: 'Sign in' }, { value: 'signup', label: 'Create account' }]}
      />
      <input className="field" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input className="field" type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required />
      <button className="btn-primary w-full" disabled={busy}>{busy ? 'Working…' : mode === 'signin' ? 'Sign in' : 'Create account'}</button>
      {msg && <p className="text-xs text-fire">{msg}</p>}
      <p className="text-xs text-navy-900/50 dark:text-white/50">
        Signing in copies what is already on this device up to the cloud — nothing is lost.
      </p>
    </form>
  )
}

export default function Settings({ open, onClose }) {
  const { state, dispatch } = useStore()
  const s = state.settings
  const set = (patch) => dispatch({ type: 'settings', patch })
  const [confirmReset, setConfirmReset] = useState(false)

  return (
    <Sheet open={open} onClose={onClose} title="Settings">
      <div className="space-y-6">
        <section>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-widest text-navy-900/50 dark:text-white/50">Timer</h3>
          <div className="divide-y divide-black/5 dark:divide-white/10">
            <Row label="Focus block" hint="The classic Pomodoro is 25 minutes">
              <NumberField value={s.workMin} onChange={(v) => set({ workMin: v })} max={180} />
            </Row>
            <Row label="Short break">
              <NumberField value={s.breakMin} onChange={(v) => set({ breakMin: v })} max={60} />
            </Row>
            <Row label="Long break" hint={`Every ${s.roundsBeforeLong} rounds`}>
              <NumberField value={s.longBreakMin} onChange={(v) => set({ longBreakMin: v })} max={90} />
            </Row>
            <Row label="Rounds before a long break">
              <NumberField value={s.roundsBeforeLong} onChange={(v) => set({ roundsBeforeLong: v })} min={2} max={12} suffix="rounds" />
            </Row>
            <Row label="Strict Mode" hint="Locks the screen to one task; leaving needs a press and hold">
              <Toggle on={s.strict} onChange={(v) => set({ strict: v })} label="Strict Mode" />
            </Row>
          </div>
        </section>

        <section>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-widest text-navy-900/50 dark:text-white/50">Alerts</h3>
          <div className="divide-y divide-black/5 dark:divide-white/10">
            <Row label="Sound at the end of a session">
              <div className="flex items-center gap-2">
                <button className="btn-ghost !px-2 !py-1 text-xs" onClick={() => chime('work-end')}>Test</button>
                <Toggle on={s.sound} onChange={(v) => set({ sound: v })} label="Sound" />
              </div>
            </Row>
            <Row label="Vibrate" hint="Phones and tablets only">
              <Toggle on={s.vibrate} onChange={(v) => set({ vibrate: v })} label="Vibrate" />
            </Row>
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-navy-900/50 dark:text-white/50">Appearance</h3>
          <Segmented
            className="w-full"
            value={s.theme}
            onChange={(v) => set({ theme: v })}
            options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]}
          />
        </section>

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-navy-900/50 dark:text-white/50">Sync &amp; account</h3>
          <AccountSection />
        </section>

        <section>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-navy-900/50 dark:text-white/50">Danger zone</h3>
          <button
            className={`btn w-full ${confirmReset ? 'bg-fire text-white' : 'btn-ghost'}`}
            onClick={() => {
              if (!confirmReset) return setConfirmReset(true)
              dispatch({ type: 'reset-all' })
              setConfirmReset(false)
              onClose()
            }}
          >
            {confirmReset ? 'Tap again to erase every task and report' : 'Start over from scratch'}
          </button>
        </section>
      </div>
    </Sheet>
  )
}
