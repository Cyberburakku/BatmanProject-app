import { useState } from 'react'
import content from '../data/content.json'

export default function InterviewPractice({ state, saveInterview, go }) {
  const questions = content.interviewQuestions
  const [step, setStep] = useState(0)
  const [reviewing, setReviewing] = useState(false)

  const question = questions[step]
  const answer = state.interviewResponses[question.id] || ''
  const isLast = step === questions.length - 1
  const answered = Object.values(state.interviewResponses).filter((text) => text && text.trim()).length

  if (reviewing) {
    return (
      <div className="screen stack">
        <header className="screen__header">
          <h1>Your practice answers</h1>
          <p>These stay on this device only. Nothing is sent anywhere, and no one else can see them.</p>
        </header>

        {questions.map((item, index) => {
          const text = state.interviewResponses[item.id]
          return (
            <section key={item.id} className="card stack">
              <span className="tag tag--navy">Question {index + 1}</span>
              <h3>{item.question}</h3>
              {text && text.trim() ? (
                <p style={{ whiteSpace: 'pre-wrap' }}>{text}</p>
              ) : (
                <p style={{ color: 'var(--muted)' }}>You have not answered this one yet.</p>
              )}
              <button
                type="button"
                className="btn btn--quiet btn--small"
                onClick={() => { setStep(index); setReviewing(false) }}
              >
                Work on this answer
              </button>
            </section>
          )
        })}

        <div className="row">
          <button type="button" className="btn btn--quiet" onClick={() => go('home')}>Back to home</button>
          <button type="button" className="btn btn--gold" onClick={() => { setStep(0); setReviewing(false) }}>
            Start again from question one
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="screen stack">
      <header className="screen__header">
        <h1>Interview Practice</h1>
        <p>
          Question {step + 1} of {questions.length}. Type your own answer or start from an example and change it to sound like you.
          Everything you type stays in this browser.
        </p>
      </header>

      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
      </div>

      <section className="card stack">
        <h2>{question.question}</h2>
        <p style={{ color: 'var(--muted)' }}><strong>Tip:</strong> {question.tip}</p>

        <div className="field">
          <label htmlFor="answer-box">Your answer</label>
          <textarea
            id="answer-box"
            value={answer}
            placeholder="Say it out loud first, then type roughly what you said."
            onChange={(event) => saveInterview(question.id, event.target.value)}
          />
          <p className="field__hint">Saved as you type. Nothing leaves this device.</p>
        </div>

        <div className="stack">
          <p style={{ fontWeight: 700, color: 'var(--navy)' }}>Need a starting point? Pick one and edit it:</p>
          {question.sampleAnswers.map((sample) => (
            <button
              key={sample}
              type="button"
              className="choice"
              onClick={() => saveInterview(question.id, sample)}
            >
              <span className="choice__mark" aria-hidden="true">+</span>
              <span>{sample}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="row">
        <button
          type="button"
          className="btn btn--quiet"
          onClick={() => (step === 0 ? go('home') : setStep(step - 1))}
        >
          {step === 0 ? 'Back to home' : 'Previous question'}
        </button>
        <div className="spacer" />
        <span className="tag">{answered} of {questions.length} answered</span>
        <button
          type="button"
          className="btn btn--gold"
          onClick={() => (isLast ? setReviewing(true) : setStep(step + 1))}
        >
          {isLast ? 'Review all my answers' : 'Next question'}
        </button>
      </div>
    </div>
  )
}
