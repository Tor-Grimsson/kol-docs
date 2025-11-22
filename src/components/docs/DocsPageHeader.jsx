import { Link } from 'react-router-dom'

/**
 * DocsPageHeader
 *
 * Page-level header component with breadcrumb navigation.
 * Displays the page title and hierarchical breadcrumbs.
 * Breadcrumbs support links for navigation back through the hierarchy.
 */

const DocsPageHeader = ({ title, breadcrumbs = [], children }) => {
  return (
    <div className="docs-page-header">
      {breadcrumbs.length > 0 && (
        <nav className="docs-breadcrumbs" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-fg-48">
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1

              return (
                <li key={index} className="flex items-center gap-2">
                  {index > 0 && (
                    <span className="text-fg-32" aria-hidden="true">
                      /
                    </span>
                  )}
                  {crumb.path && !isLast ? (
                    <Link
                      to={crumb.path}
                      className="hover:text-fg-88 transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className={isLast ? 'text-fg-64' : ''}>
                      {crumb.label}
                    </span>
                  )}
                </li>
              )
            })}
          </ol>
        </nav>
      )}

      {title && (
        <h1 className="docs-page-title mt-4 text-4xl font-bold tracking-tight">
          {title}
        </h1>
      )}

      {children}
    </div>
  )
}

export default DocsPageHeader
