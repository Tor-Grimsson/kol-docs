import { marked } from 'marked'
import { parseFrontmatter } from './simpleFrontmatter.js'

/**
 * Parse markdown file content
 * Extracts frontmatter metadata and converts markdown to HTML
 */
export function parseMarkdown(content) {
  // Parse frontmatter and content
  const { data: frontmatter, content: markdown } = parseFrontmatter(content)

  // Convert markdown to HTML
  const html = marked.parse(markdown)

  // Extract headings for TOC
  const headings = extractHeadings(markdown)

  return {
    frontmatter,
    html,
    headings,
    markdown
  }
}

/**
 * Extract headings from markdown for TOC generation
 */
function extractHeadings(markdown) {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const headings = []
  let match

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')

    headings.push({
      level,
      text,
      id
    })
  }

  return headings
}

/**
 * Parse filename to extract metadata
 * Format: M.m.p-title-slug.md
 * Example: 1.0.0-foundation-repository-structure.md
 */
export function parseFilename(filename) {
  const match = filename.match(/^(\d+)\.(\d+)\.(\d+)-(.+)\.md$/)

  if (!match) {
    return null
  }

  const [, major, minor, patch, slug] = match

  return {
    version: `${major}.${minor}.${patch}`,
    major: parseInt(major),
    minor: parseInt(minor),
    patch: parseInt(patch),
    slug,
    filename
  }
}

/**
 * Get section label from major version number
 */
export function getSectionLabel(major) {
  const labels = {
    0: 'Meta',
    1: 'Foundation',
    2: 'Design System',
    3: 'Components',
    4: 'Pages',
    5: 'Workshop',
    6: 'Research',
    7: 'Operations',
    8: 'Decisions',
    9: 'Future'
  }

  return labels[major] || `Section ${major}`
}
