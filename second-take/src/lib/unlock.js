import content from '../data/content.json'

const DELAY_HOURS = content.app_meta.unlock_delay_hours ?? 24
const MS_PER_HOUR = 60 * 60 * 1000

// Progressive disclosure: a step is available once the step before it has been
// completed AND the unlock delay has passed since that completion. The first
// step is always available. skipWait is the demo override.
export function stepStatus(steps, completed, skipWait, now = Date.now()) {
  return steps.map((step, index) => {
    const doneAt = completed[step.key]
    if (doneAt) return { ...step, state: 'done', doneAt }

    if (index === 0) return { ...step, state: 'current', unlocksAt: null }

    const previous = steps[index - 1]
    const previousDoneAt = completed[previous.key]
    if (!previousDoneAt) return { ...step, state: 'locked', unlocksAt: null }

    const unlocksAt = new Date(previousDoneAt).getTime() + DELAY_HOURS * MS_PER_HOUR
    if (skipWait || now >= unlocksAt) return { ...step, state: 'current', unlocksAt }
    return { ...step, state: 'waiting', unlocksAt }
  })
}

export function currentStep(statuses) {
  return statuses.find((s) => s.state === 'current') || null
}

export function describeWait(unlocksAt, now = Date.now()) {
  const ms = unlocksAt - now
  if (ms <= 0) return 'Ready now'
  const hours = Math.floor(ms / MS_PER_HOUR)
  const minutes = Math.ceil((ms % MS_PER_HOUR) / (60 * 1000))
  if (hours >= 1) return `Unlocks in ${hours} hour${hours === 1 ? '' : 's'}`
  return `Unlocks in ${minutes} minute${minutes === 1 ? '' : 's'}`
}

export const UNLOCK_DELAY_HOURS = DELAY_HOURS
