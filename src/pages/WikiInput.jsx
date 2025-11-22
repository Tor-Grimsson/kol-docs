import { useEffect, useMemo, useState } from 'react'
import { DocsArticle, DocsCodeBlock, DocsHeader } from '../components/docs'
import { useOutletContext } from 'react-router-dom'
import { buildWikiObject, markdownToWiki } from '../utils/markdownToWiki.js'

const DEFAULT_MARKDOWN = `## Why this builder exists
Draft structural data for new wiki articles without manually building JSON.

- Paste your markdown outline
- Add status + metadata
- Copy the generated object back into \`wikiPages.js\`

## Section anatomy
Each H2 becomes a section. Paragraphs turn into \`paragraph\` blocks, bullet lists become \`list\` blocks, and fenced code blocks become \`code\`.

### Subsections
H3 headings are treated as subsections beneath the current H2.

## Implementation checklist
- Update \`slug\` + metadata
- Copy into \`apps/wiki/src/data/wikiPages.js\`
- Cross-link in navigation or tabs as needed`

const initialForm = {
  title: 'New Entry',
  slug: 'new-entry',
  subtitle: 'Describe the focus of the article.',
  summary: 'Explain why the article matters in a single paragraph.',
  status: 'Draft',
  readingTime: '5 min',
  heroBadges: 'Design System, Docs',
  markdown: DEFAULT_MARKDOWN
}

const WikiInput = () => {
  const { setToc } = useOutletContext()
  const [form, setForm] = useState(initialForm)
  const [copied, setCopied] = useState(false)

  const wikiObject = useMemo(() => buildWikiObject(form), [form])
  const markdownStructure = useMemo(() => markdownToWiki(form.markdown), [form.markdown])
  const outputJson = useMemo(() => JSON.stringify(wikiObject, null, 2), [wikiObject])

  useEffect(() => {
    const tocEntries = [
      { id: 'input-form', label: 'Input Builder', level: 2 },
      { id: 'structure-preview', label: 'Structure Preview', level: 2 },
      { id: 'json-output', label: 'JSON Output', level: 2 }
    ]
    setToc(tocEntries)
  }, [setToc])

  const handleChange = (field) => (event) => {
    const value = event.target.value
    setForm((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputJson)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Unable to copy JSON', error)
    }
  }

  return (
    <div className="space-y-8">
      <DocsHeader
        title="Input Builder"
        subtitle="Convert loose markdown notes into the structured wiki object."
        meta={[
          { label: 'Status', value: 'Beta' },
          { label: 'Version', value: '0.1.0' }
        ]}
      />

      <DocsArticle id="input-form" className="wiki-article-section space-y-6">
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className="wiki-section-label">Title</span>
              <input
                type="text"
                value={form.title}
                onChange={handleChange('title')}
                className="rounded border border-fg-12 bg-transparent px-4 py-2 text-base"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="wiki-section-label">Slug</span>
              <input
                type="text"
                value={form.slug}
                onChange={handleChange('slug')}
                className="rounded border border-fg-12 bg-transparent px-4 py-2 text-base"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="wiki-section-label">Status</span>
              <input
                type="text"
                value={form.status}
                onChange={handleChange('status')}
                className="rounded border border-fg-12 bg-transparent px-4 py-2 text-base"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="wiki-section-label">Reading time</span>
              <input
                type="text"
                value={form.readingTime}
                onChange={handleChange('readingTime')}
                className="rounded border border-fg-12 bg-transparent px-4 py-2 text-base"
              />
            </label>
          </div>

          <label className="flex flex-col gap-2">
            <span className="wiki-section-label">Subtitle</span>
            <input
              type="text"
              value={form.subtitle}
              onChange={handleChange('subtitle')}
              className="rounded border border-fg-12 bg-transparent px-4 py-2 text-base"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="wiki-section-label">Summary</span>
            <textarea
              value={form.summary}
              onChange={handleChange('summary')}
              rows={3}
              className="rounded border border-fg-12 bg-transparent px-4 py-2 text-base"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="wiki-section-label">Hero badges (comma separated)</span>
            <input
              type="text"
              value={form.heroBadges}
              onChange={handleChange('heroBadges')}
              className="rounded border border-fg-12 bg-transparent px-4 py-2 text-base"
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="wiki-section-label">Markdown outline</span>
            <textarea
              value={form.markdown}
              onChange={handleChange('markdown')}
              rows={16}
              className="rounded border border-fg-12 bg-transparent px-4 py-3 font-mono text-sm leading-relaxed"
            />
          </label>
        </div>
      </DocsArticle>

      <DocsArticle id="structure-preview" className="wiki-article-section space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="wiki-section-label">Structure Preview</p>
            <p className="text-sm text-fg-64">Generated sections & outline</p>
          </div>
          <span className="kol-mono-xs text-fg-48">
            {markdownStructure.sections.length} sections, {markdownStructure.toc.length} outline entries
          </span>
        </div>

        <div className="space-y-4">
          {markdownStructure.sections.map((section) => (
            <div key={section.id} className="rounded border border-fg-08 p-4">
              <p className="text-sm text-fg-48 uppercase tracking-[0.2em]">Section</p>
              <h3 className="text-lg font-semibold text-fg-96">{section.title}</h3>
              <p className="text-sm text-fg-64">{section.summary}</p>

              {section.subsections?.length ? (
                <div className="mt-3 space-y-2 border-t border-fg-08 pt-3">
                  {section.subsections.map((subsection) => (
                    <div key={subsection.id}>
                      <p className="kol-mono-xs uppercase tracking-[0.2em] text-fg-48">
                        Subsection
                      </p>
                      <p className="text-sm text-fg-80">{subsection.title}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </DocsArticle>

      <DocsArticle id="json-output" className="wiki-article-section space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="wiki-section-label">JSON Output</p>
            <p className="text-sm text-fg-64">Copy directly into <code>wikiPages.js</code></p>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="wiki-rail-toggle"
          >
            {copied ? 'Copied!' : 'Copy JSON'}
          </button>
        </div>
        <DocsCodeBlock code={outputJson} />
      </DocsArticle>
    </div>
  )
}

export default WikiInput
