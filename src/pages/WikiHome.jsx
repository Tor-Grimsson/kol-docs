import { useEffect, useMemo, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { DocsHeader, DocsArticle } from '../components/docs'

const WikiHome = () => {
  const { setToc } = useOutletContext()
  const [calendarView, setCalendarView] = useState('week')

  useEffect(() => {
    setToc([])
  }, [setToc])

  const priorityItems = useMemo(
    () => [
      { id: 'p1', label: 'Document media ingestion RFC', owner: 'Nila', due: 'Mar 26' },
      { id: 'p2', label: 'Decide on editor framework', owner: 'Vik', due: 'Mar 27' },
      { id: 'p3', label: 'Prototype inline editing guardrails', owner: 'Kai', due: 'Mar 28' }
    ],
    []
  )

  const noteEntries = useMemo(
    () => [
      { id: 'note-1', title: 'Docs move', body: 'Need a clean ingress plan before exposing media upload tools to the main Studio crew.' },
      { id: 'note-2', title: 'Sidebar parity', body: 'Workshop nav cloned but needs real data linking once DB schema lands.' }
    ],
    []
  )

  const databaseInventory = useMemo(
    () => [
      { id: 'db-1', label: 'Media Archive', type: 'photos', count: 1842, updated: 'Mar 24', tags: ['images', 'assets'] },
      { id: 'db-2', label: 'Token Docs', type: 'yaml', count: 86, updated: 'Mar 23', tags: ['tokens', 'docs'] },
      { id: 'db-3', label: 'Playbook Pages', type: 'pages', count: 42, updated: 'Mar 22', tags: ['pages', 'ops'] },
      { id: 'db-4', label: 'Release Notes', type: 'text', count: 19, updated: 'Mar 20', tags: ['updates', 'docs'] },
      { id: 'db-5', label: 'Chess Data', type: 'json', count: 3120, updated: 'Mar 18', tags: ['data', 'games'] }
    ],
    []
  )

  const databaseTypes = useMemo(
    () => [
      { id: 'photos', label: 'Photo grid', description: 'B2-backed image archive with metadata columns.' },
      { id: 'yaml', label: 'YAML notes', description: 'Lightweight config/spec store, versioned in git.' },
      { id: 'pages', label: 'Page collection', description: 'Markdown + blocks for multi-section docs.' },
      { id: 'text', label: 'Freeform doc', description: 'Quick capture, converts to long-form later.' }
    ],
    []
  )

  const recentDatabases = databaseInventory.slice(0, 4)

  const heroStatements = useMemo(
    () => [
      'Capture deltas minutes after critique.',
      'Prototype flows without leaving the wiki shell.',
      'Keep design + engineering rituals searchable.',
      'Swap order, rails, and focus without new code.'
    ],
    []
  )

  const calendarOptions = ['day', 'week', 'month']

  return (
    <div className="space-y-10">
      <DocsHeader
        title="Kolkrabbi Wiki"
        subtitle="A shared space for design & engineering playbooks."
        meta={[
          { label: 'Status', value: 'In flight' },
          { label: 'Last sweep', value: 'Mar 24, 2025' }
        ]}
      />

      <DocsArticle className="wiki-article-section">
        <div className="space-y-4 max-w-3xl">
          <span className="wiki-hero-badge">Live surface</span>
          <p className="text-base text-fg-64">
            This wiki mirrors the production documentation experience—same tokens, same layout system. Use it as a playground to spec new sections before upstreaming them to the main site.
          </p>
          <div className="wiki-hero-grid">
            {heroStatements.map((statement) => (
              <div key={statement} className="wiki-hero-card">
                <p className="text-sm text-fg-80">{statement}</p>
              </div>
            ))}
          </div>
        </div>
      </DocsArticle>

      <div className="wiki-dashboard-grid">
        <div className="wiki-dashboard-column">
          <div className="wiki-dashboard-card space-y-3">
            <p className="wiki-section-label">Action queue</p>
            <p className="text-sm text-fg-64">
              High priority threads that unblock inline editing + database migration.
            </p>
            <div className="space-y-3">
              {priorityItems.map((item) => (
                <div key={item.id} className="rounded border border-fg-08 p-3">
                  <p className="text-sm font-semibold text-fg-88">{item.label}</p>
                  <div className="text-xs text-fg-56 uppercase tracking-[0.2em] flex gap-2">
                    <span>{item.owner}</span>
                    <span>•</span>
                    <span>{item.due}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="wiki-dashboard-column wiki-dashboard-column--wide">
          <div className="wiki-dashboard-card space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="wiki-section-label">Notes</p>
                <p className="text-sm text-fg-64">Capture blockers or observations before they drift.</p>
              </div>
              <div className="wiki-calendar-toggle">
                {calendarOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={option === calendarView ? 'is-active' : undefined}
                    onClick={() => setCalendarView(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {noteEntries.map((note) => (
                <div key={note.id} className="rounded border border-fg-08 p-4 space-y-2">
                  <p className="text-sm font-semibold text-fg-88">{note.title}</p>
                  <p className="text-sm text-fg-64">{note.body}</p>
                  <p className="kol-mono-xs uppercase tracking-[0.2em] text-fg-48">
                    View: {calendarView}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="wiki-dashboard-card space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="wiki-section-label">Databases in focus</p>
                <p className="text-sm text-fg-64">Mix of structured stores powering the wiki.</p>
              </div>
              <Link to="/databases" className="kol-mono-xs uppercase tracking-[0.2em] text-fg-64 hover:text-fg-96">
                View all →
              </Link>
            </div>
            <div className="wiki-dashboard-database-list">
              {recentDatabases.map((db) => (
                <Link key={db.id} to={`/database/${db.id}`} className="wiki-dashboard-database-item">
                  <div className="flex items-center justify-between">
                    <p className="text-base font-medium text-fg-96">{db.label}</p>
                    <span className="text-sm text-fg-56">{db.count} rows</span>
                  </div>
                  <p className="text-sm text-fg-64 capitalize">{db.type}</p>
                  <div className="wiki-dashboard-tags">
                    {db.tags.map((tag) => (
                      <span key={`${db.id}-${tag}`} className="wiki-dashboard-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="kol-mono-xs uppercase tracking-[0.2em] text-fg-48">
                    Updated {db.updated}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="wiki-dashboard-column">
          <div className="wiki-dashboard-card space-y-3">
            <p className="wiki-section-label">All databases</p>
            <div className="space-y-2 max-h-[360px] overflow-auto pr-1">
              {databaseInventory.map((db) => (
                <Link key={db.id} to={`/database/${db.id}`} className="flex items-center justify-between rounded border border-fg-08 px-3 py-2 text-sm text-fg-80 hover:border-fg-16">
                  <span>{db.label}</span>
                  <span className="text-xs text-fg-48">{db.type}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="wiki-dashboard-card space-y-3">
            <p className="wiki-section-label">Create new</p>
            <div className="space-y-3">
              {databaseTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  className="w-full rounded border border-fg-08 px-3 py-2 text-left hover:border-fg-16"
                >
                  <p className="text-sm font-semibold text-fg-88">{type.label}</p>
                  <p className="text-xs text-fg-56">{type.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WikiHome
