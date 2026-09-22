import Icon from '../components/Icon'

// Employment_Phase2 is deferred in this MVP. The screen stays visible for
// context so people can see what is coming, without functioning yet.
export default function ComingSoon({ go }) {
  return (
    <div className="screen">
      <header className="screen__header">
        <h1>Employment</h1>
        <p>Here is what this section will hold once it opens.</p>
      </header>

      <div className="coming-soon">
        <span className="coming-soon__lock"><Icon name="lock" size={40} strokeWidth={2.6} /></span>
        <h2>This section unlocks in a future update</h2>
        <p style={{ color: 'var(--muted)', maxWidth: '46ch' }}>
          Resumes, applications, and on-the-job skills are being built next. For now, your path
          covers technology, your support network, and talking about your record.
        </p>
      </div>

      <div className="row">
        <button type="button" className="btn btn--quiet" onClick={() => go('home')}>Back to home</button>
        <button type="button" className="btn" onClick={() => go('path')}>Go to my learning path</button>
      </div>
    </div>
  )
}
