/**
 * Simple frontmatter parser for browser
 * Extracts YAML frontmatter without needing Node.js Buffer
 */

export function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
  const match = content.match(frontmatterRegex)

  if (!match) {
    return {
      data: {},
      content: content
    }
  }

  const [, yamlString, markdown] = match
  const data = parseYAML(yamlString)

  return {
    data,
    content: markdown
  }
}

/**
 * Simple YAML parser for frontmatter
 * Only handles simple key: value pairs and arrays
 */
function parseYAML(yamlString) {
  const data = {}
  const lines = yamlString.split('\n')
  let currentKey = null
  let currentArray = null

  for (const line of lines) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }

    // Handle array items
    if (trimmed.startsWith('- ')) {
      if (currentArray) {
        currentArray.push(trimmed.substring(2).trim())
      }
      continue
    }

    // Handle key: value
    const colonIndex = trimmed.indexOf(':')
    if (colonIndex > 0) {
      const key = trimmed.substring(0, colonIndex).trim()
      const value = trimmed.substring(colonIndex + 1).trim()

      if (!value) {
        // Start of array or object
        currentKey = key
        currentArray = []
        data[key] = currentArray
      } else {
        // Simple key: value
        data[key] = parseValue(value)
        currentKey = key
        currentArray = null
      }
    }
  }

  return data
}

/**
 * Parse a YAML value
 */
function parseValue(value) {
  // Remove quotes
  if ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1)
  }

  // Parse numbers
  if (!isNaN(value)) {
    return Number(value)
  }

  // Parse booleans
  if (value === 'true') return true
  if (value === 'false') return false

  return value
}
