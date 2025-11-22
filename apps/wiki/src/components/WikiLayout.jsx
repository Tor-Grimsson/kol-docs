import { useEffect, useMemo, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { DocsPageHeader, DocsRailDrawer, DocsToc } from '../components/docs'
import SidebarNav from './SidebarNav.jsx'
import WikiSidebar from './WikiSidebar.jsx'
import { wikiNavigation, wikiTabs } from '../data/wikiPages.js'

const MIN_NAV_WIDTH = 220
const MAX_NAV_WIDTH = 420

const WikiLayout = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [toc, setToc] = useState([])
  const [navVisible, setNavVisible] = useState(false)
  const [tocVisible, setTocVisible] = useState(true)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [mobileTocOpen, setMobileTocOpen] = useState(false)
  const [navWidth, setNavWidth] = useState(280)
  const [isResizingNav, setIsResizingNav] = useState(false)
  const navResizeRef = useRef({ startX: 0, baseWidth: 280 })

  const outletContext = useMemo(
    () => ({
      setToc,
      toc,
      openOutline: () => setMobileTocOpen(true)
    }),
    [toc]
  )

  useEffect(() => {
    if (!isResizingNav) return undefined

    const handleMouseMove = (event) => {
      const delta = event.clientX - navResizeRef.current.startX
      const nextWidth = navResizeRef.current.baseWidth + delta
      const clamped = Math.min(MAX_NAV_WIDTH, Math.max(MIN_NAV_WIDTH, nextWidth))
      setNavWidth(clamped)
    }

    const handleMouseUp = () => {
      setIsResizingNav(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    document.body.classList.add('wiki-resizing')

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      document.body.classList.remove('wiki-resizing')
    }
  }, [isResizingNav])

  const handleNavResizeStart = (event) => {
    navResizeRef.current = {
      startX: event.clientX,
      baseWidth: navWidth
    }
    setIsResizingNav(true)
  }

  const handleDockPointerDown = (event) => {
    if (event.button !== 0) return
    if (event.target.closest('button')) return
    if (!navVisible) {
      setNavVisible(true)
    }
    navResizeRef.current = {
      startX: event.clientX,
      baseWidth: navWidth
    }
    setIsResizingNav(true)
  }

  return (
    <div className="wiki-shell">
      <WikiSidebar />
      <DocsPageHeader
        tabs={wikiTabs}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      />

      <div className="wiki-layout-controls">
        <div className="wiki-layout-controls__group">
          <button
            type="button"
            className="wiki-rail-toggle"
            onClick={() => setNavVisible((prev) => !prev)}
          >
            {navVisible ? 'Hide Sidebar' : 'Show Sidebar'}
          </button>
          <button
            type="button"
            className="wiki-rail-toggle"
            onClick={() => setTocVisible((prev) => !prev)}
          >
            {tocVisible ? 'Hide Outline' : 'Show Outline'}
          </button>
        </div>
        <p className="wiki-layout-hint">
          Four-column grid: left + two middle tracks + right rail. Collapse rails when you need focus.
        </p>
      </div>

      <DocsRailDrawer
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        title="Wiki Navigation"
      >
        <SidebarNav
          sections={wikiNavigation}
          searchQuery={searchQuery}
          onNavigate={() => setMobileNavOpen(false)}
        />
      </DocsRailDrawer>

      <DocsRailDrawer
        isOpen={mobileTocOpen}
        onClose={() => setMobileTocOpen(false)}
        anchor="right"
        title="Outline"
      >
        {toc.length > 0 ? (
          <DocsToc
            toc={toc}
            onNavigate={() => setMobileTocOpen(false)}
          />
        ) : (
          <p className="wiki-outline-empty">
            Select an article to view its outline.
          </p>
        )}
      </DocsRailDrawer>

      <div className="wiki-shell__content">
        <div className="mx-auto w-full max-w-[1500px] px-6 sm:px-8 lg:px-12 space-y-5">
          {!navVisible ? (
            <div className="wiki-sidebar-dock" onMouseDown={handleDockPointerDown}>
              <button
                type="button"
                className="wiki-sidebar-dock__button"
                onClick={() => setNavVisible(true)}
              >
                Open navigation
              </button>
              <p className="wiki-sidebar-dock__hint">Collapsed by default—pull it out when you need it.</p>
            </div>
          ) : null}

          <div
            className="wiki-grid"
          >
            {navVisible ? (
              <aside
                className="wiki-grid-column"
                style={{ flexBasis: `${navWidth}px`, maxWidth: `${navWidth}px` }}
              >
                <div className="wiki-column-inner space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="wiki-section-label">Navigation</p>
                    <button
                      type="button"
                      className="wiki-sidebar-collapse"
                      onClick={() => setNavVisible(false)}
                    >
                      Collapse
                    </button>
                  </div>
                  <SidebarNav
                    sections={wikiNavigation}
                    searchQuery={searchQuery}
                  />
                </div>
                <button
                  type="button"
                  className="wiki-sidebar-resize"
                  onMouseDown={handleNavResizeStart}
                  aria-label="Resize navigation"
                />
              </aside>
            ) : null}

            <div className="wiki-main-area">
              <Outlet context={outletContext} />
            </div>

            {tocVisible ? (
              <aside className="wiki-grid-column wiki-grid-column--toc">
                <div className="wiki-column-inner">
                  {toc.length > 0 ? (
                    <DocsToc toc={toc} />
                  ) : (
                    <p className="wiki-outline-empty">
                      Outline visible once a page loads.
                    </p>
                  )}
                </div>
              </aside>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WikiLayout
