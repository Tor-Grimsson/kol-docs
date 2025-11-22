const randomId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)

const slugify = (input = '') =>
  input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

const createSection = (title) => ({
  id: slugify(title) || randomId(),
  title: title.trim(),
  summary: '',
  content: [],
  subsections: []
})

const createSubsection = (title) => ({
  id: `${slugify(title)}-${randomId().slice(0, 6)}`,
  title: title.trim(),
  content: []
})

const flushParagraph = (buffer, target) => {
  if (buffer.length === 0) return

  const sentence = buffer.join(' ').replace(/\s+/g, ' ').trim()
  if (sentence) {
    target.push({ type: 'paragraph', content: { text: sentence } })
  }
  buffer.length = 0
}

const flushList = (buffer, target) => {
  if (buffer.length === 0) return
  target.push({ type: 'list', content: { items: [...buffer] } })
  buffer.length = 0
}

const flushCode = (buffer, target) => {
  if (buffer.length === 0) return
  target.push({ type: 'code', content: { code: buffer.join('\n'), language: 'text' } })
  buffer.length = 0
}

const ensureContentTarget = (section, subsection) => {
  if (subsection) return subsection.content
  if (section) return section.content
  return null
}

export const markdownToWiki = (markdown = '') => {
  const lines = markdown.split('\n')
  const sections = []
  const toc = []

  let currentSection = null
  let currentSubsection = null
  let paragraphBuffer = []
  let listBuffer = []
  let codeBuffer = []
  let inCodeBlock = false

  const closeOpenBlocks = () => {
    const target = ensureContentTarget(currentSection, currentSubsection)
    if (!target) return
    flushCode(codeBuffer, target)
    flushList(listBuffer, target)
    flushParagraph(paragraphBuffer, target)
  }

  const setSectionSummaryIfEmpty = () => {
    if (!currentSection || currentSection.summary) return
    const target = ensureContentTarget(currentSection, currentSubsection)
    const firstParagraph = target?.find((block) => block.type === 'paragraph')
    if (firstParagraph?.content?.text) {
      currentSection.summary = firstParagraph.content.text
    }
  }

  lines.forEach((line) => {
    const trimmed = line.trimEnd()

    if (trimmed.startsWith('```')) {
      const target = ensureContentTarget(currentSection, currentSubsection)
      if (!target) return
      if (inCodeBlock) {
        flushCode(codeBuffer, target)
        inCodeBlock = false
      } else {
        closeOpenBlocks()
        inCodeBlock = true
      }
      return
    }

    if (inCodeBlock) {
      codeBuffer.push(line)
      return
    }

    if (trimmed.startsWith('## ')) {
      closeOpenBlocks()
      setSectionSummaryIfEmpty()
      currentSubsection = null
      currentSection = createSection(trimmed.replace(/^##\s+/, ''))
      sections.push(currentSection)
      toc.push({ id: currentSection.id, label: currentSection.title, level: 2 })
      return
    }

    if (trimmed.startsWith('### ')) {
      closeOpenBlocks()
      setSectionSummaryIfEmpty()
      const subsection = createSubsection(trimmed.replace(/^###\s+/, ''))
      currentSubsection = subsection
      currentSection?.subsections?.push(subsection)
      toc.push({ id: subsection.id, label: subsection.title, level: 3 })
      return
    }

    if (/^-\s+/.test(trimmed)) {
      paragraphBuffer.length && closeOpenBlocks()
      listBuffer.push(trimmed.replace(/^-+\s*/, '').trim())
      return
    }

    if (trimmed === '') {
      closeOpenBlocks()
      return
    }

    paragraphBuffer.push(trimmed)
  })

  closeOpenBlocks()
  setSectionSummaryIfEmpty()

  return { sections, toc }
}

export const buildWikiObject = ({
  slug,
  title,
  subtitle,
  summary,
  status,
  readingTime,
  heroBadges,
  markdown
}) => {
  const normalizedSlug = slugify(slug || title || '')
  const heroList = heroBadges
    .split(',')
    .map((badge) => badge.trim())
    .filter(Boolean)

  const { sections, toc } = markdownToWiki(markdown)

  return {
    slug: normalizedSlug,
    title: title.trim(),
    subtitle: subtitle.trim(),
    summary: summary.trim(),
    meta: [
      { label: 'Status', value: status.trim() },
      { label: 'Reading time', value: readingTime.trim() }
    ],
    heroBadges: heroList,
    toc,
    sections
  }
}
