import { useEffect } from 'react'
import { Navigate, useOutletContext, useParams } from 'react-router-dom'
import { DocsPageHeader } from '../components/docs'
import { allDocs, getDocBySlug } from '../utils/loadDocs.js'

const WikiArticle = () => {
  const { pageSlug } = useParams()
  const doc = getDocBySlug(allDocs, pageSlug)
  const { setToc } = useOutletContext()

  useEffect(() => {
    if (doc?.headings) {
      // Convert headings to TOC format
      const toc = doc.headings
        .filter(h => h.level === 2 || h.level === 3)
        .map(h => ({
          id: h.id,
          label: h.text,
          level: h.level
        }))
      setToc(toc)
    } else {
      setToc([])
    }
  }, [doc, setToc])

  if (!doc) {
    return <Navigate to="/" replace />
  }

  // Build breadcrumbs
  const breadcrumbs = [
    { label: 'Wiki', path: '/' },
    { label: doc.title }
  ]

  return (
    <div className="wiki-article">
      <DocsPageHeader title={doc.title} breadcrumbs={breadcrumbs}>
        {doc.frontmatter?.version && (
          <div className="mt-3 text-sm text-fg-48">
            Version: {doc.frontmatter.version}
          </div>
        )}
        {doc.frontmatter?.date && (
          <div className="text-sm text-fg-48">
            Last updated: {doc.frontmatter.date}
          </div>
        )}
      </DocsPageHeader>

      {/* Render markdown content */}
      <article
        className="docs-article prose"
        dangerouslySetInnerHTML={{ __html: doc.html }}
      />
    </div>
  )
}

export default WikiArticle
