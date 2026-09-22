import { useState } from 'react'
import content from '../data/content.json'

// Slow horizontal ticker that cycles the full affirmations list, sitting in its
// own thin bar directly above the crisis bar. Pauses on hover, focus, or tap.
export default function AffirmationTicker() {
  const [paused, setPaused] = useState(false)
  const lines = content.Affirmations

  return (
    <div
      className={`ticker${paused ? ' is-paused' : ''}`}
      aria-label="Affirmations"
      onPointerDown={() => setPaused(true)}
      onPointerUp={() => setPaused(false)}
      onPointerCancel={() => setPaused(false)}
    >
      {/* Two copies back to back keep the scroll seamless. */}
      <div className="ticker__track">
        {[...lines, ...lines].map((line, index) => (
          <span className="ticker__item" key={`${index}-${line}`}>{line}</span>
        ))}
      </div>
    </div>
  )
}
