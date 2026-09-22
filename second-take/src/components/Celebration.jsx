import { useEffect, useState } from 'react'
import Icon from './Icon'

const COLORS = ['#FFBF69', '#FF6B35', '#2EC4B6', '#FFD79A', '#FF8355']

// Golden confetti plus a warm checkmark pop, shown when a lesson is completed
// or a certificate is earned.
export default function Celebration({ token }) {
  const [pieces, setPieces] = useState([])

  useEffect(() => {
    if (!token) {
      setPieces([])
      return
    }
    setPieces(
      Array.from({ length: 70 }, (_, i) => ({
        id: `${token}-${i}`,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2 + Math.random() * 1.1,
        color: COLORS[i % COLORS.length]
      }))
    )
    const clear = setTimeout(() => setPieces([]), 3400)
    return () => clearTimeout(clear)
  }, [token])

  if (!token || pieces.length === 0) return null

  return (
    <>
      <div className="confetti" aria-hidden="true">
        {pieces.map((piece) => (
          <span
            key={piece.id}
            style={{
              left: `${piece.left}%`,
              background: piece.color,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`
            }}
          />
        ))}
      </div>
      <div className="check-pop" aria-hidden="true">
        <Icon name="check" size={72} strokeWidth={3.4} />
      </div>
    </>
  )
}
