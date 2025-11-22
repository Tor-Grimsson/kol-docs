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
          page.slug.toLowerCase().includes(normalizedQuery)
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
                to={page.path}
                onClick={onNavigate}
                className={({ isActive }) =>
                  [
                    'sidebar-nav-link',
                    isActive ? 'active' : null
                  ]
                    .filter(Boolean)
                    .join(' ')
                }
              >
                <span className="sidebar-nav-version">{page.version}</span>
                <span className="sidebar-nav-title">{page.title}</span>
              </NavLink>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default SidebarNav
