// Progress snapshot drawn as a rising sun on an upward path. The sun climbs and
// the path fills as lessons are completed.
export default function SunriseProgress({ done, total, label }) {
  const fraction = total > 0 ? done / total : 0
  const percent = Math.round(fraction * 100)

  // The sun travels along the path from bottom-left to top-right.
  const sunX = 60 + fraction * 320
  const sunY = 150 - fraction * 96
  const pathD = 'M40 160 C 140 150, 210 110, 280 78 S 360 46, 420 38'

  return (
    <div className="sunrise">
      <svg viewBox="0 0 460 190" role="img"
           aria-label={`${done} of ${total} lessons complete, ${percent} percent`}>
        <defs>
          <linearGradient id="sky" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="var(--gold-tint)" />
            <stop offset="100%" stopColor="var(--teal-tint)" />
          </linearGradient>
          <linearGradient id="trail" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--gold)" />
            <stop offset="100%" stopColor="var(--orange)" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="460" height="190" rx="18" fill="url(#sky)" />

        {/* Rays behind the sun */}
        <g stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" opacity="0.75">
          {Array.from({ length: 7 }, (_, i) => {
            const angle = Math.PI + (i * Math.PI) / 6
            return (
              <line
                key={i}
                x1={sunX + Math.cos(angle) * 30}
                y1={sunY + Math.sin(angle) * 30}
                x2={sunX + Math.cos(angle) * 44}
                y2={sunY + Math.sin(angle) * 44}
              />
            )
          })}
        </g>

        <circle cx={sunX} cy={sunY} r="22" fill="var(--gold)" />

        {/* The full route, then the portion already walked */}
        <path d={pathD} fill="none" stroke="var(--line)" strokeWidth="9"
              strokeLinecap="round" strokeDasharray="4 12" />
        <path d={pathD} fill="none" stroke="url(#trail)" strokeWidth="9" strokeLinecap="round"
              pathLength="1" strokeDasharray="1" strokeDashoffset={1 - fraction} />
      </svg>

      <p className="sunrise__caption">{done} of {total} lessons complete · {percent}% of the way</p>
      {label && <p className="sunrise__sub">{label}</p>}
    </div>
  )
}
