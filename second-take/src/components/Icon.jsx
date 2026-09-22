// Inline SVG icons, keyed by the icon names used in content.json. Drawn here
// rather than pulled from a library so the app stays dependency free.
const PATHS = {
  smartphone: 'M7 2h10a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm3 17h4',
  laptop: 'M4 5h16v11H4zM2 19h20',
  mail: 'M3 6h18v12H3zM3 7l9 6 9-6',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  search: 'M10.5 3a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15zM16 16l5 5',
  users: 'M8 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8zM2 21v-1a6 6 0 0 1 12 0v1M17 11.5a3 3 0 1 0 0-6M18 21v-1a5 5 0 0 0-2-4',
  'map-pin': 'M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12zM12 7a3 3 0 1 1 0 6 3 3 0 0 1 0-6z',
  'heart-handshake': 'M12 20s-7-4.5-7-9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 7 3.5c0 5-7 9.5-7 9.5zM9.5 11.5l2 2 3-3',
  'message-circle': 'M21 11.5A8.5 8.5 0 0 1 8.7 19L3 21l2-5.3A8.5 8.5 0 1 1 21 11.5z',
  mic: 'M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM6 11a6 6 0 0 0 12 0M12 17v4M9 21h6',
  'book-open': 'M12 6C10 4.5 7.5 4 4 4v14c3.5 0 6 .5 8 2 2-1.5 4.5-2 8-2V4c-3.5 0-6 .5-8 2zM12 6v14',
  'file-signature': 'M15 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6zM15 2v4h4M8 17c1.5-3 3-3 4-1.5s2.5 1.5 4-1.5',
  scale: 'M12 3v18M7 21h10M12 6L5 9l3 5 3-5zM12 6l7 3-3 5-3-5z',
  'check-square': 'M4 4h16v16H4zM8 12l3 3 5-6',
  lock: 'M6 11h12v10H6zM9 11V8a3 3 0 0 1 6 0v3',
  check: 'M5 13l4 4 10-11',
  sun: 'M12 5V2M12 22v-3M5 12H2M22 12h-3M6.3 6.3L4.2 4.2M19.8 19.8l-2.1-2.1M6.3 17.7l-2.1 2.1M19.8 4.2l-2.1 2.1M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z',
  moon: 'M20 14.5A8.5 8.5 0 0 1 9.5 4 8.5 8.5 0 1 0 20 14.5z',
  award: 'M12 3a6 6 0 1 1 0 12 6 6 0 0 1 0-12zM9 14.5L8 22l4-2 4 2-1-7.5',
  download: 'M12 3v12M7 11l5 5 5-5M4 21h16'
}

export default function Icon({ name, size = 22, strokeWidth = 2.2, className = '' }) {
  const path = PATHS[name] || PATHS.check
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={path} />
    </svg>
  )
}
