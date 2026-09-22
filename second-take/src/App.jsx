import { useCallback, useEffect, useMemo, useState } from 'react'
import content from './data/content.json'
import { blankState, clearState, loadState, readSkipWait, saveState, writeSkipWait } from './lib/storage'
import { applyTheme, readTheme } from './lib/theme'
import { buildLearningPath, CERTIFICATE_MODULES, moduleLessonKeys, moduleTitleById } from './lib/path'
import { stepStatus } from './lib/unlock'

import Icon from './components/Icon'
import CrisisBar from './components/CrisisBar'
import AffirmationTicker from './components/AffirmationTicker'
import Celebration from './components/Celebration'
import Toast from './components/Toast'

import Welcome from './screens/Welcome'
import Home from './screens/Home'
import CheckInQuiz from './screens/CheckInQuiz'
import LearningPath from './screens/LearningPath'
import LessonScreen from './screens/LessonScreen'
import ResourceDirectory from './screens/ResourceDirectory'
import InterviewPractice from './screens/InterviewPractice'
import ComingSoon from './screens/ComingSoon'
import CertificateScreen from './screens/CertificateScreen'

const NAV = [
  { key: 'home', label: 'Home' },
  { key: 'quiz', label: 'Check-In' },
  { key: 'path', label: 'My Path' },
  { key: 'resources', label: 'Resources' }
]

function randomAffirmation() {
  const list = content.Affirmations
  return list[Math.floor(Math.random() * list.length)]
}

