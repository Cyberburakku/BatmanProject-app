import { useEffect, useState } from 'react'

// Checkmark toast that fades out on its own after a few seconds.
export default function Toast({ message, onDone }) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    setLeaving(false)
    const fade = setTimeout(() => setLeaving(true), 3200)
    const remove = setTimeout(() => onDone(), 3700)
    return () => {
      clearTimeout(fade)
      clearTimeout(remove)
    }
  }, [message, onDone])

  if (!message) return null

  return (
    <div className={`toast${leaving ? ' is-leaving' : ''}`} role="status">
      <span className="toast__check" aria-hidden="true">✓</span>
      <span>{message}</span>
    </div>
  )
}
