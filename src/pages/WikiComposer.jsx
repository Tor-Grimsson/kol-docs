import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { DocsArticle, DocsHeader } from '../components/docs'
import WikiBlockEditor from '../components/WikiBlockEditor.jsx'
import WikiBlockRenderer from '../components/WikiBlockRenderer.jsx'
import { composerBlockOptions, createBlock } from '../utils/wikiSchema.js'
import { createMarkdownDocument, generateSlug, downloadMarkdown } from '../utils/blocksToMarkdown.js'

const WikiComposer = () => {
  const { setToc } = useOutletContext()
  const [title, setTitle] = useState('Untitled Page')
  const [subtitle, setSubtitle] = useState('Start writing…')
  const [version, setVersion] = useState({ major: 1, minor: 0, patch: 0 })
  const [blocks, setBlocks] = useState(() => [
    createBlock('heading', { text: 'New section' }),
    createBlock('paragraph', { text: 'Describe the purpose of this article.' })
  ])

  useEffect(() => {
    setToc([
      { id: 'composer-editor', label: 'Editor', level: 2 },
      { id: 'composer-preview', label: 'Preview', level: 2 }
    ])
  }, [setToc])

  const handleBlockChange = (id, patch) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id
          ? {
              ...block,
              content: {
                ...block.content,
                ...patch
              }
            }
          : block
      )
    )
  }

  const handleAddBlock = (type) => {
    setBlocks((prev) => [...prev, createBlock(type)])
  }

  const handleRemoveBlock = (id) => {
    setBlocks((prev) => prev.filter((block) => block.id !== id))
  }

  const handleExportMarkdown = () => {
    const slug = generateSlug(title)
    const filename = `${version.major}.${version.minor}.${version.patch}-${slug}.md`

    const frontmatter = {
      title,
      version: `${version.major}.${version.minor}.${version.patch}`,
      date: new Date().toISOString().split('T')[0],
      status: 'draft'
    }

    const markdown = createMarkdownDocument({ frontmatter, blocks })
    downloadMarkdown(filename, markdown)
  }

  const handleCopyMarkdown = async () => {
    const frontmatter = {
      title,
      version: `${version.major}.${version.minor}.${version.patch}`,
      date: new Date().toISOString().split('T')[0],
      status: 'draft'
    }

    const markdown = createMarkdownDocument({ frontmatter, blocks })
    await navigator.clipboard.writeText(markdown)
    alert('Markdown copied to clipboard!')
  }

  return (
    <div className="space-y-8">
      <DocsHeader
        title={title}
        subtitle={subtitle}
        meta={[
          { label: 'Mode', value: 'Draft' },
          { label: 'Blocks', value: blocks.length },
          { label: 'Version', value: `${version.major}.${version.minor}.${version.patch}` }
        ]}
      >
        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={handleCopyMarkdown}
            className="wiki-rail-toggle"
          >
            📋 Copy Markdown
          </button>
          <button
            type="button"
            onClick={handleExportMarkdown}
            className="wiki-rail-toggle"
          >
            💾 Download .md File
          </button>
        </div>
      </DocsHeader>

      <DocsArticle id="composer-editor" className="wiki-article-section space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="wiki-section-label text-auto">Title</span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="rounded border border-fg-08 bg-surface-primary text-auto px-4 py-2 text-base"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="wiki-section-label text-auto">Subtitle</span>
            <input
              type="text"
              value={subtitle}
              onChange={(event) => setSubtitle(event.target.value)}
              className="rounded border border-fg-08 bg-surface-primary text-auto px-4 py-2 text-base"
            />
          </label>
        </div>

        <div className="flex gap-4 items-end">
          <label className="flex flex-col gap-2">
            <span className="wiki-section-label text-auto">Version Number</span>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min="0"
                max="9"
                value={version.major}
                onChange={(e) => setVersion(v => ({ ...v, major: parseInt(e.target.value) || 0 }))}
                className="w-16 rounded border border-fg-08 bg-surface-primary text-auto px-3 py-2 text-base text-center"
              />
              <span className="text-fg-64">.</span>
              <input
                type="number"
                min="0"
                max="99"
                value={version.minor}
                onChange={(e) => setVersion(v => ({ ...v, minor: parseInt(e.target.value) || 0 }))}
                className="w-16 rounded border border-fg-08 bg-surface-primary text-auto px-3 py-2 text-base text-center"
              />
              <span className="text-fg-64">.</span>
              <input
                type="number"
                min="0"
                max="99"
                value={version.patch}
                onChange={(e) => setVersion(v => ({ ...v, patch: parseInt(e.target.value) || 0 }))}
                className="w-16 rounded border border-fg-08 bg-surface-primary text-auto px-3 py-2 text-base text-center"
              />
            </div>
          </label>
          <div className="flex-1 text-sm text-fg-64">
            Filename: <code>{version.major}.{version.minor}.{version.patch}-{generateSlug(title)}.md</code>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {composerBlockOptions.map((block) => (
            <button
              key={block.type}
              type="button"
              onClick={() => handleAddBlock(block.type)}
              className="wiki-rail-toggle"
            >
              + {block.label}
            </button>
          ))}
        </div>

        <WikiBlockEditor
          blocks={blocks}
          onChange={handleBlockChange}
          onRemove={handleRemoveBlock}
        />
      </DocsArticle>

      <DocsArticle id="composer-preview" className="wiki-article-section space-y-5">
        <p className="wiki-section-label">Live Preview</p>
        <WikiBlockRenderer blocks={blocks} />
      </DocsArticle>
    </div>
  )
}

export default WikiComposer