export default function App() {
  const [state, setState] = useState(loadState)
  const [screen, setScreen] = useState('home')
  const [openStepKey, setOpenStepKey] = useState(null)
  const [certificateModule, setCertificateModule] = useState(null)
  const [theme, setTheme] = useState(readTheme)
  const [skipWait, setSkipWait] = useState(readSkipWait)
  const [toast, setToast] = useState('')
  const [celebration, setCelebration] = useState(0)

  // One affirmation, picked once per app load, shown on the homepage.
  const [affirmation] = useState(randomAffirmation)

  useEffect(() => { saveState(state) }, [state])
  useEffect(() => { applyTheme(theme) }, [theme])
  useEffect(() => { window.scrollTo(0, 0) }, [screen, openStepKey])

  const steps = useMemo(() => buildLearningPath(state.scores), [state.scores])

  // Recomputed on a timer so a lesson's 24-hour wait turns into "current"
  // without needing a refresh.
  const [clock, setClock] = useState(() => Date.now())
  useEffect(() => {
    const tick = setInterval(() => setClock(Date.now()), 30000)
    return () => clearInterval(tick)
  }, [])

  const statuses = useMemo(
    () => stepStatus(steps, state.completed, skipWait, clock),
    [steps, state.completed, skipWait, clock]
  )

  const openStep = statuses.find((s) => s.key === openStepKey) || null
  const showToast = useCallback((message) => setToast(message), [])

  function saveName(name) {
    setState((previous) => ({ ...previous, name }))
  }

  function saveQuiz(answers, scores) {
    setState((previous) => ({ ...previous, quizAnswers: answers, scores }))
  }

  function saveLessonInput(stepKey, fieldId, value) {
    setState((previous) => ({
      ...previous,
      lessonInputs: {
        ...previous.lessonInputs,
        [stepKey]: { ...(previous.lessonInputs[stepKey] || {}), [fieldId]: value }
      }
    }))
  }

  function saveInterview(questionId, value) {
    setState((previous) => ({
      ...previous,
      interviewResponses: { ...previous.interviewResponses, [questionId]: value }
    }))
  }

  function toggleCheck(index) {
    setState((previous) => ({
      ...previous,
      checklist: { ...previous.checklist, [index]: !previous.checklist[index] }
    }))
  }

  function completeStep(step) {
    const finishedAt = new Date().toISOString()

    setState((previous) => {
      const completed = { ...previous.completed, [step.key]: finishedAt }
      let certificates = previous.certificates

      // A certificate is earned the moment every lesson in the module is done.
      if (step.moduleId && CERTIFICATE_MODULES.includes(step.moduleId)) {
        const keys = moduleLessonKeys(step.moduleId)
        const allDone = keys.length > 0 && keys.every((key) => completed[key])
        if (allDone && !certificates[step.moduleId]) {
          certificates = { ...certificates, [step.moduleId]: finishedAt }
        }
      }

      return { ...previous, completed, certificates }
    })

    setCelebration(Date.now())
    setOpenStepKey(null)

    // Check module completion again outside setState so we know where to go next.
    if (step.moduleId && CERTIFICATE_MODULES.includes(step.moduleId)) {
      const keys = moduleLessonKeys(step.moduleId)
      const allDone = keys.length > 0 && keys.every((key) => key === step.key || state.completed[key])
      if (allDone && !state.certificates[step.moduleId]) {
        setCertificateModule(step.moduleId)
        setScreen('certificate')
        return
      }
    }

    setScreen('path')
    showToast('Lesson complete. Nice work.')
  }

  function startOver() {
    clearState()
    setState(blankState())
    setOpenStepKey(null)
    setScreen('home')
    showToast('Started over. Your progress is cleared.')
  }

  function toggleSkipWait(value) {
    setSkipWait(value)
    writeSkipWait(value)
  }

  const earnedCertificates = CERTIFICATE_MODULES
    .filter((id) => state.certificates[id])
    .map((id) => ({ id, title: moduleTitleById(id), issuedOn: state.certificates[id] }))

  // Name is asked once, before anything else.
  if (!state.name) {
    return (
      <div className="app">
        <header className="topbar">
          <div className="topbar__brand">
            <h1>Second Take</h1>
            <span className="topbar__tag">Getting ready, one step at a time</span>
          </div>
        </header>
        <Welcome onSubmit={saveName} />
        <AffirmationTicker />
        <CrisisBar />
      </div>
    )
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__brand">
          <h1>Second Take</h1>
          <span className="topbar__tag">Getting ready, one step at a time</span>
        </div>

        <nav className="topnav" aria-label="Main">
          {NAV.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`btn btn--ghost-light btn--small${screen === item.key ? ' is-active' : ''}`}
              onClick={() => { setOpenStepKey(null); setScreen(item.key) }}
            >
              {item.label}
            </button>
          ))}
          <button
            type="button"
            className="btn btn--ghost-light btn--small"
            aria-pressed={theme === 'dark'}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={18} />
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          <button type="button" className="btn btn--ghost-light btn--small" onClick={startOver}>
            Start over
          </button>
        </nav>
      </header>

      {openStep && openStep.kind === 'lesson' && (
        <LessonScreen
          step={openStep}
          state={state}
          isDone={!!state.completed[openStep.key]}
          onSaveInput={saveLessonInput}
          onToggleCheck={toggleCheck}
          onComplete={completeStep}
          back={() => { setOpenStepKey(null); setScreen('path') }}
        />
      )}

      {openStep && openStep.kind === 'checklist' && (
        <LessonScreen
          step={openStep}
          state={state}
          isDone={!!state.completed[openStep.key]}
          onSaveInput={saveLessonInput}
          onToggleCheck={toggleCheck}
          onComplete={completeStep}
          back={() => { setOpenStepKey(null); setScreen('path') }}
        />
      )}

      {openStep && openStep.kind === 'interview' && (
        <InterviewPractice
          responses={state.interviewResponses}
          onSave={saveInterview}
          isDone={!!state.completed[openStep.key]}
          onComplete={() => completeStep(openStep)}
          back={() => { setOpenStepKey(null); setScreen('path') }}
        />
      )}

      {!openStep && screen === 'home' && (
        <>
          <Home
            name={state.name}
            affirmation={affirmation}
            steps={steps}
            completed={state.completed}
            scores={state.scores}
            go={setScreen}
          />
          {earnedCertificates.length > 0 && (
            <div className="screen" style={{ paddingTop: 0 }}>
              <section className="card card--gold block">
                <h2><Icon name="award" size={24} /> Your certificates</h2>
                {earnedCertificates.map((cert) => (
                  <button
                    key={cert.id}
                    type="button"
                    className="btn btn--gold"
                    onClick={() => { setCertificateModule(cert.id); setScreen('certificate') }}
                  >
                    {cert.title}
                  </button>
                ))}
              </section>
            </div>
          )}
        </>
      )}

      {!openStep && screen === 'quiz' && (
        <CheckInQuiz
          saved={state.quizAnswers}
          savedScores={state.scores}
          onFinish={saveQuiz}
          go={setScreen}
        />
      )}

      {!openStep && screen === 'path' && (
        <LearningPath
          statuses={statuses}
          scores={state.scores}
          skipWait={skipWait}
          onToggleSkipWait={toggleSkipWait}
          openStep={(step) => setOpenStepKey(step.key)}
          go={setScreen}
        />
      )}

      {!openStep && screen === 'resources' && <ResourceDirectory go={setScreen} />}
      {!openStep && screen === 'employment' && <ComingSoon go={setScreen} />}

      {!openStep && screen === 'certificate' && certificateModule && (
        <CertificateScreen
          name={state.name}
          moduleTitle={moduleTitleById(certificateModule)}
          issuedOn={state.certificates[certificateModule]}
          back={() => setScreen('path')}
        />
      )}

      <Celebration token={celebration} />
      <Toast message={toast} onDone={() => setToast('')} />
      <AffirmationTicker />
      <CrisisBar />
    </div>
  )
}
