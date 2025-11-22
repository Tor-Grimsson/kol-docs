const uniqueId = () =>
  typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)

const coerceList = (value) => {
  if (!value) return []
  if (Array.isArray(value)) return value
  if (typeof value === 'string') {
    return value
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

export const blockRegistry = {
  heading: {
    label: 'Heading',
    description: 'Large section heading',
    icon: 'Heading',
    defaults: { text: 'New heading', level: 2 },
    composer: true
  },
  paragraph: {
    label: 'Paragraph',
    description: 'Rich body copy',
    icon: 'Paragraph',
    defaults: { text: '' },
    composer: true
  },
  list: {
    label: 'List',
    description: 'Bulleted list',
    icon: 'List',
    defaults: { items: [] },
    composer: true
  },
  code: {
    label: 'Code',
    description: 'Fenced code sample',
    icon: 'Code',
    defaults: { code: '', language: 'text' },
    composer: true
  },
  callout: {
    label: 'Callout',
    description: 'Accent panel for alerts',
    icon: 'Alert',
    defaults: { tone: 'accent', title: '', text: '' },
    composer: true
  },
  quote: {
    label: 'Quote',
    description: 'Pull quote with attribution',
    icon: 'Quote',
    defaults: { text: '', attribution: '' },
    composer: true
  },
  gallery: {
    label: 'Gallery',
    description: 'Photo album block',
    icon: 'Gallery',
    defaults: {
      layout: 'rows',
      spacing: 12,
      photos: []
    },
    composer: false
  }
}

const ensureContentShape = (type, block) => {
  const defaults = blockRegistry[type]?.defaults || {}
  const existing = block?.content || {}

  switch (type) {
    case 'heading':
      return {
        ...defaults,
        ...existing,
        text: (existing.text ?? block.text ?? '').trim(),
        level: existing.level ?? block.level ?? defaults.level ?? 2
      }
    case 'paragraph':
      return {
        ...defaults,
        ...existing,
        text: (existing.text ?? block.text ?? '').trim()
      }
    case 'list':
      return {
        ...defaults,
        ...existing,
        items: coerceList(existing.items ?? block.items)
      }
    case 'code':
      return {
        ...defaults,
        ...existing,
        code: existing.code ?? block.code ?? '',
        language: existing.language ?? block.language ?? defaults.language ?? 'text'
      }
    case 'callout':
      return {
        ...defaults,
        ...existing,
        tone: existing.tone ?? block.tone ?? defaults.tone ?? 'accent',
        title: existing.title ?? block.title ?? '',
        text: existing.text ?? block.text ?? ''
      }
    case 'quote':
      return {
        ...defaults,
        ...existing,
        text: existing.text ?? block.text ?? '',
        attribution: existing.attribution ?? block.attribution ?? ''
      }
    case 'gallery':
      return {
        ...defaults,
        ...existing,
        spacing: Number(existing.spacing ?? defaults.spacing ?? 12),
        layout: existing.layout ?? defaults.layout ?? 'rows',
        photos: Array.isArray(existing.photos) ? existing.photos : []
      }
    default:
      return {
        text: block?.text || ''
      }
  }
}

export const normalizeBlock = (input) => {
  if (!input) return null
  const type = input.type && blockRegistry[input.type] ? input.type : 'paragraph'

  return {
    id: input.id || uniqueId(),
    type,
    content: ensureContentShape(type, input)
  }
}

export const normalizeBlocks = (blocks = []) =>
  blocks.map((block) => normalizeBlock(block)).filter(Boolean)

export const createBlock = (type = 'paragraph', overrides = {}) => {
  const normalizedType = blockRegistry[type] ? type : 'paragraph'
  const defaults = blockRegistry[normalizedType]?.defaults || {}

  return {
    id: uniqueId(),
    type: normalizedType,
    content: {
      ...defaults,
      ...overrides
    }
  }
}

export const composerBlockOptions = Object.entries(blockRegistry)
  .filter(([, config]) => config.composer !== false)
  .map(([type, config]) => ({
    type,
    ...config
  }))

const baseHeights = {
  heading: 92,
  paragraph: 140,
  list: 160,
  code: 210,
  callout: 180,
  quote: 160,
  gallery: 260
}

export const estimateBlockHeight = (block) => {
  const normalized = normalizeBlock(block)
  const base = baseHeights[normalized.type] || 140
  if (normalized.type === 'paragraph') {
    const textLength = normalized.content.text?.length || 0
    return Math.min(280, base + Math.round(textLength / 4))
  }
  if (normalized.type === 'list') {
    const count = normalized.content.items?.length || 0
    return base + count * 16
  }
  if (normalized.type === 'code') {
    const lineCount = normalized.content.code?.split('\n').length || 1
    return Math.min(360, base + lineCount * 12)
  }
  if (normalized.type === 'gallery') {
    const photos = normalized.content.photos?.length || 0
    return base + photos * 10
  }
  return base
}

export const serializeBlocks = (blocks = []) =>
  blocks.map((block) => ({
    id: block.id,
    type: block.type,
    ...block.content
  }))
