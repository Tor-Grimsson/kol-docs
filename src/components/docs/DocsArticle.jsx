/**
 * DocsArticle
 *
 * Main content container for documentation pages.
 * Provides proper max-width, spacing, and prose styling context.
 * This is the primary wrapper for all article content.
 */

const DocsArticle = ({ children, className = '' }) => {
  return (
    <article className={`docs-article ${className}`}>
      {children}
    </article>
  )
}

export default DocsArticle
