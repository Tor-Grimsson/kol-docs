import { useEffect, useMemo, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { DocsHeader } from '../components/docs'
import { getDatabases } from '../data/databases.js'

const typeLabels = {
  photos: 'Photo archive',
  yaml: 'Schema / YAML',
  pages: 'Pages',
  text: 'Notes',
  json: 'Data'
}

const viewOptions = ['Day', 'Week', 'Month']

const WikiDatabases = () => {
  const { setToc } = useOutletContext()
  const databases = useMemo(() => getDatabases(), [])
  const [activeType, setActiveType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [calendarView, setCalendarView] = useState('Week')

  useEffect(() => {
    setToc([])
  }, [setToc])

  const statusSummary = useMemo(() => {
    const grouped = databases.reduce((acc, db) => {
      acc[db.status] = (acc[db.status] || 0) + 1
      return acc
    }, {})
    return Object.entries(grouped).map(([status, count]) => ({
      id: status,
      label: status,
      value: count
    }))
  }, [databases])

  const actionQueue = useMemo(
    () =>
      databases
        .flatMap((db) => db.tasks.map((task) => ({ ...task, database: db.name })))
        .slice(0, 4),
    [databases]
  )

  const filteredDatabases = databases.filter((db) => {
    const matchesType = activeType === 'all' || db.type === activeType
    const matchesQuery = db.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesQuery
  })

  const now = new Date()
  const nowDate = now.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
  const nowTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="space-y-8">
      <DocsHeader
        title="Database Hub"
        subtitle="Control room for every structured store feeding the wiki."
        meta={[
          { label: 'Databases', value: `${databases.length}` },
          { label: 'Last sweep', value: 'Mar 24, 2025' }
        ]}
      />

      <section className="db-section">
        <div className="db-panel db-panel--muted">
          <div className="grid gap-3 md:grid-cols-4">
            {statusSummary.map((item) => (
              <div key={item.id} className="flex flex-col gap-1">
                <p className="kol-label-mono-sm uppercase text-auto">{item.label}</p>
                <p className="kol-heading-narrow-md text-auto">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="db-panel space-y-4">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {['all', ...new Set(databases.map((db) => db.type))].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setActiveType(type)}
                  className={`db-pill ${activeType === type ? 'bg-surface-secondary text-auto border-auto' : ''}`}
                >
                  {type === 'all' ? 'All' : typeLabels[type] || type}
                </button>
              ))}
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search databases…"
              className="w-full border border-auto rounded px-3 py-2 text-auto bg-transparent lg:w-64"
            />
          </div>
        </div>

        <div className="db-grid">
          <div className="db-column">
            <div className="db-panel">
              <p className="kol-heading-narrow-sm text-auto">Action queue</p>
              <p className="kol-text-sm text-auto/80">Highest priority tasks across every store.</p>
              <div className="db-list">
                {actionQueue.map((task) => (
                  <div key={task.id} className="border border-auto rounded px-3 py-2">
                    <p className="kol-text-sm text-auto">{task.label}</p>
                    <div className="kol-helper-xs text-auto/70 flex gap-2 uppercase tracking-[0.2em]">
                      <span>{task.database}</span>
                      <span>•</span>
                      <span>{task.owner}</span>
                      <span>•</span>
                      <span>{task.due}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="db-column db-column--wide">
            <div className="db-panel space-y-3">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="kol-heading-narrow-sm text-auto">Notes</p>
                  <p className="kol-text-sm text-auto/80">Observations tagged from the last pass.</p>
                </div>
                <div className="flex gap-1">
                  {viewOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setCalendarView(option)}
                      className={`db-pill ${calendarView === option ? 'bg-surface-secondary text-auto border-auto' : ''}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {databases.slice(0, 2).map((db) => (
                  <div key={db.id} className="border border-auto rounded px-3 py-2">
                    <p className="kol-heading-narrow-xs text-auto">{db.name}</p>
                    <p className="kol-text-sm text-auto/80">{db.description}</p>
                    <p className="kol-helper-xs text-auto/70 uppercase tracking-[0.2em]">
                      {db.updated} • {calendarView} view
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="db-panel space-y-3">
              <div className="flex items-center justify-between">
                <p className="kol-heading-narrow-sm text-auto">Databases in focus</p>
                <span className="kol-helper-xs text-auto/70 uppercase tracking-[0.2em]">
                  {filteredDatabases.length} shown
                </span>
              </div>
              <div className="db-list">
                {filteredDatabases.slice(0, 4).map((db) => (
                  <Link key={db.id} to={`/database/${db.id}`} className="db-card-link">
                    <p className="kol-heading-narrow-xs text-auto">{db.name}</p>
                    <p className="kol-text-sm text-auto/80">{db.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {db.tags.map((tag) => (
                        <span key={`${db.id}-${tag}`} className="db-pill">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="kol-helper-xs text-auto/70 uppercase tracking-[0.2em]">
                      {db.entries} rows • {db.updated}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="db-column">
            <div className="db-panel space-y-3">
              <p className="kol-heading-narrow-sm text-auto">Global index</p>
              <p className="kol-text-sm text-auto/80">Every database, regardless of type.</p>
              <div className="db-list max-h-[320px] overflow-auto pr-1">
                {databases.map((db) => (
                  <Link key={db.id} to={`/database/${db.id}`} className="db-card-link">
                    <p className="kol-text-sm text-auto">{db.name}</p>
                    <p className="kol-helper-xs text-auto/70 uppercase tracking-[0.2em]">
                      {db.type} • {db.owner}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="db-panel space-y-3">
              <p className="kol-heading-narrow-sm text-auto">Create new</p>
              <p className="kol-text-sm text-auto/80">Pick a template and start capturing.</p>
              <div className="db-list">
                {['photos', 'yaml', 'pages', 'text'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className="db-card-link text-left"
                  >
                    <p className="kol-text-sm text-auto">{typeLabels[type]}</p>
                    <p className="kol-helper-xs text-auto/70 uppercase tracking-[0.2em]">
                      Draft template
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div className="db-panel space-y-2">
              <p className="kol-heading-narrow-sm text-auto">Now</p>
              <p className="kol-text-sm text-auto">{nowDate}</p>
              <p className="kol-display-section-sm text-auto">{nowTime}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default WikiDatabases
