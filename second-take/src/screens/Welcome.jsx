import { useState } from 'react'
import Icon from '../components/Icon'

// Asked once, at the start. The name is only used on the certificates.
export default function Welcome({ onSubmit }) {
  const [name, setName] = useState('')

  return (
    <div className="screen">
      <div className="card card--teal block">
        <h1>Welcome to Second Take</h1>
        <p>
          This is your space to get ready for release, one step at a time. Nothing here is graded,
          and nothing you type ever leaves this device.
        </p>
      </div>

      <form
        className="card block"
        onSubmit={(event) => { event.preventDefault(); onSubmit(name.trim()) }}
      >
        <h2>What should we call you?</h2>
        <p style={{ color: 'var(--muted)' }}>
          This goes on your certificates when you finish a module. A first name is plenty.
        </p>
        <div className="field">
          <label htmlFor="participant-name">Your name</label>
          <input
            id="participant-name"
            type="text"
            value={name}
            autoComplete="given-name"
            placeholder="First name"
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <button type="submit" className="btn btn--block" disabled={!name.trim()}>
          <Icon name="sun" size={20} /> Let's get started
        </button>
      </form>
    </div>
  )
}
