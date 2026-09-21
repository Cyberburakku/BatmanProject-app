import { useMemo, useState } from 'react'

export default function FlaggedLinks({ entries, onReplace, onRemove }) {
  const [category, setCategory] = useState('All')
  const [reason, setReason] = useState('All')

  const flagged = useMemo(() => entries.filter((entry) => entry.flagged), [entries])
  const reasons = useMemo(
    () => Array.from(new Set(flagged.map((entry) => entry.flagReason).filter(Boolean))),
    [flagged]
  )

  const visible = flagged.filter((entry) => {
    const categoryOk = category === 'All' || entry.category === category
    const reasonOk = reason === 'All' || entry.flagReason === reason
    return categoryOk && reasonOk
  })

  return (
    <div className="stack">
      <div className="admin__header">
        <h2>Flagged Links</h2>
        <span className="badge-count">{flagged.length} flagged</span>
        <div className="spacer" />
        <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)' }}>
          Flags are set by hand in this demo. Live link checking comes in a later build.
        </span>
      </div>

      {flagged.length > 0 && (
        <div className="card row" style={{ gap: 16 }}>
          <div style={{ flex: '1 1 220px' }}>
            <label htmlFor="flag-category">Filter by category</label>
            <select id="flag-category" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option value="All">All categories</option>
              <option value="Technology">Technology</option>
              <option value="Employment">Employment</option>
              <option value="Connections">Connections</option>
            </select>
          </div>
          <div style={{ flex: '1 1 220px' }}>
            <label htmlFor="flag-reason">Filter by flag reason</label>
            <select id="flag-reason" value={reason} onChange={(event) => setReason(event.target.value)}>
              <option value="All">All reasons</option>
              {reasons.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {flagged.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__check" aria-hidden="true">✓</div>
          <h2>All links are working</h2>
          <p style={{ color: 'var(--muted)' }}>Nothing needs your attention right now.</p>
        </div>
      ) : visible.length === 0 ? (
        <div className="card">
          <h3>No flagged links match those filters</h3>
          <p style={{ color: 'var(--muted)' }}>Set the filters back to all to see every flagged link.</p>
        </div>
      ) : (
        <div className="stack">
          {visible.map((entry) => (
            <article key={entry.id} className="flag-card">
              <span className="flag-card__icon" aria-hidden="true">!</span>
              <div>
                <h3>{entry.title}</h3>
                <div className="row" style={{ gap: 8, marginTop: 6 }}>
                  <span className="tag tag--coral">{entry.flagReason}</span>
                  <span className="tag">{entry.category}</span>
                  <span className="tag">{entry.subcategory}</span>
                </div>
                <a className="table-link" href={entry.link} target="_blank" rel="noreferrer">{entry.link}</a>
              </div>
              <div className="flag-card__actions">
                <button type="button" className="btn btn--small" onClick={() => onReplace(entry)}>Replace Link</button>
                <button type="button" className="btn btn--coral btn--small" onClick={() => onRemove(entry)}>Remove Resource</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
