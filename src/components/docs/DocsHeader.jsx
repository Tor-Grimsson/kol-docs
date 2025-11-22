/**
 * DocsHeader
 *
 * Flexible heading component that supports H1-H6 with consistent styling.
 * Generates anchor IDs from titles for deep linking.
 * Used for section headers within documentation articles.
 */

const DocsHeader = ({ level = 1, title, subtitle, meta, children, id }) => {
  // Generate ID from title if not provided
  const headingId = id || (title ? title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') : undefined)

  const Tag = `h${Math.min(Math.max(level, 1), 6)}`

  const headingClasses = {
    1: 'text-4xl font-bold tracking-tight',
    2: 'text-3xl font-bold tracking-tight',
    3: 'text-2xl font-semibold',
    4: 'text-xl font-semibold',
    5: 'text-lg font-semibold',
    6: 'text-base font-semibold'
  }

  return (
    <header className="docs-header">
      {title && (
        <Tag id={headingId} className={`docs-heading ${headingClasses[level]}`}>
          {title}
        </Tag>
      )}

      {subtitle && (
        <p className="docs-subtitle mt-2 text-lg text-fg-64">
          {subtitle}
        </p>
      )}

      {meta && meta.length > 0 && (
        <div className="docs-meta mt-4 flex flex-wrap gap-4 text-sm text-fg-48">
          {meta.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="font-medium">{item.label}:</span>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      )}

      {children}
    </header>
  )
}

export default DocsHeader
