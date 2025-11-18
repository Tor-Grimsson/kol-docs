import { useState, useEffect } from 'react'

const DocsToc = ({ toc, onNavigate }) => {
  const [activeId, setActiveId] = useState('')
  const [expandedSections, setExpandedSections] = useState(new Set())

  const handleNavigate = (event) => {
    if (typeof onNavigate === 'function') {
      onNavigate(event)
    }
  }

  // Group TOC items by H2 sections
  const groupedToc = toc.reduce((acc, item) => {
    if (item.level === 2) {
      acc.push({ section: item, children: [] })
    } else if (item.level === 3 || item.level === 4) {
      const lastSection = acc[acc.length - 1]
      if (lastSection) {
        lastSection.children.push(item)
      }
    }
    return acc
  }, [])

  // Track active heading with IntersectionObserver
  useEffect(() => {
    const headingIds = toc.map(item => item.id)
    const headingElements = headingIds
      .map(id => document.getElementById(id))
      .filter(Boolean)

    if (headingElements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the first visible heading (from top)
        const visibleEntries = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visibleEntries.length > 0) {
          const activeElement = visibleEntries[0]
          const activeHeadingId = activeElement.target.id
          setActiveId(activeHeadingId)

          // Auto-expand the section containing this heading
          const activeItem = toc.find(item => item.id === activeHeadingId)
          if (activeItem) {
            // Find the H2 section this item belongs to
            let sectionId = null
            if (activeItem.level === 2) {
              sectionId = activeItem.id
            } else {
              // Find parent H2
              const itemIndex = toc.findIndex(item => item.id === activeHeadingId)
              for (let i = itemIndex - 1; i >= 0; i--) {
                if (toc[i].level === 2) {
                  sectionId = toc[i].id
                  break
                }
              }
            }
            if (sectionId) {
              setExpandedSections(new Set([sectionId]))
            }
          }
        }
      },
      {
        rootMargin: '-80px 0px -80% 0px',
        threshold: 0
      }
    )

    headingElements.forEach(element => observer.observe(element))

    return () => {
      headingElements.forEach(element => observer.unobserve(element))
    }
  }, [toc])

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }

  return (
    <nav>
      <ul className="space-y-1">
        {groupedToc.map(({ section, children }) => {
          const isExpanded = expandedSections.has(section.id)
          const hasChildren = children.length > 0
          const isSectionActive = activeId === section.id
          const hasActiveChild = children.some(child => child.id === activeId)

          return (
            <li key={section.id}>
              <div className="flex items-center gap-1">
                {hasChildren && (
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="docs-toc-expand-button"
                    aria-label={isExpanded ? 'Collapse section' : 'Expand section'}
                  >
                    <svg
                      className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
                <a
                  href={`#${section.id}`}
                  className={`docs-sidebar-link flex-1 ${!hasChildren ? 'ml-4' : ''} ${isSectionActive ? 'active' : ''}`}
                  onClick={handleNavigate}
                >
                  {section.label}
                </a>
              </div>

              {hasChildren && isExpanded && (
                <ul className="space-y-1 mt-1">
                  {children.map((child) => {
                    const isActive = activeId === child.id
                    const indent = child.level === 3 ? 'ml-7' : 'ml-10'
                    return (
                      <li key={child.id}>
                        <a
                          href={`#${child.id}`}
                          className={`docs-sidebar-link block ${indent} ${isActive ? 'active' : ''}`}
                          onClick={handleNavigate}
                        >
                          {child.label}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default DocsToc
