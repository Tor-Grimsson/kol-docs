import { useEffect } from 'react'
import { Link, Navigate, useOutletContext, useParams } from 'react-router-dom'
import { DocsArticle, DocsHeader } from '../components/docs'
import { getDatabase } from '../data/databases.js'

const WikiDatabaseDetail = () => {
  const { databaseId } = useParams()
  const { setToc } = useOutletContext()
  const database = getDatabase(databaseId)

  useEffect(() => {
    setToc([])
  }, [setToc])

  if (!database) {
    return <Navigate to="/databases" replace />
  }

  return (
    <div className="space-y-8">
      <DocsHeader
        title={database.name}
        subtitle={database.description}
        meta={[
          { label: 'Type', value: database.type },
          { label: 'Owner', value: database.owner },
          { label: 'Updated', value: database.updated }
        ]}
      />

      <DocsArticle className="wiki-article-section space-y-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="wiki-section-label">Status</p>
            <p className="text-sm text-fg-88">{database.status}</p>
          </div>
          <div>
            <p className="wiki-section-label">Entries</p>
            <p className="text-sm text-fg-88">{database.entries}</p>
          </div>
          <div>
            <p className="wiki-section-label">Tags</p>
            <div className="wiki-dashboard-tags mt-1">
              {database.tags.map((tag) => (
                <span key={`${database.id}-${tag}`} className="wiki-dashboard-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-fg-08 p-4 space-y-3">
            <p className="wiki-section-label">Tasks</p>
            {database.tasks.map((task) => (
              <div key={task.id} className="rounded-lg border border-fg-08 p-3">
                <p className="text-sm font-medium text-fg-88">{task.label}</p>
                <p className="text-xs text-fg-56 uppercase tracking-[0.2em] flex gap-2">
                  <span>{task.owner}</span>
                  <span>•</span>
                  <span>{task.due}</span>
                </p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-fg-08 p-4 space-y-3">
            <p className="wiki-section-label">Timeline</p>
            {database.timeline.map((event) => (
              <div key={event.id} className="flex gap-3 border-b border-fg-08 py-2 last:border-b-0">
                <span className="kol-mono-xs uppercase tracking-[0.2em] text-fg-48">{event.date}</span>
                <p className="text-sm text-fg-80">{event.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </DocsArticle>

      <DocsArticle className="wiki-article-section space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="wiki-section-label">Pages</p>
          <span className="kol-mono-xs text-fg-48 uppercase tracking-[0.2em]">
            {database.pages.length} entries
          </span>
        </div>

        <div className="grid gap-4">
          {database.pages.map((page) => (
            <Link
              key={page.id}
              to={`/database/${database.id}/page/${page.id}`}
              className="rounded-2xl border border-fg-08 p-4 hover:border-fg-16 space-y-2"
            >
              <p className="text-lg font-semibold text-fg-96">{page.title}</p>
              <p className="text-sm text-fg-64">{page.subtitle}</p>
              <div className="text-xs text-fg-48 uppercase tracking-[0.2em]">
                {page.meta?.map((item) => item.value).slice(0, 2).join(' • ')}
              </div>
            </Link>
          ))}
        </div>
      </DocsArticle>
    </div>
  )
}

export default WikiDatabaseDetail
