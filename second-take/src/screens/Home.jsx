import Icon from '../components/Icon'
import SunriseProgress from '../components/SunriseProgress'

export default function Home({ name, affirmation, steps, completed, scores, go }) {
  const done = steps.filter((step) => completed[step.key]).length

  return (
    <div className="screen">
      <header className="screen__header">
        <h1>Welcome back{name ? `, ${name}` : ''}</h1>
        <p>Pick up where you left off, or look ahead at what's coming. Go at your own pace.</p>
      </header>

      {/* One affirmation, chosen at random each time the app loads. */}
      <p className="affirmation">{affirmation}</p>

      <section className="card block" aria-label="Your progress">
        <h2>How far you've come</h2>
        <SunriseProgress
          done={done}
          total={steps.length}
          label={scores
            ? `Your path starts with ${steps[0]?.moduleTitle || steps[0]?.title}, based on your check-in answers.`
            : 'Take the check-in quiz and your path will reorder itself around your answers.'}
        />
      </section>

      <section className="block">
        <h2>Where would you like to go?</h2>
        <div className="grid">
          <button type="button" className="nav-tile" onClick={() => go('quiz')}>
            <Icon name="book-open" size={28} />
            <h3>Check-In Quiz</h3>
            <p>Eight questions that shape your learning path around what you actually need.</p>
          </button>
          <button type="button" className="nav-tile" onClick={() => go('path')}>
            <Icon name="sun" size={28} />
            <h3>Learning Path</h3>
            <p>One lesson at a time, with the one you're on marked in gold.</p>
          </button>
          <button type="button" className="nav-tile" onClick={() => go('resources')}>
            <Icon name="map-pin" size={28} />
            <h3>Resource Directory</h3>
            <p>Libraries, reentry programs, peer mentors, and fair chance hiring.</p>
          </button>
          <button type="button" className="nav-tile" onClick={() => go('employment')}>
            <Icon name="lock" size={28} />
            <h3>Employment</h3>
            <p>Coming in a future update. Here so you can see what's ahead.</p>
          </button>
        </div>
      </section>

      <div className="row">
        <button type="button" className="btn" onClick={() => go(scores ? 'path' : 'quiz')}>
          {scores ? 'Continue my learning path' : 'Start the check-in quiz'}
        </button>
      </div>
    </div>
  )
}
