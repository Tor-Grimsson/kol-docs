import { memo, useMemo } from 'react'
import { VariableSizeList as List } from 'react-window'
import { estimateBlockHeight, normalizeBlock, blockRegistry } from '../utils/wikiSchema.js'

const headingLevels = [
  { value: 2, label: 'H2' },
  { value: 3, label: 'H3' },
  { value: 4, label: 'H4' }
]

const toneOptions = [
  { value: 'accent', label: 'Accent' },
  { value: 'warning', label: 'Warning' },
  { value: 'info', label: 'Info' }
]

const codeLanguages = ['text', 'js', 'ts', 'css', 'json']

const BlockEditorCard = memo(({ block, onChange, onRemove }) => {
  const normalized = normalizeBlock(block)
  const { type, content } = normalized
  const meta = blockRegistry[type]

  const handleFieldChange = (field) => (event) => {
    const value = event?.target?.value ?? event
    onChange(normalized.id, { [field]: value })
  }

  const sharedTextareaProps = {
    className:
      'w-full rounded border border-fg-08 bg-surface-primary text-auto px-3 py-2 text-sm leading-relaxed',
    placeholder: meta?.description
  }

  const renderFields = () => {
    switch (type) {
      case 'heading':
        return (
          <div className="grid gap-3 md:grid-cols-[2fr,1fr]">
            <input
              type="text"
              className="rounded border border-fg-08 bg-surface-primary text-auto px-3 py-2 text-sm"
              value={content.text}
              onChange={handleFieldChange('text')}
              placeholder="Heading text"
            />
            <select
              className="rounded border border-fg-08 bg-surface-primary text-auto px-3 py-2 text-sm"
              value={content.level}
              onChange={handleFieldChange('level')}
            >
              {headingLevels.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )
      case 'paragraph':
        return (
          <textarea
            {...sharedTextareaProps}
            rows={4}
            value={content.text}
            onChange={handleFieldChange('text')}
          />
        )
      case 'list':
        return (
          <textarea
            {...sharedTextareaProps}
            rows={4}
            value={content.items?.join('\n')}
            placeholder="Each line becomes a bullet"
            onChange={(event) =>
              onChange(normalized.id, {
                items: event.target.value
                  .split('\n')
                  .map((item) => item.trim())
                  .filter(Boolean)
              })
            }
          />
        )
      case 'code':
        return (
          <div className="space-y-2">
            <select
              className="rounded border border-fg-08 bg-surface-primary text-auto px-3 py-2 text-sm"
              value={content.language}
              onChange={handleFieldChange('language')}
            >
              {codeLanguages.map((language) => (
                <option key={language} value={language}>
                  {language.toUpperCase()}
                </option>
              ))}
            </select>
            <textarea
              {...sharedTextareaProps}
              rows={6}
              className={`${sharedTextareaProps.className} font-mono`}
              value={content.code}
              onChange={handleFieldChange('code')}
              placeholder="Paste code sample..."
            />
          </div>
        )
      case 'callout':
        return (
          <div className="space-y-3">
            <select
              className="rounded border border-fg-08 bg-surface-primary text-auto px-3 py-2 text-sm"
              value={content.tone}
              onChange={handleFieldChange('tone')}
            >
              {toneOptions.map((tone) => (
                <option key={tone.value} value={tone.value}>
                  {tone.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              className="w-full rounded border border-fg-08 bg-surface-primary text-auto px-3 py-2 text-sm"
              value={content.title}
              onChange={handleFieldChange('title')}
              placeholder="Callout title"
            />
            <textarea
              {...sharedTextareaProps}
              rows={4}
              value={content.text}
              onChange={handleFieldChange('text')}
              placeholder="Explain the callout content"
            />
          </div>
        )
      case 'quote':
        return (
          <div className="space-y-3">
            <textarea
              {...sharedTextareaProps}
              rows={4}
              value={content.text}
              onChange={handleFieldChange('text')}
              placeholder="Pull quote"
            />
            <input
              type="text"
              className="w-full rounded border border-fg-08 bg-surface-primary text-auto px-3 py-2 text-sm"
              value={content.attribution}
              onChange={handleFieldChange('attribution')}
              placeholder="Attribution"
            />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="wiki-block-editor-card space-y-3 h-full">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="wiki-section-label text-auto">{meta?.label || type}</p>
          <p className="text-sm text-fg-64">{meta?.description}</p>
        </div>
        <button
          type="button"
          className="kol-mono-xs text-fg-48 hover:text-fg-80"
          onClick={() => onRemove(normalized.id)}
        >
          Remove
        </button>
      </div>
      {renderFields()}
    </div>
  )
})

const WikiBlockEditor = ({ blocks, onChange, onRemove }) => {
  const heights = useMemo(
    () => blocks.map((block) => estimateBlockHeight(block) + 40),
    [blocks]
  )
  const listHeight = Math.min(520, Math.max(320, heights.reduce((sum, value) => sum + value, 0)))

  if (!blocks.length) {
    return (
      <p className="wiki-outline-empty">
        Add a block to start composing.
      </p>
    )
  }

  return (
    <div className="wiki-block-editor">
      <List
        height={listHeight}
        width="100%"
        itemCount={blocks.length}
        itemSize={(index) => heights[index] || 180}
      >
        {({ index, style }) => (
          <div style={{ ...style, paddingRight: '0.75rem' }}>
            <BlockEditorCard
              block={blocks[index]}
              onChange={onChange}
              onRemove={onRemove}
            />
          </div>
        )}
      </List>
    </div>
  )
}

export default WikiBlockEditor
