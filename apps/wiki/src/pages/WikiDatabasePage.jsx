import { useEffect } from 'react'
import { Link, Navigate, useOutletContext, useParams } from 'react-router-dom'
import { DocsArticle, DocsHeader } from '../components/docs'
import WikiBlockRenderer from '../components/WikiBlockRenderer.jsx'
import { getDatabase, getDatabasePage } from '../data/databases.js'

const WikiDatabasePage = () => {
  const { databaseId, pageId } = useParams()
  const { setToc } = useOutletContext()
  const database = getDatabase(databaseId)
  const page = getDatabasePage(databaseId, pageId)

  useEffect(() => {
    setToc([])
  }, [setToc])

  if (!database || !page) {
    return <Navigate to="/databases" replace />
  }

  return (
    <div className="space-y-8">
      <DocsHeader
        title={page.title}
        subtitle={page.subtitle}
        meta={[
          { label: 'Database', value: database.name },
          ...(page.meta || [])
        ]}
      />

      <DocsArticle className="wiki-article-section space-y-5">
        <p className="wiki-section-label">Page content</p>
        <WikiBlockRenderer blocks={page.blocks} />
        <div className="pt-4 border-t border-fg-08 flex flex-wrap gap-4">
          <Link
            to={`/database/${database.id}`}
            className="wiki-rail-toggle"
          >
            Back to {database.name}
          </Link>
          <button
            type="button"
            className="wiki-rail-toggle"
          >
            Edit page
          </button>
        </div>
      </DocsArticle>
    </div>
  )
}

export default WikiDatabasePage
