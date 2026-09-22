import content from '../data/content.json'
import Icon from '../components/Icon'
import LessonContent from '../components/LessonContent'
import { loadLesson } from '../lib/markdown'
import { LESSON_INPUTS, RELEASE_CHECKLIST } from '../lib/path'

// Flattens the Connections groups so a lesson's linked_resources can be found by id.
const ALL_RESOURCES = Object.values(content.Connections).flat()

export default function LessonScreen({ step, state, isDone, onSaveInput, onToggleCheck, onComplete, back }) {
  const sections = loadLesson(step.contentRef)
  const fields = LESSON_INPUTS[step.key] || []
  const values = state.lessonInputs[step.key] || {}
  const resources = (step.linkedResources || [])
    .map((id) => ALL_RESOURCES.find((r) => r.id === id))
    .filter(Boolean)

  return (
    <div className="screen">
      <div className="row">
        <button type="button" className="btn btn--quiet btn--small" onClick={back}>
          Back to my path
        </button>
      </div>

      <header className="screen__header">
        <div className="row" style={{ gap: 8, marginBottom: 10 }}>
          <span className="tag tag--teal">{step.moduleTitle}</span>
          {isDone && <span className="tag tag--gold">Completed</span>}
        </div>
        <h1><Icon name={step.icon} size={28} /> {step.title}</h1>
      </header>

      <article className="card">
        <LessonContent sections={sections}>
          {fields.length > 0 && (
            <div>
              {fields.map((field) => (
                <div className="field" key={field.id}>
                  <label htmlFor={`${step.key}-${field.id}`}>{field.label}</label>
                  {field.long ? (
                    <textarea
                      id={`${step.key}-${field.id}`}
                      value={values[field.id] || ''}
                      placeholder={field.placeholder}
                      onChange={(event) => onSaveInput(step.key, field.id, event.target.value)}
                    />
                  ) : (
                    <input
                      id={`${step.key}-${field.id}`}
                      type="text"
                      value={values[field.id] || ''}
                      placeholder={field.placeholder}
                      onChange={(event) => onSaveInput(step.key, field.id, event.target.value)}
                    />
                  )}
                </div>
              ))}
              <p className="field__hint">Saved as you type. This stays on this device.</p>
            </div>
          )}

          {step.kind === 'checklist' && (
            <div className="block" style={{ gap: 10 }}>
              {RELEASE_CHECKLIST.map((item, index) => {
                const checked = !!state.checklist[index]
                return (
                  <button
                    key={item}
                    type="button"
                    className={`checkline${checked ? ' is-checked' : ''}`}
                    aria-pressed={checked}
                    onClick={() => onToggleCheck(index)}
                  >
                    <span className="checkline__box">
                      {checked ? <Icon name="check" size={16} strokeWidth={3.4} /> : null}
                    </span>
                    <span>{item}</span>
                  </button>
                )
              })}
            </div>
          )}

          {resources.length > 0 && (
            <div className="block">
              {resources.map((resource) => (
                <div className="resource-card" key={resource.id}>
                  <span className="resource-card__icon"><Icon name={resource.icon} size={24} /></span>
                  <h3>{resource.name || resource.city}</h3>
                  {resource.address && <p className="resource-card__meta">{resource.address}</p>}
                  {resource.phone && <p className="resource-card__meta">{resource.phone}</p>}
                  <a className="btn btn--teal btn--small" href={resource.link} target="_blank" rel="noreferrer">
                    Open Resource
                  </a>
                </div>
              ))}
            </div>
          )}
        </LessonContent>
      </article>

      <div className="row">
        <button type="button" className="btn btn--quiet" onClick={back}>Back to my path</button>
        <div className="spacer" />
        {isDone ? (
          <span className="tag tag--teal"><Icon name="check" size={16} strokeWidth={3} /> Already finished</span>
        ) : (
          <button type="button" className="btn" onClick={() => onComplete(step)}>
            <Icon name="check" size={20} strokeWidth={3} /> Mark this lesson done
          </button>
        )}
      </div>
    </div>
  )
}
