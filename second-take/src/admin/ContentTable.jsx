export default function ContentTable({ title, entries, onEdit, onAdd, onRemove }) {
  return (
    <div className="stack">
      <div className="admin__header">
        <h2>{title}</h2>
        <span className="badge-count">{entries.length}</span>
        <div className="spacer" />
        <button type="button" className="btn btn--gold" onClick={onAdd}>+ Add New Resource</button>
      </div>

      {entries.length === 0 ? (
        <div className="card">
          <h3>Nothing in this section yet</h3>
          <p style={{ color: 'var(--muted)' }}>Use the gold Add New Resource button to put the first entry in.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Category</th>
                <th scope="col">Link</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  <td>
                    <strong>{entry.title}</strong>
                    <div style={{ fontSize: 15, color: 'var(--muted)' }}>
                      {entry.subcategory} · {entry.type === 'lesson' ? 'Lesson' : 'Resource'}
                      {entry.flagged && <span className="tag tag--coral" style={{ marginLeft: 8 }}>{entry.flagReason}</span>}
                    </div>
                  </td>
                  <td>{entry.category}</td>
                  <td>
                    <a className="table-link" href={entry.link} target="_blank" rel="noreferrer">{entry.link}</a>
                  </td>
                  <td>
                    <div className="row" style={{ gap: 8 }}>
                      <button type="button" className="btn btn--quiet btn--small" onClick={() => onEdit(entry)}>Edit</button>
                      <button type="button" className="btn btn--coral btn--small" onClick={() => onRemove(entry)}>Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
