import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * WikiEditor - In-app page creator/editor
 * Creates markdown files that can be saved
 */

export default function WikiEditor() {
  const navigate = useNavigate()
  const [frontmatter, setFrontmatter] = useState({
    title: '',
    version: '1.0.0',
    date: new Date().toISOString().split('T')[0],
    status: 'draft'
  })
  const [content, setContent] = useState('')
  const [slug, setSlug] = useState('')
  const [major, setMajor] = useState('1')
  const [minor, setMinor] = useState('0')
  const [patch, setPatch] = useState('0')

  // Generate slug from title
  const handleTitleChange = (title) => {
    setFrontmatter(prev => ({ ...prev, title }))
    if (!slug) {
      const autoSlug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
      setSlug(autoSlug)
    }
  }

  // Generate markdown file content
  const generateMarkdown = () => {
    const fm = Object.entries(frontmatter)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')

    return `---\n${fm}\n---\n\n${content}`
  }

  // Download as .md file
  const handleSave = () => {
    const filename = `${major}.${minor}.${patch}-${slug}.md`
    const markdown = generateMarkdown()

    // Create blob and download
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)

    alert(`Downloaded ${filename}\n\nTo add to wiki: Save this file to src/data/documentation/`)
  }

  // Copy to clipboard
  const handleCopy = () => {
    const markdown = generateMarkdown()
    navigator.clipboard.writeText(markdown)
    alert('Markdown copied to clipboard!')
  }

  return (
    <div className="wiki-editor">
      <div className="wiki-editor-header">
        <h1 className="text-2xl font-bold">Create New Page</h1>
        <div className="flex gap-2">
          <button onClick={handleCopy} className="wiki-editor-btn">
            Copy Markdown
          </button>
          <button onClick={handleSave} className="wiki-editor-btn-primary">
            Download .md File
          </button>
        </div>
      </div>

      <div className="wiki-editor-body">
        {/* Version Number */}
        <div className="wiki-editor-section">
          <label className="wiki-editor-label">Version Number</label>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min="0"
              max="9"
              value={major}
              onChange={e => setMajor(e.target.value)}
              className="wiki-editor-input wiki-editor-input-small"
              placeholder="M"
            />
            <span>.</span>
            <input
              type="number"
              min="0"
              max="99"
              value={minor}
              onChange={e => setMinor(e.target.value)}
              className="wiki-editor-input wiki-editor-input-small"
              placeholder="m"
            />
            <span>.</span>
            <input
              type="number"
              min="0"
              max="99"
              value={patch}
              onChange={e => setPatch(e.target.value)}
              className="wiki-editor-input wiki-editor-input-small"
              placeholder="p"
            />
            <span className="text-sm text-fg-64 ml-4">
              Section: {getSectionLabel(parseInt(major))}
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="wiki-editor-section">
          <label className="wiki-editor-label">Title</label>
          <input
            type="text"
            value={frontmatter.title}
            onChange={e => handleTitleChange(e.target.value)}
            className="wiki-editor-input"
            placeholder="My Page Title"
          />
        </div>

        {/* Slug */}
        <div className="wiki-editor-section">
          <label className="wiki-editor-label">Slug (URL)</label>
          <input
            type="text"
            value={slug}
            onChange={e => setSlug(e.target.value)}
            className="wiki-editor-input"
            placeholder="my-page-title"
          />
          <div className="text-sm text-fg-48 mt-1">
            Filename: <code>{major}.{minor}.{patch}-{slug}.md</code>
          </div>
        </div>

        {/* Status */}
        <div className="wiki-editor-section">
          <label className="wiki-editor-label">Status</label>
          <select
            value={frontmatter.status}
            onChange={e => setFrontmatter(prev => ({ ...prev, status: e.target.value }))}
            className="wiki-editor-input"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Content */}
        <div className="wiki-editor-section">
          <label className="wiki-editor-label">Content (Markdown)</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            className="wiki-editor-textarea"
            placeholder="# My Page Title

Write your markdown content here...

## Section 1

- List item 1
- List item 2

## Section 2

More content..."
            rows={20}
          />
        </div>

        {/* Preview */}
        <div className="wiki-editor-section">
          <label className="wiki-editor-label">Preview</label>
          <pre className="wiki-editor-preview">{generateMarkdown()}</pre>
        </div>
      </div>
    </div>
  )
}

function getSectionLabel(major) {
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
