import content from '../data/content.json'
import Icon from '../components/Icon'
import SunriseProgress from '../components/SunriseProgress'
import { describeWait, UNLOCK_DELAY_HOURS } from '../lib/unlock'

export default function LearningPath({ statuses, scores, skipWait, onToggleSkipWait, openStep, go }) {
  const done = statuses.filter((s) => s.state === 'done').length
  const currentIndex = statuses.findIndex((s) => s.state === 'current')

  return (
    <div className="screen">
      <header className="screen__header">
        <h1>Your Learning Path</h1>
        <p>
          One lesson at a time. Each new lesson opens {UNLOCK_DELAY_HOURS} hours after you finish the
          one before it, so nothing piles up on you.
        </p>
      </header>

      <section className="card">
        <SunriseProgress done={done} total={statuses.length} />
      </section>

      {!scores && (
        <div className="card card--gold block">
          <h3>You haven't taken the check-in yet</h3>
          <p>This is the standard path. Take the quiz and it reorders around your answers.</p>
          <button type="button" className="btn btn--small" onClick={() => go('quiz')}>
            Take the check-in quiz
          </button>
        </div>
      )}

      <ol className="trail">
        {statuses.map((step, index) => {
          const isCurrent = step.state === 'current'
          const label =
            step.state === 'done' ? 'Completed'
            : isCurrent ? "You're here"
            : step.state === 'waiting' ? describeWait(step.unlocksAt)
            : 'Locked'

          return (
            <li key={step.key} className={`trail__item trail__item--${step.state}`}>
              <div className="trail__rail">
                <span className="trail__dot">
                  {step.state === 'done'
                    ? <Icon name="check" size={22} strokeWidth={3.4} />
                    : step.state === 'locked' || step.state === 'waiting'
                      ? <Icon name="lock" size={20} />
                      : index + 1}
                </span>
                {index < statuses.length - 1 && <span className="trail__line" />}
              </div>

              <div className="trail__body">
                <div className="trail__card">
                  <div className="row" style={{ gap: 8 }}>
                    <span className={`tag ${step.state === 'done' ? 'tag--teal' : isCurrent ? 'tag--gold' : ''}`}>
                      {label}
                    </span>
                    <span className="tag">{step.moduleTitle}</span>
                  </div>

                  <h3 className="trail__title">
                    <Icon name={step.icon} size={22} /> {step.title}
                  </h3>

                  {isCurrent && (
                    <>
                      <p className="normalize">{content.app_meta.normalize_message}</p>
                      <button type="button" className="btn" onClick={() => openStep(step)}>
                        Start Lesson
                      </button>
                    </>
                  )}

                  {step.state === 'done' && (
                    <button type="button" className="btn btn--quiet btn--small" onClick={() => openStep(step)}>
                      Look at it again
                    </button>
                  )}

                  {step.state === 'waiting' && (
                    <p style={{ color: 'var(--muted)' }}>
                      Finished the last one. This opens {describeWait(step.unlocksAt).toLowerCase()}.
                    </p>
                  )}

                  {step.state === 'locked' && (
                    <p style={{ color: 'var(--muted)' }}>
                      Opens once you finish the lesson above.
                    </p>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ol>

      {currentIndex === -1 && done === statuses.length && (
        <div className="card card--gold center block">
          <h2>You finished the whole path</h2>
          <p>Every lesson is done. Your certificates are on the home screen whenever you want them.</p>
        </div>
      )}

      {/* Demo control: a stakeholder cannot wait 24 hours between lessons. */}
      <section className="card block">
        <h3>Demo controls</h3>
        <p style={{ color: 'var(--muted)' }}>
          For showing the app to someone. Turning this on removes the {UNLOCK_DELAY_HOURS}-hour wait so you
          can walk through the whole path in one sitting. Participants would not see this.
        </p>
        <button
          type="button"
          className={`btn btn--small ${skipWait ? 'btn--teal' : 'btn--quiet'}`}
          aria-pressed={skipWait}
          onClick={() => onToggleSkipWait(!skipWait)}
        >
          {skipWait
            ? `Wait is off — lessons open right away`
            : `Skip the ${UNLOCK_DELAY_HOURS}-hour wait`}
        </button>
      </section>
    </div>
  )
}
