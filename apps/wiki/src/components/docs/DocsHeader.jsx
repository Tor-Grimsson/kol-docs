const DocsHeader = ({ title, description }) => (
  <header className="mb-8">
    {title && <h1 className="kol-heading-xl mb-4">{title}</h1>}
    {description && <p className="kol-body-base text-muted">{description}</p>}
  </header>
)

export default DocsHeader
