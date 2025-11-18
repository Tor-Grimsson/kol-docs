import { Link, useInRouterContext } from 'react-router-dom'
import { ThemeToggleButton, Icon, useTheme } from '@kol/ui'
import Wordmark from './Wordmark.jsx'

const DocsPageHeader = ({ tabs = [], onSearch, searchQuery }) => {
  const { theme, toggleTheme } = useTheme()
  const hasRouter = typeof useInRouterContext === 'function' ? useInRouterContext() : false
  const LinkComponent = hasRouter ? Link : 'a'

  return (
    <div className="docs-page-header sticky top-0 z-50 flex-shrink-0">
      {/* Logo + Docs + Toggle */}
      <div className="border-b border-fg-08">
        <div className="max-w-[1400px] mx-auto px-10 py-6">
          <div className="flex items-center justify-between">
            {/* Left: Kolkrabbi */}
            <LinkComponent {...(hasRouter ? { to: '/' } : { href: '/' })} className="flex items-center transition-opacity hover:opacity-80" style={{ width: '296px' }}>
              <Wordmark className="h-6 w-auto" />
            </LinkComponent>

            {/* Center: Docs (aligned with main content) */}
            <LinkComponent {...(hasRouter ? { to: '/workshop/design-system/documentation' } : { href: '/workshop/design-system/documentation' })} className="flex items-center transition-opacity hover:opacity-80 flex-1" style={{ paddingLeft: '32px' }}>
              <img src="/svg/docs-documentation.svg" alt="Docs" className="wordmarkBrand h-6 w-auto" />
            </LinkComponent>

            {/* Right: Theme Toggle */}
            <ThemeToggleButton
              variant="default"
              isToggled={theme === 'dark'}
              onClick={toggleTheme}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      {tabs.length > 0 && (
        <div className="w-full border-b border-fg-08">
          <div className="max-w-[1400px] mx-auto px-10">
            <div className="docs-tabrow-items">
              <div style={{ display: 'flex', gap: '24px', flex: 1 }}>
                {tabs.map((tab) =>
                  tab.path ? (
                    <LinkComponent key={`tab-${tab.id}`} {...(hasRouter ? { to: tab.path } : { href: tab.path })} className="docs-tab">
                      {tab.icon && <Icon name={tab.icon} size={14} />}
                      {tab.label}
                    </LinkComponent>
                  ) : (
                    <span key={`tab-${tab.id}`} className="docs-tab">
                      {tab.icon && <Icon name={tab.icon} size={14} />}
                      {tab.label}
                    </span>
                  )
                )}
              </div>
              {onSearch && (
                <div className="w-60 flex justify-start" style={{ paddingLeft: '20px' }}>
                  <div className="docs-tab-search-wrapper">
                    <Icon name="search-16" size={14} />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery || ''}
                      onChange={(e) => onSearch(e.target.value)}
                      className="docs-tab-search"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default DocsPageHeader
