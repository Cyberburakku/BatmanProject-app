// Lesson content lives in markdown files under src/content. Vite inlines them
// at build time, so the finished app needs no network and no file reads.
const files = import.meta.glob('../content/**/*.md', { query: '?raw', import: 'default', eager: true })

// Keyed by the path the JSON's content_ref uses, e.g.
// "content/technology/tech_phone_01.md" or "Building_Your_Support_Network.md".
const byName = {}
for (const [path, text] of Object.entries(files)) {
  const clean = path.replace('../', '')
  byName[clean] = text
  byName[clean.split('/').pop()] = text
}

// Splits "<!-- lesson-2 -->" blocks out of a module file.
function sliceLesson(text, fragment) {
  if (!fragment) return text
  const marker = `<!-- ${fragment} -->`
  const start = text.indexOf(marker)
  if (start === -1) return text
  const after = text.slice(start + marker.length)
  const next = after.indexOf('<!-- lesson-')
  return next === -1 ? after : after.slice(0, next)
}

// Turns "## Heading" + paragraphs into named sections, so each one can be
// styled to spec (golden Activity header, teal Encouragement line).
function toSections(text) {
  const sections = []
  let current = null
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim()
    if (!line) continue
    const heading = line.match(/^##\s+(.*)$/)
    if (heading) {
      current = { heading: heading[1].trim(), paragraphs: [] }
      sections.push(current)
      continue
    }
    if (!current) {
      current = { heading: '', paragraphs: [] }
      sections.push(current)
    }
    current.paragraphs.push(line.replace(/^-\s+/, ''))
  }
  return sections
}

export function loadLesson(contentRef) {
  if (!contentRef) return []
  const [path, fragment] = contentRef.split('#')
  const text = byName[path] || byName[path.split('/').pop()]
  if (!text) {
    console.warn('No lesson content found for', contentRef)
    return []
  }
  return toSections(sliceLesson(text, fragment))
}

export function lessonSection(sections, heading) {
  return sections.find((s) => s.heading.toLowerCase() === heading.toLowerCase())
}
