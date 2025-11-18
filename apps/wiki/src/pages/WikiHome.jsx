import { useEffect } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { DocsHeader, DocsArticle } from '@kol/docs'
import { wikiNavigation } from '../data/wikiPages.js'

const WikiHome = () => {
  const { setToc } = useOutletContext()

  useEffect(() => {
    setToc([])
  }, [setToc])

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
        <div className="flex flex-wrap items-center gap-4">
          <span className="wiki-hero-badge">Live surface</span>
          <p className="text-base text-fg-64 max-w-2xl">
            This wiki mirrors the production documentation experience—same tokens, same layout system. Use it as a playground to spec new sections before upstreaming them to the main site.
          </p>
        </div>
      </DocsArticle>

      {wikiNavigation.map((section) => (
        <section key={section.id} className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="wiki-section-label">{section.label}</p>
              {section.description ? (
                <p className="text-base text-fg-64">
                  {section.description}
                </p>
              ) : null}
            </div>
            <Link
              to={section.pages.length ? `/page/${section.pages[0].slug}` : '/'}
              className="kol-mono-xs uppercase tracking-[0.2em] text-fg-64 hover:text-fg-96"
            >
              Jump to section →
            </Link>
          </div>

          <div className="wiki-card-grid">
            {section.pages.map((page) => (
              <Link key={page.slug} to={`/page/${page.slug}`} className="docs-card">
                <p className="kol-mono-xs uppercase tracking-[0.2em] text-fg-48">
                  {page.meta?.[0]?.value}
                </p>
                <h3 className="text-lg font-semibold text-fg-96 mt-2">
                  {page.title}
                </h3>
                <p className="text-sm text-fg-64 mt-1">
                  {page.summary}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

export default WikiHome
