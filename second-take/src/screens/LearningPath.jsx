import ImagePlaceholder from '../components/ImagePlaceholder'
import ProgressBar from '../components/ProgressBar'

export default function LearningPath({ state, lessons, toggleLesson, go }) {
  const doneIds = state.completedLessons
  const currentIndex = lessons.findIndex((lesson) => !doneIds.includes(lesson.id))

  return (
    <div className="screen stack">
      <header className="screen__header">
        <h1>Your Learning Path</h1>
        <p>
          Green means finished. Gold is the one you are on. Gray is still ahead of you.
          {state.startingPoint ? ` Your path starts with ${state.startingPoint.category.toLowerCase()} because of your quiz answers.` : ''}
        </p>
      </header>

      <section className="card">
        <ProgressBar done={doneIds.length} total={lessons.length} />
      </section>

      {lessons.length === 0 ? (
        <div className="card">
          <h3>No lessons to show</h3>
          <p style={{ color: 'var(--muted)' }}>Staff have removed every lesson in the admin dashboard. Add one back to see the path again.</p>
        </div>
      ) : (
        <ol className="trail">
          {lessons.map((lesson, index) => {
            const done = doneIds.includes(lesson.id)
            const current = index === currentIndex
            const status = done ? 'done' : current ? 'current' : 'upcoming'
            const label = done ? 'Completed' : current ? 'You are here' : 'Coming up'

            return (
              <li key={lesson.id} className={`trail__item trail__item--${status}`}>
                <div className="trail__rail">
                  <span className="trail__dot" aria-hidden="true">{done ? '✓' : index + 1}</span>
                  {index < lessons.length - 1 && <span className="trail__line" />}
                </div>

                <div className="trail__body">
                  <div className="trail__card stack">
                    <div className="row">
                      <span className={`tag tag--${done ? 'green' : current ? 'gold' : ''}`}>{label}</span>
                      <span className="tag">{lesson.category}</span>
                      <span className="tag">{lesson.subcategory}</span>
                    </div>

                    <h3>{lesson.title}</h3>
                    <p style={{ color: 'var(--muted)' }}>{lesson.description}</p>

                    <ImagePlaceholder height={current ? 150 : 110} />

                    <div className="row">
                      <a className="btn btn--ghost btn--small" href={lesson.link} target="_blank" rel="noreferrer">
                        Open the lesson
                      </a>
                      <button
                        type="button"
                        className={`btn btn--small ${done ? 'btn--quiet' : 'btn--green'}`}
                        onClick={() => toggleLesson(lesson.id)}
                      >
                        {done ? 'Mark as not done' : 'Mark as done'}
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      )}

      <div className="row">
        <button type="button" className="btn btn--quiet" onClick={() => go('home')}>Back to home</button>
        <button type="button" className="btn btn--gold" onClick={() => go('resources')}>Browse the resource directory</button>
      </div>
    </div>
  )
}
