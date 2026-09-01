// A short chime built with the Web Audio API, so there is no audio file to load
// and nothing to go missing on a slow connection.
let ctx = null

const audioCtx = () => {
  if (typeof window === 'undefined') return null
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  if (!ctx) ctx = new AC()
  return ctx
}

/** Browsers block sound until the user interacts once — call this on first tap. */
export const unlockAudio = () => {
  const ac = audioCtx()
  if (ac && ac.state === 'suspended') ac.resume().catch(() => {})
}

const tone = (ac, freq, startAt, dur, gainPeak) => {
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0, startAt)
  gain.gain.linearRampToValueAtTime(gainPeak, startAt + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, startAt + dur)
  osc.connect(gain).connect(ac.destination)
  osc.start(startAt)
  osc.stop(startAt + dur + 0.05)
}

/** kind: 'work-end' (rising, three notes) | 'break-end' (single low note) */
export const chime = (kind = 'work-end') => {
  const ac = audioCtx()
  if (!ac) return
  if (ac.state === 'suspended') ac.resume().catch(() => {})
  const t = ac.currentTime + 0.02
  if (kind === 'work-end') {
    tone(ac, 660, t, 0.28, 0.22)
    tone(ac, 880, t + 0.18, 0.28, 0.22)
    tone(ac, 1174, t + 0.36, 0.45, 0.2)
  } else {
    tone(ac, 523, t, 0.35, 0.2)
    tone(ac, 392, t + 0.22, 0.5, 0.18)
  }
}

export const buzz = (pattern = [120, 60, 120, 60, 240]) => {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try { navigator.vibrate(pattern) } catch { /* some browsers refuse; not important */ }
  }
}

export const alertEnd = ({ sound = true, vibrate = true, kind = 'work-end' } = {}) => {
  if (sound) chime(kind)
  if (vibrate) buzz()
}
