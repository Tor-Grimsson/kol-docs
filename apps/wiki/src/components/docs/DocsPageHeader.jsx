const DocsPageHeader = ({ title, breadcrumbs, children }) => (
  <div className="border-b border-fg-08 pb-4 mb-6">
    {breadcrumbs && (
      <div className="kol-body-sm text-muted mb-2">
        {breadcrumbs.map((crumb, i) => (
          <span key={i}>
            {i > 0 && <span className="mx-2">/</span>}
            {crumb}
          </span>
        ))}
      </div>
    )}
    {title && <h1 className="kol-heading-lg">{title}</h1>}
    {children}
  </div>
)

export default DocsPageHeader
