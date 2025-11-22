const DocsArticle = ({ children, className = '' }) => (
  <article className={`kol-body-base max-w-3xl ${className}`}>
    {children}
  </article>
)

export default DocsArticle
