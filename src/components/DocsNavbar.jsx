import { Link } from 'react-router-dom'

/**
 * DocsNavbar
 *
 * Top navigation bar matching the reference design.
 * Shows: Logo | Documentation Title | Tab Navigation | Search
 */

const DocsNavbar = ({ tabs = [], searchQuery = '', onSearch }) => {
  return (
    <nav className="docs-navbar">
      <div className="docs-navbar-inner">
        {/* Logo */}
        <Link to="/" className="docs-navbar-logo">
          KOLKRABBI
        </Link>

        {/* Section Title */}
        <div className="docs-navbar-title">
          DOCUMENTATION
        </div>

        {/* Tab Navigation */}
        <div className="docs-navbar-tabs">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              to={tab.path}
              className="docs-navbar-tab"
            >
              <span className="docs-navbar-tab-icon">📄</span>
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Search */}
        <div className="docs-navbar-search">
          <input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearch?.(e.target.value)}
            className="docs-navbar-search-input"
          />
        </div>
      </div>
    </nav>
  )
}

export default DocsNavbar
