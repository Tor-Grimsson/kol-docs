import { useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import {
  DocsLayout,
  DocsMainColumn,
  DocsNavColumn,
  DocsTocColumn,
  DocsPageHeader,
  DocsRailDrawer,
  DocsToc
} from '@kol/docs'
import SidebarNav from './SidebarNav.jsx'
import { wikiNavigation, wikiTabs } from '../data/wikiPages.js'

const WikiLayout = () => {
  const location = useLocation()
  const [navOpen, setNavOpen] = useState(false)
  const [tocOpen, setTocOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [toc, setToc] = useState([])

  const activeSlug = useMemo(() => {
    const match = location.pathname.match(/\/page\/([^/]+)/)
    return match ? match[1] : null
  }, [location.pathname])

  const outletContext = useMemo(
    () => ({
      setToc,
      toc,
      openOutline: () => setTocOpen(true)
    }),
    [toc, setTocOpen]
  )

  return (
    <div className="wiki-shell">
      <DocsPageHeader
        tabs={wikiTabs}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      />

      <DocsRailDrawer
        isOpen={navOpen}
        onClose={() => setNavOpen(false)}
        title="Wiki Navigation"
      >
        <SidebarNav
          sections={wikiNavigation}
          searchQuery={searchQuery}
          onNavigate={() => setNavOpen(false)}
        />
      </DocsRailDrawer>

      <DocsRailDrawer
        isOpen={tocOpen}
        onClose={() => setTocOpen(false)}
        anchor="right"
        title="Outline"
      >
        {toc.length > 0 ? (
          <DocsToc
            toc={toc}
            onNavigate={() => setTocOpen(false)}
          />
        ) : (
          <p className="wiki-outline-empty">
            Select an article to view its outline.
          </p>
        )}
      </DocsRailDrawer>

      <div className="wiki-shell__content">
        <div className="mx-auto w-full max-w-[1400px] px-6 sm:px-8 lg:px-10">
          <div className="lg:hidden flex gap-3 border-b border-fg-08 py-4">
            <button
              type="button"
              className="wiki-rail-toggle flex-1"
              onClick={() => setNavOpen(true)}
            >
              Browse
            </button>
            <button
              type="button"
              className="wiki-rail-toggle flex-1"
              onClick={() => setTocOpen(true)}
              disabled={toc.length === 0}
            >
              Outline
            </button>
          </div>

          <DocsLayout className="pb-16">
            <DocsNavColumn className="hidden lg:block">
              <div className="sticky top-[112px] space-y-6">
                <SidebarNav
                  sections={wikiNavigation}
                  searchQuery={searchQuery}
                />
              </div>
            </DocsNavColumn>

            <DocsMainColumn className="max-w-full">
              <Outlet context={outletContext} />
            </DocsMainColumn>

            <DocsTocColumn className="hidden xl:block">
              <div className="sticky top-[112px]">
                {toc.length > 0 ? (
                  <DocsToc toc={toc} />
                ) : (
                  <p className="wiki-outline-empty">
                    Outline available once a page loads.
                  </p>
                )}
              </div>
            </DocsTocColumn>
          </DocsLayout>
        </div>
      </div>
    </div>
  )
}

export default WikiLayout
