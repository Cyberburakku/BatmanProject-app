import { useCallback, useEffect, useMemo, useState } from 'react'
import content from './data/content.json'
import { blankState, clearState, loadState, logEntry, makeId, saveState } from './lib/storage'
import { applyTheme, readTheme } from './lib/theme'

import CrisisBar from './components/CrisisBar'
import Toast from './components/Toast'
import Home from './screens/Home'
import CheckInQuiz from './screens/CheckInQuiz'
import LearningPath from './screens/LearningPath'
import ResourceDirectory from './screens/ResourceDirectory'
import InterviewPractice from './screens/InterviewPractice'
import AdminDashboard from './admin/AdminDashboard'

const CATEGORY_ORDER = ['Technology', 'Employment', 'Connections']

const PARTICIPANT_NAV = [
  { key: 'home', label: 'Home' },
  { key: 'quiz', label: 'Check-In Quiz' },
  { key: 'path', label: 'Learning Path' },
  { key: 'resources', label: 'Resources' },
  { key: 'interview', label: 'Interview Practice' }
]

export default function App() {
  const [state, setState] = useState(loadState)
  const [screen, setScreen] = useState('home')
  const [toast, setToast] = useState('')
  const [theme, setTheme] = useState(readTheme)

  // Every change is written straight back to localStorage, so the demo
  // survives a page refresh within the same browser.
  useEffect(() => { saveState(state) }, [state])

  useEffect(() => { window.scrollTo(0, 0) }, [screen])

  useEffect(() => { applyTheme(theme) }, [theme])

  const showToast = useCallback((message) => setToast(message), [])

  // Lessons for the path: the quiz's recommended category floats to the top.
  const lessons = useMemo(() => {
    const preferred = state.startingPoint?.category
    const order = preferred
      ? [preferred, ...CATEGORY_ORDER.filter((name) => name !== preferred)]
      : CATEGORY_ORDER

    return state.entries
      .filter((entry) => entry.type === 'lesson')
      .slice()
      .sort((a, b) => {
        const byCategory = order.indexOf(a.category) - order.indexOf(b.category)
        if (byCategory !== 0) return byCategory
        return (a.order || 0) - (b.order || 0)
      })
  }, [state.entries, state.startingPoint])

  const directoryEntries = useMemo(
    () =>
      state.entries
        .slice()
        .sort((a, b) => {
          const byCategory = CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
          if (byCategory !== 0) return byCategory
          return (a.order || 0) - (b.order || 0)
        }),
    [state.entries]
  )

  function saveQuiz(answers, startingPoint) {
    setState((previous) => ({ ...previous, quizAnswers: answers, startingPoint }))
  }

  function toggleLesson(id) {
    setState((previous) => {
      const done = previous.completedLessons.includes(id)
      return {
        ...previous,
        completedLessons: done
          ? previous.completedLessons.filter((item) => item !== id)
          : [...previous.completedLessons, id]
      }
    })
  }

  function saveInterview(id, text) {
    setState((previous) => ({
      ...previous,
      interviewResponses: { ...previous.interviewResponses, [id]: text }
    }))
  }

  const actions = {
    updateEntry(id, draft) {
      setState((previous) => {
        const existing = previous.entries.find((entry) => entry.id === id)
        const linkChanged = existing && existing.link !== draft.link
        return {
          ...previous,
          entries: previous.entries.map((entry) =>
            entry.id === id
              ? {
                  ...entry,
                  ...draft,
                  // Swapping in a new link clears the flag on it.
                  flagged: linkChanged ? false : entry.flagged,
                  flagReason: linkChanged ? '' : entry.flagReason
                }
              : entry
          ),
          activityLog: [
            logEntry(`Edited "${draft.title}"${linkChanged ? ' and replaced its link' : ''}`),
            ...previous.activityLog
          ]
        }
      })
    },

    addEntry(draft) {
      setState((previous) => {
        const sameCategory = previous.entries.filter((entry) => entry.category === draft.category)
        const nextOrder = sameCategory.reduce((max, entry) => Math.max(max, entry.order || 0), 0) + 1
        const entry = {
          id: makeId('entry'),
          flagged: false,
          flagReason: '',
          order: nextOrder,
          ...draft
        }
        return {
          ...previous,
          entries: [...previous.entries, entry],
          activityLog: [logEntry(`Added "${entry.title}" to ${entry.category}`), ...previous.activityLog]
        }
      })
    },

    removeEntry(id) {
      setState((previous) => {
        const removed = previous.entries.find((entry) => entry.id === id)
        return {
          ...previous,
          entries: previous.entries.filter((entry) => entry.id !== id),
          completedLessons: previous.completedLessons.filter((item) => item !== id),
          activityLog: [
            logEntry(`Removed "${removed ? removed.title : 'an entry'}" from ${removed ? removed.category : 'the app'}`),
            ...previous.activityLog
          ]
        }
      })
    }
  }

  function resetDemo() {
    clearState()
    setState(blankState())
    setScreen('home')
    showToast('Demo reset. Everything is back to its starting content.')
  }

  const isAdmin = screen === 'admin'

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar__brand">
          <h1>{content.appName}</h1>
          <span className="topbar__tag">{isAdmin ? 'Staff admin — demo mode' : 'Reentry coaching, one step at a time'}</span>
        </div>

        <nav className="topnav" aria-label="Main">
          {!isAdmin &&
            PARTICIPANT_NAV.map((item) => (
              <button
                key={item.key}
                type="button"
                className={`btn btn--ghost-light btn--small${screen === item.key ? ' is-active' : ''}`}
                onClick={() => setScreen(item.key)}
              >
                {item.label}
              </button>
            ))}
          <button
            type="button"
            className={`btn btn--small ${isAdmin ? 'btn--gold' : 'btn--ghost-light'}`}
            onClick={() => setScreen(isAdmin ? 'home' : 'admin')}
          >
            {isAdmin ? 'Exit admin' : 'Admin'}
          </button>
          <button
            type="button"
            className="btn btn--ghost-light btn--small theme-toggle"
            aria-pressed={theme === 'light'}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? '☀ Light mode' : '☾ Dark mode'}
          </button>
          <button type="button" className="btn btn--ghost-light btn--small" onClick={resetDemo}>
            Reset demo
          </button>
        </nav>
      </header>

      {screen === 'home' && <Home state={state} lessons={lessons} go={setScreen} />}
      {screen === 'quiz' && <CheckInQuiz state={state} lessons={lessons} saveQuiz={saveQuiz} go={setScreen} />}
      {screen === 'path' && <LearningPath state={state} lessons={lessons} toggleLesson={toggleLesson} go={setScreen} />}
      {screen === 'resources' && <ResourceDirectory entries={directoryEntries} go={setScreen} />}
      {screen === 'interview' && <InterviewPractice state={state} saveInterview={saveInterview} go={setScreen} />}
      {screen === 'admin' && (
        <AdminDashboard state={state} actions={actions} showToast={showToast} go={setScreen} />
      )}

      <Toast message={toast} onDone={() => setToast('')} />
      <CrisisBar />
    </div>
  )
}
