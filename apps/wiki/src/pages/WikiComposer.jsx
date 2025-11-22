import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { DocsArticle, DocsHeader } from '../components/docs'
import WikiBlockEditor from '../components/WikiBlockEditor.jsx'
import WikiBlockRenderer from '../components/WikiBlockRenderer.jsx'
import { composerBlockOptions, createBlock } from '../utils/wikiSchema.js'

const WikiComposer = () => {
  const { setToc } = useOutletContext()
  const [title, setTitle] = useState('Untitled Page')
  const [subtitle, setSubtitle] = useState('Start writing…')
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

  return (
    <div className="space-y-8">
      <DocsHeader
        title={title}
        subtitle={subtitle}
        meta={[
          { label: 'Mode', value: 'Draft' },
          { label: 'Blocks', value: blocks.length }
        ]}
      />

      <DocsArticle id="composer-editor" className="wiki-article-section space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="wiki-section-label">Title</span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="rounded-lg border border-fg-12 bg-transparent px-4 py-2 text-base"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="wiki-section-label">Subtitle</span>
            <input
              type="text"
              value={subtitle}
              onChange={(event) => setSubtitle(event.target.value)}
              className="rounded-lg border border-fg-12 bg-transparent px-4 py-2 text-base"
            />
          </label>
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
