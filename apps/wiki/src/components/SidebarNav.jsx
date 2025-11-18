import { NavLink } from 'react-router-dom'

const SidebarNav = ({ sections, searchQuery = '', onNavigate }) => {
  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filtered = sections
    .map((section) => ({
      ...section,
      pages: section.pages.filter((page) => {
        if (!normalizedQuery) return true
        return (
          page.title.toLowerCase().includes(normalizedQuery) ||
          page.summary.toLowerCase().includes(normalizedQuery)
        )
      })
    }))
    .filter((section) =>
      normalizedQuery ? section.pages.length > 0 : true
    )

  if (normalizedQuery && filtered.length === 0) {
    return (
      <p className="wiki-outline-empty">
        No pages match “{searchQuery}”
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {filtered.map((section) => (
        <section key={section.id} className="flex flex-col gap-3">
          <div className="space-y-1">
            <p className="wiki-section-label">{section.label}</p>
            {section.description ? (
              <p className="text-sm text-fg-64 max-w-xs">{section.description}</p>
            ) : null}
          </div>
          <div className="flex flex-col gap-2">
            {section.pages.map((page) => (
              <NavLink
                key={page.slug}
                to={`/page/${page.slug}`}
                onClick={onNavigate}
                className={({ isActive }) =>
                  [
                    'wiki-nav-link',
                    'transition-all',
                    'text-sm',
                    isActive ? 'is-active' : null
                  ]
                    .filter(Boolean)
                    .join(' ')
                }
              >
                <span className="text-[0.95rem] font-medium text-fg-88">
                  {page.title}
                </span>
                <span className="text-sm text-fg-64 leading-relaxed">
                  {page.summary}
                </span>
                {Array.isArray(page.meta) ? (
                  <span className="text-xs text-fg-48 uppercase tracking-[0.2em]">
                    {page.meta
                      .map((item) => item.value)
                      .slice(0, 2)
                      .join(' • ')}
                  </span>
                ) : null}
              </NavLink>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default SidebarNav
