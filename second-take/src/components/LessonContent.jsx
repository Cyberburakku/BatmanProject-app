import Icon from './Icon'
import { lessonSection } from '../lib/markdown'

// Renders a lesson's markdown sections with the layout the build doc calls for:
// a golden "Activity" header and a teal "Encouragement" closing line.
export default function LessonContent({ sections, children }) {
  const intro = lessonSection(sections, 'Introduction')
  const body = lessonSection(sections, 'Content')
  const activity = lessonSection(sections, 'Activity')
  const encouragement = lessonSection(sections, 'Encouragement')

  return (
    <div className="lesson">
      {intro && (
        <div>
          {intro.paragraphs.map((text, i) => (
            <p className="lesson__intro" key={i}>{text}</p>
          ))}
        </div>
      )}

      {body && (
        <div className="lesson__body">
          {body.paragraphs.map((text, i) => <p key={i}>{text}</p>)}
        </div>
      )}

      {(activity || children) && (
        <section className="lesson__activity">
          <h3 className="lesson__section-head">
            <Icon name="check-square" size={22} /> Activity
          </h3>
          {activity && activity.paragraphs.map((text, i) => <p key={i}>{text}</p>)}
          {children && <div style={{ marginTop: activity ? 18 : 0 }}>{children}</div>}
        </section>
      )}

      {encouragement && (
        <p className="lesson__encouragement">
          {encouragement.paragraphs.join(' ')}
        </p>
      )}
    </div>
  )
}
