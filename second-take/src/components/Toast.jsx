import { useEffect, useState } from 'react'
import Icon from './Icon'

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
      <span className="toast__check"><Icon name="check" size={18} strokeWidth={3} /></span>
      <span>{message}</span>
    </div>
  )
}
