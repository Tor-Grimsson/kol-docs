import { parseMarkdown, parseFilename, getSectionLabel } from './markdownParser.js'

/**
 * Load all markdown files from the documentation directory
 * Uses Vite's import.meta.glob for dynamic imports
 */

// Import all markdown files
const markdownFiles = import.meta.glob('../data/documentation/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
})

/**
 * Parse all documentation files and organize them
 */
export function loadAllDocs() {
  const docs = []

  for (const [path, content] of Object.entries(markdownFiles)) {
    const filename = path.split('/').pop()
    const fileInfo = parseFilename(filename)

    if (!fileInfo) {
      console.warn(`Skipping file with invalid name: ${filename}`)
      continue
    }

    const parsed = parseMarkdown(content)

    docs.push({
      ...fileInfo,
      title: parsed.frontmatter.title || fileInfo.slug.replace(/-/g, ' '),
      frontmatter: parsed.frontmatter,
      html: parsed.html,
      markdown: parsed.markdown,
      headings: parsed.headings,
      path: `/page/${fileInfo.slug}`
    })
  }

  return docs
}

/**
 * Generate hierarchical navigation from docs
 */
export function generateNavigation(docs) {
  // Group by major version
  const sections = {}

  docs.forEach(doc => {
    const { major } = doc

    if (!sections[major]) {
      sections[major] = {
        id: `section-${major}`,
        label: getSectionLabel(major),
        major,
        pages: []
      }
    }

    sections[major].pages.push(doc)
  })

  // Sort sections by major version
  const sorted = Object.values(sections).sort((a, b) => a.major - b.major)

  // Sort pages within each section by version
  sorted.forEach(section => {
    section.pages.sort((a, b) => {
      if (a.major !== b.major) return a.major - b.major
      if (a.minor !== b.minor) return a.minor - b.minor
      return a.patch - b.patch
    })
  })

  return sorted
}

/**
 * Get a single doc by slug
 */
export function getDocBySlug(docs, slug) {
  return docs.find(doc => doc.slug === slug)
}

/**
 * Search docs by query
 */
export function searchDocs(docs, query) {
  if (!query) return docs

  const lowerQuery = query.toLowerCase()

  return docs.filter(doc => {
    const titleMatch = doc.title.toLowerCase().includes(lowerQuery)
    const slugMatch = doc.slug.toLowerCase().includes(lowerQuery)
    const contentMatch = doc.markdown.toLowerCase().includes(lowerQuery)

    return titleMatch || slugMatch || contentMatch
  })
}

// Load and export all docs
export const allDocs = loadAllDocs()
export const navigation = generateNavigation(allDocs)
