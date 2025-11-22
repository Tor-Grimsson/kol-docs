import { useMemo, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { DocsToc } from './docs'
import DocsNavbar from './DocsNavbar.jsx'
import SidebarNav from './SidebarNav.jsx'
import { navigation } from '../utils/loadDocs.js'
import { wikiTabs } from '../data/wikiPages.js'

/**
 * WikiLayout
 *
 * Main layout matching reference design:
 * - Top: Navbar with logo, title, tabs, search
 * - Left: Collapsible tree navigation
 * - Center: Main content area
 * - Right: Table of contents + navigation links
 */

const WikiLayout = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [toc, setToc] = useState([])

  const outletContext = useMemo(
    () => ({
      setToc,
      toc
    }),
    [toc]
  )

  return (
    <div className="docs-layout">
      {/* Top Navbar */}
      <DocsNavbar
        tabs={wikiTabs}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />

      {/* Main 3-Column Layout */}
      <div className="docs-layout-body">
        {/* Left Sidebar - Navigation */}
        <aside className="docs-sidebar docs-sidebar--left">
          <div className="docs-sidebar-header">
            <h2 className="docs-sidebar-title">DOCUMENTATION</h2>
          </div>
          <div className="docs-sidebar-content">
            <SidebarNav
              sections={navigation}
              searchQuery={searchQuery}
            />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="docs-main-content">
          <div className="docs-main-content-inner">
            <Outlet context={outletContext} />
          </div>
        </main>

        {/* Right Sidebar - TOC */}
        <aside className="docs-sidebar docs-sidebar--right">
          <div className="docs-sidebar-section">
            <h3 className="docs-sidebar-section-title">ON THIS PAGE</h3>
            {toc.length > 0 ? (
              <DocsToc toc={toc} />
            ) : (
              <p className="docs-sidebar-empty">
                Getting Started
              </p>
            )}
          </div>

          <div className="docs-sidebar-section">
            <h3 className="docs-sidebar-section-title">NAVIGATION</h3>
            <p className="docs-sidebar-empty">
              Documentation list
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default WikiLayout
