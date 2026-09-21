import content from '../data/content.json'
import ProgressBar from '../components/ProgressBar'

export default function Home({ state, lessons, go }) {
  const doneCount = lessons.filter((lesson) => state.completedLessons.includes(lesson.id)).length
  const quizDone = Object.keys(state.quizAnswers).length === content.quizQuestions.length
  const practiced = Object.values(state.interviewResponses).filter((answer) => answer && answer.trim()).length
  const nextLesson = lessons.find((lesson) => !state.completedLessons.includes(lesson.id))

  return (
    <div className="screen stack">
      <header className="screen__header">
        <h1>{content.welcome.heading}</h1>
        <p>{content.welcome.body}</p>
      </header>

      <section className="card stack" aria-label="Your progress">
        <h2>Where you are right now</h2>
        <ProgressBar done={doneCount} total={lessons.length} />

        <div className="grid">
          <div className="card">
            <p className="card__label">Check-in quiz</p>
            <p className="card__number">{quizDone ? 'Done' : 'Not yet'}</p>
            <p style={{ color: 'var(--muted)', fontSize: 16 }}>
              {state.startingPoint
                ? `Your starting point: ${state.startingPoint.category}`
                : 'Five short questions to find your starting point.'}
            </p>
          </div>
          <div className="card">
            <p className="card__label">Lessons finished</p>
            <p className="card__number">{doneCount}</p>
            <p style={{ color: 'var(--muted)', fontSize: 16 }}>
              {nextLesson ? `Up next: ${nextLesson.title}` : 'You have finished every lesson. Nice work.'}
            </p>
          </div>
          <div className="card">
            <p className="card__label">Interview answers practiced</p>
            <p className="card__number">{practiced}</p>
            <p style={{ color: 'var(--muted)', fontSize: 16 }}>
              Out of {content.interviewQuestions.length} common questions.
            </p>
          </div>
        </div>
      </section>

      <h2>Where would you like to go?</h2>
      <div className="nav-tiles">
        <button type="button" className="nav-tile" onClick={() => go('quiz')}>
          <h3>Check-In Quiz</h3>
          <p>Answer five plain questions and we will point you to a good first lesson.</p>
        </button>
        <button type="button" className="nav-tile" onClick={() => go('path')}>
          <h3>Learning Path</h3>
          <p>Your lessons in order, with the one you are on marked in gold.</p>
        </button>
        <button type="button" className="nav-tile" onClick={() => go('resources')}>
          <h3>Resource Directory</h3>
          <p>Technology, employment, and connection resources you can search through.</p>
        </button>
        <button type="button" className="nav-tile" onClick={() => go('interview')}>
          <h3>Interview Practice</h3>
          <p>Practice real interview questions one at a time. Nothing you type is sent anywhere.</p>
        </button>
      </div>

      <div className="row">
        <button type="button" className="btn btn--gold" onClick={() => go(quizDone ? 'path' : 'quiz')}>
          {quizDone ? 'Continue my learning path' : 'Start the check-in quiz'}
        </button>
      </div>
    </div>
  )
}
