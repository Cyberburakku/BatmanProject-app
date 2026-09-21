import { useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'
import ContentTable from './ContentTable'
import EntryForm from './EntryForm'
import FlaggedLinks from './FlaggedLinks'

const SECTIONS = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'Technology', label: 'Technology Lessons' },
  { key: 'Employment', label: 'Employment Lessons' },
  { key: 'Connections', label: 'Connections and Resources' },
  { key: 'flagged', label: 'Flagged Links' }
]

export default function AdminDashboard({ state, actions, showToast, go }) {
  const [section, setSection] = useState('dashboard')
  const [editing, setEditing] = useState(null) // { entry } for edit, { entry: null } for add
  const [pendingRemoval, setPendingRemoval] = useState(null)

  const entries = state.entries
  const flaggedCount = entries.filter((entry) => entry.flagged).length
  const lessonCount = entries.filter((entry) => entry.type === 'lesson').length

  function startAdd(category) {
    setEditing({ entry: null, category })
  }

  function startEdit(entry) {
    setEditing({ entry })
  }

  function handleSave(draft) {
    if (editing.entry) {
      actions.updateEntry(editing.entry.id, draft)
      showToast('Changes saved. Participants see the update right away.')
    } else {
      actions.addEntry({ ...draft, category: draft.category || editing.category })
      showToast('New resource added. It is live for participants now.')
    }
    setEditing(null)
  }

  function confirmRemoval() {
    actions.removeEntry(pendingRemoval.id)
    setPendingRemoval(null)
    showToast("Resource removed. It's no longer visible to participants.")
  }

  const sidebarCount = (key) => {
    if (key === 'flagged') return flaggedCount
    if (key === 'dashboard') return null
    return entries.filter((entry) => entry.category === key).length
  }

  return (
    <div className="admin">
      <nav className="admin__side" aria-label="Admin sections">
        <h2>Admin</h2>
        {SECTIONS.map((item) => (
          <button
            key={item.key}
            type="button"
            className={`side-link${section === item.key && !editing ? ' is-active' : ''}`}
            onClick={() => { setSection(item.key); setEditing(null) }}
          >
            <span>{item.label}</span>
            {sidebarCount(item.key) !== null && <span className="badge-count">{sidebarCount(item.key)}</span>}
          </button>
        ))}
        <div style={{ marginTop: 'auto', paddingTop: 20 }}>
          <button type="button" className="btn btn--ghost-light btn--block" onClick={() => go('home')}>
            Back to participant app
          </button>
        </div>
      </nav>

      <div className="admin__main">
        {editing ? (
          <EntryForm entry={editing.entry} onSave={handleSave} onCancel={() => setEditing(null)} />
        ) : section === 'dashboard' ? (
          <div className="stack">
            <div className="admin__header">
              <h2>Admin Dashboard</h2>
              <div className="spacer" />
              <span className="admin__note">
                Demo mode — no login, changes save to this browser only.
              </span>
            </div>

            <div className="grid">
              <div className="card">
                <p className="card__label">Active lessons</p>
                <p className="card__number">{lessonCount}</p>
                <p style={{ color: 'var(--muted)', fontSize: 16 }}>Showing on the participant learning path.</p>
              </div>
              <div className="card">
                <p className="card__label">Flagged links</p>
                <p className="card__number" style={{ color: flaggedCount ? 'var(--orange)' : 'var(--blue)' }}>
                  {flaggedCount}
                </p>
                <button
                  type="button"
                  className="btn btn--quiet btn--small"
                  onClick={() => setSection('flagged')}
                >
                  Review flagged links
                </button>
              </div>
              <div className="card">
                <p className="card__label">Total entries</p>
                <p className="card__number">{entries.length}</p>
                <p style={{ color: 'var(--muted)', fontSize: 16 }}>Lessons and directory resources together.</p>
              </div>
            </div>

            <section className="card stack" aria-label="Activity log">
              <h3>Recent edits this session</h3>
              {state.activityLog.length === 0 ? (
                <p style={{ color: 'var(--muted)' }}>
                  Nothing edited yet. Every change you make shows up here until the demo is reset.
                </p>
              ) : (
                <ul style={{ listStyle: 'none' }}>
                  {state.activityLog.slice(0, 12).map((item) => (
                    <li
                      key={item.id}
                      style={{ padding: '12px 0', borderBottom: '1px solid var(--line)', fontSize: 16 }}
                    >
                      <strong style={{ color: 'var(--heading)' }}>{item.time}</strong> · {item.message}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        ) : section === 'flagged' ? (
          <FlaggedLinks
            entries={entries}
            onReplace={startEdit}
            onRemove={setPendingRemoval}
          />
        ) : (
          <ContentTable
            title={SECTIONS.find((item) => item.key === section).label}
            entries={entries.filter((entry) => entry.category === section)}
            onEdit={startEdit}
            onAdd={() => startAdd(section)}
            onRemove={setPendingRemoval}
          />
        )}
      </div>

      {pendingRemoval && (
        <ConfirmDialog
          title="Remove This Resource?"
          body="This resource will no longer show up in the app for participants. This action works best for content that's outdated or no longer available, so users only see resources that actually work."
          note="You can always add this resource back later if it becomes available again."
          cancelLabel="Keep Resource"
          confirmLabel="Remove It"
          onCancel={() => setPendingRemoval(null)}
          onConfirm={confirmRemoval}
        />
      )}
    </div>
  )
}
