import { useState } from 'react'
import ImagePlaceholder from '../components/ImagePlaceholder'

const CATEGORIES = ['Technology', 'Employment', 'Connections']

const blank = {
  title: '',
  description: '',
  link: '',
  category: 'Technology',
  subcategory: '',
  type: 'resource'
}

export default function EntryForm({ entry, onSave, onCancel }) {
  const [draft, setDraft] = useState({ ...blank, ...(entry || {}) })
  const isNew = !entry

  function set(field, value) {
    setDraft((previous) => ({ ...previous, [field]: value }))
  }

  function submit(event) {
    event.preventDefault()
    onSave(draft)
  }

  const canSave = draft.title.trim() && draft.link.trim()

  return (
    <div className="stack">
      <div className="admin__header">
        <h2>{isNew ? 'Add a new resource' : 'Edit this entry'}</h2>
        <div className="spacer" />
        <button type="button" className="btn btn--ghost-light" onClick={onCancel}>Cancel</button>
      </div>

      <div className="two-col">
        <form className="card" onSubmit={submit}>
          <div className="field">
            <label htmlFor="f-title">Title</label>
            <input
              id="f-title"
              type="text"
              value={draft.title}
              onChange={(event) => set('title', event.target.value)}
              placeholder="Setting up a free email address"
            />
          </div>

          <div className="field">
            <label htmlFor="f-description">Description</label>
            <textarea
              id="f-description"
              value={draft.description}
              onChange={(event) => set('description', event.target.value)}
              placeholder="One or two plain sentences about what this covers."
              style={{ minHeight: 110 }}
            />
          </div>

          <div className="field">
            <label htmlFor="f-link">Link</label>
            <input
              id="f-link"
              type="text"
              value={draft.link}
              onChange={(event) => set('link', event.target.value)}
              placeholder="https://example.org/lesson"
            />
            <p className="field__hint">Paste the full web address, starting with https://</p>
          </div>

          <div className="field">
            <label htmlFor="f-category">Category</label>
            <select id="f-category" value={draft.category} onChange={(event) => set('category', event.target.value)}>
              {CATEGORIES.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="f-subcategory">Subcategory</label>
            <input
              id="f-subcategory"
              type="text"
              value={draft.subcategory}
              onChange={(event) => set('subcategory', event.target.value)}
              placeholder="Email, Resume, Housing..."
            />
          </div>

          <div className="field">
            <label htmlFor="f-type">Shows up as</label>
            <select id="f-type" value={draft.type} onChange={(event) => set('type', event.target.value)}>
              <option value="lesson">A lesson on the learning path</option>
              <option value="resource">A resource in the directory</option>
            </select>
          </div>

          <button type="submit" className="btn btn--gold btn--block" disabled={!canSave}>
            Save Changes
          </button>
          {!canSave && <p className="field__hint">A title and a link are needed before you can save.</p>}
        </form>

        <div className="preview stack">
          <p className="preview__label">Live preview — what participants see</p>
          <article className="card stack">
            <ImagePlaceholder height={110} />
            <span className="tag">{draft.subcategory || 'Subcategory'}</span>
            <h3>{draft.title || 'Your title shows up here'}</h3>
            <p style={{ color: 'var(--muted)', fontSize: 16 }}>
              {draft.description || 'Your description shows up here.'}
            </p>
            <span className="btn btn--ghost btn--small">Open resource</span>
          </article>
          <p style={{ fontSize: 15, color: 'var(--muted)' }}>
            <strong>Category:</strong> {draft.category} · <strong>Type:</strong>{' '}
            {draft.type === 'lesson' ? 'Learning path lesson' : 'Directory resource'}
          </p>
          <p style={{ fontSize: 15, color: 'var(--muted)', wordBreak: 'break-all' }}>
            <strong>Link:</strong> {draft.link || 'Not set yet'}
          </p>
        </div>
      </div>
    </div>
  )
}
