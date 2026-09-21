import { useState } from 'react'
import content from '../data/content.json'

// Counts which category the answers lean toward and returns a starting point.
function buildStartingPoint(answers, lessons) {
  const tally = { Technology: 0, Employment: 0, Connections: 0 }

  content.quizQuestions.forEach((question) => {
    const chosen = question.options.find((option) => option.value === answers[question.id])
    if (chosen) tally[chosen.category] += 1
  })

  const category = Object.keys(tally).reduce((best, key) => (tally[key] > tally[best] ? key : best), 'Technology')
  const firstLesson = lessons.find((lesson) => lesson.category === category) || lessons[0] || null

  const reasons = {
    Technology: 'Your answers say the device and internet basics are the place to start. Everything else gets easier once those click.',
    Employment: 'Your answers say you are ready to put work first, so we start with resumes and interviews.',
    Connections: 'Your answers point to paperwork and people first. Steady ground makes the rest of it stick.'
  }

  return { category, reason: reasons[category], firstLessonId: firstLesson ? firstLesson.id : null, tally }
}

export default function CheckInQuiz({ state, lessons, saveQuiz, go }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(state.quizAnswers || {})
  const [result, setResult] = useState(state.startingPoint || null)
  const [showResult, setShowResult] = useState(false)

  const questions = content.quizQuestions
  const question = questions[step]
  const isLast = step === questions.length - 1
  const currentAnswer = answers[question?.id]

  function choose(value) {
    setAnswers((previous) => ({ ...previous, [question.id]: value }))
  }

  function next() {
    if (!isLast) {
      setStep(step + 1)
      return
    }
    const startingPoint = buildStartingPoint(answers, lessons)
    setResult(startingPoint)
    setShowResult(true)
    saveQuiz(answers, startingPoint)
  }

  function restart() {
    setAnswers({})
    setResult(null)
    setShowResult(false)
    setStep(0)
  }

  if (showResult && result) {
    const firstLesson = lessons.find((lesson) => lesson.id === result.firstLessonId)
    return (
      <div className="screen stack">
        <header className="screen__header">
          <h1>Here is your starting point</h1>
          <p>Nothing here is locked in. You can take the quiz again any time.</p>
        </header>

        <section className="card stack">
          <span className="tag tag--gold">{result.category}</span>
          <h2>Start with {result.category.toLowerCase()} skills</h2>
          <p>{result.reason}</p>
          {firstLesson && (
            <div className="card">
              <p className="card__label">Your first lesson</p>
              <h3>{firstLesson.title}</h3>
              <p style={{ color: 'var(--muted)' }}>{firstLesson.description}</p>
            </div>
          )}
        </section>

        <div className="row">
          <button type="button" className="btn btn--gold" onClick={() => go('path')}>
            Go to my learning path
          </button>
          <button type="button" className="btn btn--ghost" onClick={restart}>
            Take the quiz again
          </button>
          <button type="button" className="btn btn--quiet" onClick={() => go('home')}>
            Back to home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="screen stack">
      <header className="screen__header">
        <h1>Check-In Quiz</h1>
        <p>Question {step + 1} of {questions.length}. Pick the answer that is closest to true for you.</p>
      </header>

      <div className="progress-track" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
      </div>

      <section className="card stack">
        <h2>{question.prompt}</h2>
        <p style={{ color: 'var(--muted)' }}>{question.helper}</p>
        <div className="stack" role="group" aria-label={question.prompt}>
          {question.options.map((option) => {
            const selected = currentAnswer === option.value
            return (
              <button
                key={option.value}
                type="button"
                className={`choice${selected ? ' is-selected' : ''}`}
                aria-pressed={selected}
                onClick={() => choose(option.value)}
              >
                <span className="choice__mark" aria-hidden="true">{selected ? '✓' : ''}</span>
                <span>{option.label}</span>
              </button>
            )
          })}
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
        <button type="button" className="btn btn--gold" onClick={next} disabled={!currentAnswer}>
          {isLast ? 'See my starting point' : 'Next question'}
        </button>
      </div>
    </div>
  )
}
