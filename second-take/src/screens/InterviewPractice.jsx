import { useState } from 'react'
import Icon from '../components/Icon'

// Kept because the build doc places this step in the learning path order.
const QUESTIONS = [
  {
    id: 'iq-1',
    question: 'Tell me a little about yourself.',
    tip: 'Keep it near a minute. Where you are from, what you are good at, and the work you want next.'
  },
  {
    id: 'iq-2',
    question: 'Why should we hire you for this role?',
    tip: 'Name one or two strengths and tie each one to something the job actually needs.'
  },
  {
    id: 'iq-3',
    question: 'I see a gap in your work history. Can you tell me about it?',
    tip: 'Short and honest, then turn it forward. You do not owe anyone the full story.'
  },
  {
    id: 'iq-4',
    question: 'Tell me about a time you handled a difficult situation at work.',
    tip: 'Three steps: what happened, what you did, how it turned out.'
  },
  {
    id: 'iq-5',
    question: 'What are you hoping to learn in this job?',
    tip: 'Employers like people who plan to stick around. Show that you want to grow.'
  },
  {
    id: 'iq-6',
    question: 'Where do you see yourself in two years?',
    tip: 'Keep it realistic and tied to this employer. Steady beats flashy.'
  }
]

export default function InterviewPractice({ responses, onSave, isDone, onComplete, back }) {
  const [step, setStep] = useState(0)
  const question = QUESTIONS[step]
  const isLast = step === QUESTIONS.length - 1
  const answered = Object.values(responses).filter((text) => text && text.trim()).length

  return (
    <div className="screen">
      <div className="row">
        <button type="button" className="btn btn--quiet btn--small" onClick={back}>Back to my path</button>
      </div>

      <header className="screen__header">
        <div className="row" style={{ gap: 8, marginBottom: 10 }}>
          <span className="tag tag--teal">Interview Practice</span>
          {isDone && <span className="tag tag--gold">Completed</span>}
        </div>
        <h1><Icon name="mic" size={28} /> Interview Practice</h1>
        <p>Question {step + 1} of {QUESTIONS.length}. Say it out loud first, then type roughly what you said.</p>
      </header>

      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }} />
      </div>

      <section className="card block">
        <h2>{question.question}</h2>
        <p className="lesson__encouragement"><strong>Tip:</strong> {question.tip}</p>
        <div className="field">
          <label htmlFor="answer-box">Your answer</label>
          <textarea
            id="answer-box"
            value={responses[question.id] || ''}
            placeholder="However you would really say it."
            onChange={(event) => onSave(question.id, event.target.value)}
          />
          <p className="field__hint">Saved as you type. Nothing leaves this device.</p>
        </div>
      </section>

      <div className="row">
        <button
          type="button"
          className="btn btn--quiet"
          onClick={() => (step === 0 ? back() : setStep(step - 1))}
        >
          {step === 0 ? 'Back to my path' : 'Previous'}
        </button>
        <div className="spacer" />
        <span className="tag">{answered} of {QUESTIONS.length} answered</span>
        {isLast ? (
          isDone ? (
            <span className="tag tag--teal">Already finished</span>
          ) : (
            <button type="button" className="btn" onClick={onComplete}>
              <Icon name="check" size={20} strokeWidth={3} /> Mark practice done
            </button>
          )
        ) : (
          <button type="button" className="btn" onClick={() => setStep(step + 1)}>Next question</button>
        )}
      </div>
    </div>
  )
}
