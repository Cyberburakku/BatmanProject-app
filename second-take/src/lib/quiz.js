// The eight Check-In Quiz questions, and the scoring rules from the build doc.
// Every point value below comes straight from that spec.

export const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    prompt: 'When you think about your release, how confident do you feel that real support will be there for you?',
    type: 'choice',
    options: [
      { value: 'very', label: 'Very confident' },
      { value: 'somewhat', label: 'Somewhat confident' },
      { value: 'not', label: 'Not confident at all' },
      { value: 'unsure', label: 'Not sure' }
    ]
  },
  {
    id: 'q2',
    prompt: "Who do you expect to be your main support once you're out?",
    type: 'choice',
    options: [
      { value: 'family', label: 'Family' },
      { value: 'peer', label: "A peer or mentor who's been through it" },
      { value: 'faith', label: 'A community or faith group' },
      { value: 'program', label: 'A program or caseworker' },
      { value: 'none', label: "I'm not sure I'll have one" }
    ]
  },
  {
    id: 'q3',
    prompt: 'How often do you currently talk to that person or group?',
    type: 'choice',
    options: [
      { value: 'regularly', label: 'Regularly' },
      { value: 'sometimes', label: 'Sometimes' },
      { value: 'rarely', label: 'Rarely' },
      { value: 'never', label: 'Not at all right now' }
    ]
  },
  {
    id: 'q4',
    prompt: 'What do you feel most unprepared for right now?',
    type: 'choice',
    options: [
      { value: 'housing', label: 'Housing' },
      { value: 'employment', label: 'Employment' },
      { value: 'family', label: 'Reconnecting with family' },
      { value: 'technology', label: 'Managing technology' },
      { value: 'emotional', label: 'Emotional or mental readiness' },
      { value: 'other', label: 'Something else' }
    ]
  },
  {
    id: 'q5',
    prompt: "How comfortable are you with the technology you'll need once you're out, like a smartphone, email, or job applications online?",
    type: 'choice',
    options: [
      { value: 'very', label: 'Very comfortable' },
      { value: 'somewhat', label: 'Somewhat comfortable' },
      { value: 'not', label: 'Not comfortable' },
      { value: 'untested', label: "Haven't had a chance to practice" }
    ]
  },
  {
    id: 'q6',
    prompt: 'How comfortable do you feel talking about your record in a job interview?',
    type: 'choice',
    options: [
      { value: 'very', label: 'Very comfortable' },
      { value: 'somewhat', label: 'Somewhat comfortable' },
      { value: 'not', label: 'Not comfortable' },
      { value: 'untried', label: 'Never had to try yet' }
    ]
  },
  {
    id: 'q7',
    prompt: "What's your biggest worry about feeling judged or isolated once you're out?",
    type: 'text',
    placeholder: 'Write as much or as little as you want. This stays on this device.'
  },
  {
    id: 'q8',
    prompt: 'If you could build one skill right now that would carry into a job or life outside, what would it be?',
    type: 'choice',
    options: [
      { value: 'technology', label: 'Technology or computer skills' },
      { value: 'vocational', label: 'A vocational or trade skill' },
      { value: 'education', label: 'Education or coursework' },
      { value: 'communication', label: 'Communication or interpersonal skills' },
      { value: 'other', label: 'Something else' }
    ]
  }
]

// --- Scoring -------------------------------------------------------------

const Q5_POINTS = { very: 0, somewhat: 1, not: 2, untested: 2 }
const Q2_POINTS = { family: 0, peer: 0, faith: 0, program: 1, none: 2 }
const Q3_POINTS = { regularly: 0, sometimes: 1, rarely: 2, never: 3 }
const Q6_POINTS = { very: 0, somewhat: 1, not: 2, untried: 2 }

export function scoreQuiz(answers) {
  // Technology Score: Q5 plus one point if Q8 is technology skills.
  const technologyScore = (Q5_POINTS[answers.q5] ?? 0) + (answers.q8 === 'technology' ? 1 : 0)

  // Support Score: Q2 plus Q3.
  const supportScore = (Q2_POINTS[answers.q2] ?? 0) + (Q3_POINTS[answers.q3] ?? 0)

  // Interview Confidence Score: Q6 on its own.
  const interviewScore = Q6_POINTS[answers.q6] ?? 0

  const technologyLevel = technologyScore >= 2 ? 1 : 2

  return {
    technologyScore,
    technologyLevel,
    technologyLabel: technologyLevel === 1 ? 'Digital Basics' : 'Everyday Tech Skills',
    slowerPacing: technologyScore >= 2,
    technologyUrgent: technologyScore >= 2,

    supportScore,
    supportPlacement: supportScore >= 4 ? 'first' : supportScore >= 2 ? 'early' : 'standard',

    interviewScore,
    insertRecordModule: interviewScore >= 2,

    // Staff flags, shown on the results screen so a coach can act on them.
    staffFlags: [
      technologyScore >= 2 && 'Technology: needs slower pacing through Digital Basics',
      supportScore >= 4 && 'Support: little or no support network in place',
      interviewScore >= 2 && 'Interview: not yet comfortable talking about their record'
    ].filter(Boolean)
  }
}
