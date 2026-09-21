import { useMemo, useState } from 'react'
import ImagePlaceholder from '../components/ImagePlaceholder'

const SECTIONS = ['Technology', 'Employment', 'Connections']

export default function ResourceDirectory({ entries, go }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()
    return entries.filter((entry) => {
      const matchesCategory = category === 'All' || entry.category === category
      if (!matchesCategory) return false
      if (!term) return true
      return [entry.title, entry.description, entry.subcategory, entry.category]
        .join(' ')
        .toLowerCase()
        .includes(term)
    })
  }, [entries, search, category])

  const sectionsToShow = category === 'All' ? SECTIONS : [category]

  return (
    <div className="screen stack">
      <header className="screen__header">
        <h1>Resource Directory</h1>
        <p>Everything in one place, split into technology, employment, and connections. Search by word or narrow it down by section.</p>
      </header>

      <section className="card stack" aria-label="Search and filter">
        <div className="row" style={{ gap: 16 }}>
          <div style={{ flex: '2 1 280px' }}>
            <label htmlFor="resource-search">Search resources</label>
            <input
              id="resource-search"
              type="search"
              placeholder="Try: resume, email, housing"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div style={{ flex: '1 1 200px' }}>
            <label htmlFor="resource-category">Section</label>
            <select
              id="resource-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option value="All">All sections</option>
              {SECTIONS.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 16 }}>
          Showing <strong>{visible.length}</strong> of {entries.length} resources.
        </p>
      </section>

      {visible.length === 0 && (
        <div className="card">
          <h3>Nothing matched that search</h3>
          <p style={{ color: 'var(--muted)' }}>Try a shorter word, or set the section back to all sections.</p>
        </div>
      )}

      {sectionsToShow.map((section) => {
        const items = visible.filter((entry) => entry.category === section)
        if (items.length === 0) return null
        return (
          <section key={section} className="stack" aria-label={section}>
            <h2>{section}</h2>
            <div className="grid">
              {items.map((entry) => (
                <article key={entry.id} className="card stack">
                  <ImagePlaceholder height={110} />
                  <span className="tag">{entry.subcategory}</span>
                  <h3>{entry.title}</h3>
                  <p style={{ color: 'var(--muted)', fontSize: 16 }}>{entry.description}</p>
                  <a className="btn btn--ghost btn--small" href={entry.link} target="_blank" rel="noreferrer">
                    Open resource
                  </a>
                </article>
              ))}
            </div>
          </section>
        )
      })}

      <div className="row">
        <button type="button" className="btn btn--quiet" onClick={() => go('home')}>Back to home</button>
      </div>
    </div>
  )
}
