import { useMemo, useState } from 'react'
import content from '../data/content.json'
import Icon from '../components/Icon'

// Connections only for this MVP. Group keys become the filter pills.
const GROUPS = [
  { key: 'Public_Libraries', label: 'Libraries' },
  { key: 'Reentry_Programs', label: 'Reentry Programs' },
  { key: 'Faith_Groups', label: 'Faith Groups' },
  { key: 'Peer_Mentors', label: 'Peer Mentors' },
  { key: 'Fair_Chance_Hiring', label: 'Fair Chance Hiring' }
]

const FLAT = GROUPS.flatMap((group) =>
  (content.Connections[group.key] || []).map((entry) => ({ ...entry, group: group.key, groupLabel: group.label }))
)

export default function ResourceDirectory({ go }) {
  const [search, setSearch] = useState('')
  const [group, setGroup] = useState('all')

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()
    return FLAT.filter((entry) => {
      if (group !== 'all' && entry.group !== group) return false
      if (!term) return true
      return [entry.name, entry.city, entry.address, entry.groupLabel]
        .filter(Boolean).join(' ').toLowerCase().includes(term)
    })
  }, [search, group])

  return (
    <div className="screen">
      <header className="screen__header">
        <h1>Resource Directory</h1>
        <p>Places and people who can help, here in Maine. Search by name or town, or filter by type.</p>
      </header>

      <section className="card block" aria-label="Search and filter">
        <div className="field">
          <label htmlFor="resource-search">Search</label>
          <input
            id="resource-search"
            type="search"
            placeholder="Try: Portland, mentor, library"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="pills" role="group" aria-label="Filter by type">
          <button type="button" className={`pill${group === 'all' ? ' is-active' : ''}`} onClick={() => setGroup('all')}>
            All
          </button>
          {GROUPS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`pill${group === item.key ? ' is-active' : ''}`}
              onClick={() => setGroup(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <p style={{ color: 'var(--muted)', fontSize: 16 }}>
          Showing <strong>{visible.length}</strong> of {FLAT.length} resources.
        </p>
      </section>

      {visible.length === 0 ? (
        <div className="card block">
          <h3>Nothing matched that</h3>
          <p style={{ color: 'var(--muted)' }}>Try a shorter word, or set the filter back to All.</p>
        </div>
      ) : (
        <div className="grid">
          {visible.map((entry) => (
            <article className="resource-card" key={entry.id}>
              <span className="resource-card__icon"><Icon name={entry.icon} size={26} /></span>
              <span className="tag">{entry.groupLabel}</span>
              <h3>{entry.name || entry.city}</h3>
              {entry.city && entry.name && <p className="resource-card__meta">{entry.city}</p>}
              {entry.address && <p className="resource-card__meta">{entry.address}</p>}
              {entry.phone && (
                <p className="resource-card__meta">
                  <a href={`tel:${entry.phone.replace(/[^0-9]/g, '')}`}>{entry.phone}</a>
                </p>
              )}
              <a className="btn btn--teal btn--small" href={entry.link} target="_blank" rel="noreferrer">
                Open Resource
              </a>
            </article>
          ))}
        </div>
      )}

      <div className="row">
        <button type="button" className="btn btn--quiet" onClick={() => go('home')}>Back to home</button>
      </div>
    </div>
  )
}
