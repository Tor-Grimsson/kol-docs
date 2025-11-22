import { useEffect } from 'react'
import { Navigate, useOutletContext, useParams } from 'react-router-dom'
import { DocsArticle, DocsHeader } from '../components/docs'
import { getPage } from '../data/wikiPages.js'
import WikiBlockRenderer from '../components/WikiBlockRenderer.jsx'

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
              <WikiBlockRenderer blocks={section.content} />
            </div>
          </DocsArticle>

          {section.subsections?.map((subsection) => (
            <div key={subsection.id} id={subsection.id}>
              <DocsArticle className="wiki-article-section space-y-4">
                <h3 className="text-xl font-semibold text-fg-88">
                  {subsection.title}
                </h3>
                <WikiBlockRenderer blocks={subsection.content} />
              </DocsArticle>
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}

export default WikiArticle
