import content from '../data/content.json'

// The extra prompts each interactive lesson shows. The build doc specifies how
// many fields each lesson gets; these are the wordings.
export const LESSON_INPUTS = {
  support_lesson_01: [
    { id: 'a', label: 'Who would you call first if today went badly?' },
    { id: 'b', label: 'Who else could you call if that first person did not pick up?' },
    { id: 'c', label: 'Name one program, group, or worker who has actually followed through for you.' }
  ],
  support_lesson_03: [
    { id: 'message', label: 'Write the message you would actually send', long: true,
      placeholder: 'What you need. When you need it. Thank you.' }
  ],
  support_lesson_04: [
    { id: 'primary', label: 'My primary support' },
    { id: 'backup', label: 'My backup support' }
  ],
  record_lesson_02: [
    { id: 'what', label: 'In one sentence: what happened' },
    { id: 'did', label: 'In one sentence: what you did with the time' },
    { id: 'next', label: 'In one sentence: what you want next' }
  ],
  record_lesson_03: [
    { id: 'howlong', label: '"How long ago was it?"', long: true },
    { id: 'since', label: '"What have you been doing since?"', long: true },
    { id: 'different', label: '"What would you do differently?"', long: true }
  ]
}

export const RELEASE_CHECKLIST = [
  'I have a photo ID, or I know exactly where to request one.',
  'I have an email address I can get into.',
  'I have a phone, or a plan for getting one.',
  'I know where I am sleeping the first night.',
  'I have my primary and backup support written on paper.',
  'I have 211 and 988 written on that same paper.',
  'I know the date and time of my first appointment after release.',
  'I have one job lead or one place to start looking.'
]

const TECH = content.Technology.Digital_Basics
const SUPPORT = content.Learning_Path_Modules.Building_Your_Support_Network
const RECORD = content.Learning_Path_Modules.Talking_About_Your_Record

function techStep(lesson, index) {
  return {
    key: lesson.id,
    kind: 'lesson',
    title: lesson.title,
    icon: lesson.icon,
    contentRef: lesson.content_ref,
    moduleId: 'technology',
    moduleTitle: 'Technology Basics',
    unlockDay: lesson.unlock_day ?? index + 1
  }
}

function moduleSteps(mod) {
  return mod.lessons.map((lesson, index) => ({
    key: lesson.id,
    kind: 'lesson',
    type: lesson.type,
    title: lesson.title,
    icon: lesson.icon,
    contentRef: lesson.content_ref,
    linkedResources: lesson.linked_resources || [],
    moduleId: mod.id,
    moduleTitle: mod.title,
    certificate: !!mod.certificate_on_completion,
    unlockDay: lesson.unlock_day ?? index + 1
  }))
}

const INTERVIEW_STEP = {
  key: 'interview_practice',
  kind: 'interview',
  title: 'Interview Practice',
  icon: 'mic',
  moduleId: 'interview',
  moduleTitle: 'Interview Practice'
}

const CHECKLIST_STEP = {
  key: 'release_checklist',
  kind: 'checklist',
  title: 'Release-Day Checklist',
  icon: 'check-square',
  contentRef: 'content/modules/Release_Day_Checklist.md',
  moduleId: 'checklist',
  moduleTitle: 'Release Day'
}

// Path order, straight from the build doc's priority rules:
//   Support Score 4+  -> Building Your Support Network opens the path
//   Technology Score 2+ -> Digital Basics follows, at a slower pace
//   Interview Score 2 -> Talking About Your Record sits before Interview Practice
//   every path ends with the Release-Day Checklist
export function buildLearningPath(scores) {
  const tech = TECH.map(techStep)
  const support = moduleSteps(SUPPORT)
  const record = moduleSteps(RECORD)

  let steps = []

  if (!scores) {
    // Before the quiz is taken, show the default order.
    steps = [...tech, ...support, INTERVIEW_STEP, CHECKLIST_STEP]
  } else if (scores.supportPlacement === 'first') {
    steps = [...support, ...tech]
  } else if (scores.supportPlacement === 'early') {
    // "Early in the path" — straight after the first Technology lesson.
    steps = [tech[0], ...support, ...tech.slice(1)]
  } else {
    steps = [...tech]
  }

  if (scores && scores.insertRecordModule) {
    steps = [...steps, ...record, INTERVIEW_STEP]
  } else {
    steps = [...steps, INTERVIEW_STEP]
  }

  steps.push(CHECKLIST_STEP)

  // Guard against a module appearing twice if the rules ever overlap.
  const seen = new Set()
  return steps.filter((step) => {
    if (seen.has(step.key)) return false
    seen.add(step.key)
    return true
  })
}

export function moduleLessonKeys(moduleId) {
  if (moduleId === SUPPORT.id) return SUPPORT.lessons.map((l) => l.id)
  if (moduleId === RECORD.id) return RECORD.lessons.map((l) => l.id)
  return []
}

export function moduleTitleById(moduleId) {
  if (moduleId === SUPPORT.id) return SUPPORT.title
  if (moduleId === RECORD.id) return RECORD.title
  return ''
}

export const CERTIFICATE_MODULES = [SUPPORT.id, RECORD.id]
