/**
 * Convert WikiComposer blocks to markdown format
 * Handles all block types: heading, paragraph, list, code, callout, quote
 */

/**
 * Convert a single block to markdown
 */
function blockToMarkdown(block) {
  const { type, content } = block

  switch (type) {
    case 'heading': {
      const level = content.level || 2
      const hashes = '#'.repeat(level)
      return `${hashes} ${content.text}\n`
    }

    case 'paragraph':
      return `${content.text}\n`

    case 'list': {
      if (!content.items || content.items.length === 0) return ''
      return content.items.map(item => `- ${item}`).join('\n') + '\n'
    }

    case 'code': {
      const language = content.language || 'text'
      const code = content.code || ''
      return `\`\`\`${language}\n${code}\n\`\`\`\n`
    }

    case 'callout': {
      const lines = []
      lines.push(`> **${content.title || 'Note'}**`)
      if (content.text) {
        content.text.split('\n').forEach(line => {
          lines.push(`> ${line}`)
        })
      }
      return lines.join('\n') + '\n'
    }

    case 'quote': {
      const lines = []
      if (content.text) {
        content.text.split('\n').forEach(line => {
          lines.push(`> ${line}`)
        })
      }
      if (content.attribution) {
        lines.push(`>\n> — ${content.attribution}`)
      }
      return lines.join('\n') + '\n'
    }

    case 'gallery':
      // Gallery blocks don't convert to markdown easily
      // Could output image links if photo URLs are available
      return `<!-- Gallery block (${content.photos?.length || 0} photos) -->\n`

    default:
      return ''
  }
}

/**
 * Convert blocks array to markdown string
 */
export function blocksToMarkdown(blocks = []) {
  return blocks
    .map(block => blockToMarkdown(block))
    .join('\n')
    .trim()
}

/**
 * Generate frontmatter YAML from metadata
 */
export function generateFrontmatter(metadata = {}) {
  const lines = []

  Object.entries(metadata).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      lines.push(`${key}: ${value}`)
    }
  })

  return lines.join('\n')
}

/**
 * Create complete markdown document with frontmatter
 */
export function createMarkdownDocument({ frontmatter = {}, blocks = [] }) {
  const fm = generateFrontmatter(frontmatter)
  const content = blocksToMarkdown(blocks)

  return `---\n${fm}\n---\n\n${content}`
}

/**
 * Generate slug from title
 */
export function generateSlug(title = '') {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

/**
 * Download markdown file to user's computer
 */
export function downloadMarkdown(filename, content) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
