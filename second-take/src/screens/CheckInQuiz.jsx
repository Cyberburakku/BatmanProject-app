import { useState } from 'react'
import Icon from '../components/Icon'
import { QUIZ_QUESTIONS, scoreQuiz } from '../lib/quiz'

export default function CheckInQuiz({ saved, savedScores, onFinish, go }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(saved || {})
  const [result, setResult] = useState(savedScores || null)
  const [showResult, setShowResult] = useState(false)

  const question = QUIZ_QUESTIONS[step]
  const isLast = step === QUIZ_QUESTIONS.length - 1
  const answer = answers[question.id]
  // Question 7 is open text, so it is allowed to be left blank.
  const canAdvance = question.type === 'text' ? true : Boolean(answer)

  function next() {
    if (!isLast) { setStep(step + 1); return }
    const scores = scoreQuiz(answers)
    setResult(scores)
    setShowResult(true)
    onFinish(answers, scores)
  }

  if (showResult && result) {
    return (
      <div className="screen">
        <header className="screen__header">
          <h1>Here's your path</h1>
          <p>Nothing is locked in. You can retake the check-in any time and your path will change with it.</p>
        </header>

        <section className="card block">
          <h2>What your answers told us</h2>
          <div className="block">
            <div className="card card--teal">
              <h3>Technology: {result.technologyLabel}</h3>
              <p>
                {result.slowerPacing
                  ? 'We start you in Digital Basics and take it slower, one small step at a time.'
                  : 'You already have a footing here, so we move at a standard pace.'}
              </p>
            </div>
            <div className="card card--teal">
              <h3>Support network</h3>
              <p>
                {result.supportPlacement === 'first'
                  ? 'Building Your Support Network opens your path. Everything else is easier with people in your corner.'
                  : result.supportPlacement === 'early'
                    ? 'Building Your Support Network comes in early, right after your first lesson.'
                    : 'You have support in place, so we keep the standard order.'}
              </p>
            </div>
            <div className="card card--teal">
              <h3>Talking about your record</h3>
              <p>
                {result.insertRecordModule
                  ? 'The Talking About Your Record module sits right before Interview Practice, so you go in prepared.'
                  : 'Interview Practice stays in its normal spot in your path.'}
              </p>
            </div>
          </div>
        </section>

        {result.staffFlags.length > 0 && (
          <section className="card card--gold block">
            <h3><Icon name="users" size={20} /> Notes for your coach</h3>
            <p style={{ color: 'var(--muted)' }}>
              These show where a staff member might check in with you. They are only on this device.
            </p>
            <ul className="block" style={{ gap: 8 }}>
              {result.staffFlags.map((flag) => (
                <li key={flag} style={{ fontWeight: 700 }}>· {flag}</li>
              ))}
            </ul>
          </section>
        )}

        <div className="row">
          <button type="button" className="btn" onClick={() => go('path')}>
            Go to my learning path
          </button>
          <button
            type="button"
            className="btn btn--quiet"
            onClick={() => { setAnswers({}); setResult(null); setShowResult(false); setStep(0) }}
          >
            Take it again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="screen">
      <header className="screen__header">
        <h1>Check-In Quiz</h1>
        <p>Question {step + 1} of {QUIZ_QUESTIONS.length}. Pick whatever is closest to true for you.</p>
      </header>

      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${((step + 1) / QUIZ_QUESTIONS.length) * 100}%` }} />
      </div>

      <section className="card block">
        <h2>{question.prompt}</h2>

        {question.type === 'text' ? (
          <div className="field">
            <label htmlFor="quiz-text">Your answer</label>
            <textarea
              id="quiz-text"
              value={answer || ''}
              placeholder={question.placeholder}
              onChange={(event) => setAnswers({ ...answers, [question.id]: event.target.value })}
            />
            <p className="field__hint">You can skip this one if you would rather not answer.</p>
          </div>
        ) : (
          <div className="block" role="group" aria-label={question.prompt}>
            {question.options.map((option) => {
              const selected = answer === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`choice${selected ? ' is-selected' : ''}`}
                  aria-pressed={selected}
                  onClick={() => setAnswers({ ...answers, [question.id]: option.value })}
                >
                  <span className="choice__mark">{selected ? <Icon name="check" size={15} strokeWidth={3.4} /> : null}</span>
                  <span>{option.label}</span>
                </button>
              )
            })}
          </div>
        )}
      </section>

      <div className="row">
        <button
          type="button"
          className="btn btn--quiet"
          onClick={() => (step === 0 ? go('home') : setStep(step - 1))}
        >
          {step === 0 ? 'Back to home' : 'Previous'}
        </button>
        <div className="spacer" />
        <button type="button" className="btn" onClick={next} disabled={!canAdvance}>
          {isLast ? 'See my path' : 'Next question'}
        </button>
      </div>
    </div>
  )
}
