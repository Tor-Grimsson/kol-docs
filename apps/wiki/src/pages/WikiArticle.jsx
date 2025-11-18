import { useEffect } from 'react'
import { Navigate, useOutletContext, useParams } from 'react-router-dom'
import { DocsArticle, DocsCodeBlock, DocsHeader } from '@kol/docs'
import { getPage } from '../data/wikiPages.js'

const renderBlock = (block) => {
  if (!block) return null

  switch (block.type) {
    case 'paragraph':
      return (
        <p className="text-base leading-relaxed text-fg-80">
          {block.text}
        </p>
      )
    case 'list':
      return (
        <ul className="wiki-list">
          {block.items?.map((item) => (
            <li key={item} className="mb-2 last:mb-0">
              {item}
            </li>
          ))}
        </ul>
      )
    case 'code':
      return <DocsCodeBlock code={block.code} />
    case 'callout':
      return (
        <div className="wiki-callout" data-tone={block.tone}>
          {block.title ? (
            <p className="text-sm font-semibold uppercase tracking-[0.2em]">
              {block.title}
            </p>
          ) : null}
          <p className="mt-2 text-sm text-fg-80">
            {block.text}
          </p>
        </div>
      )
    default:
      return null
  }
}

const WikiArticle = () => {
  const { pageSlug } = useParams()
  const page = getPage(pageSlug)
  const { setToc, openOutline } = useOutletContext()

  useEffect(() => {
    if (page?.toc) {
      setToc(page.toc)
    } else {
      setToc([])
    }
  }, [page, setToc])

  if (!page) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <DocsHeader
          title={page.title}
          subtitle={page.subtitle}
          meta={page.meta}
        />
        <button
          type="button"
          className="wiki-rail-toggle self-start sm:self-center"
          onClick={openOutline}
        >
          Outline
        </button>
      </div>

      {page.sections.map((section) => (
        <section key={section.id} id={section.id} className="space-y-4">
          <DocsArticle className="wiki-article-section space-y-5">
            <div className="space-y-2">
              <p className="wiki-section-label">{page.summary}</p>
              <h2 className="text-2xl font-semibold text-fg-96">
                {section.title}
              </h2>
              {section.summary ? (
                <p className="text-base text-fg-64 max-w-3xl">
                  {section.summary}
                </p>
              ) : null}
            </div>
            <div className="space-y-4">
              {section.content?.map((block, index) => (
                <div key={`${section.id}-block-${index}`}>
                  {renderBlock(block)}
                </div>
              ))}
            </div>
          </DocsArticle>

          {section.subsections?.map((subsection) => (
            <div key={subsection.id} id={subsection.id}>
              <DocsArticle className="wiki-article-section space-y-4">
                <h3 className="text-xl font-semibold text-fg-88">
                  {subsection.title}
                </h3>
                <div className="space-y-4">
                  {subsection.content?.map((block, index) => (
                    <div key={`${subsection.id}-block-${index}`}>
                      {renderBlock(block)}
                    </div>
                  ))}
                </div>
              </DocsArticle>
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}

export default WikiArticle
