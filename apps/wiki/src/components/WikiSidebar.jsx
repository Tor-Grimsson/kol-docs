import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Divider, Icon, ThemeToggleButton } from './atoms'
import { useTheme } from '../hooks/useTheme'
import { wikiNavigation } from '../data/wikiPages.js'

const COLLAPSED_WIDTH = 96
const EXPANDED_WIDTH = 320

const ICON_MAP = {
  overview: 'styleguide',
  foundations: 'foundation',
  operations: 'component',
  databases: 'grid',
  media: 'picture-in-picture',
  default: 'arrow-downright'
}

const ensureWikiPath = (path = '/') => (path.startsWith('/') ? path : `/${path}`)

const buildRoutes = () => {
  const sections = wikiNavigation.map((section) => ({
    id: section.id,
    label: section.label,
    icon: ICON_MAP[section.id] || ICON_MAP.default,
    path: section.pages?.[0] ? ensureWikiPath(`page/${section.pages[0].slug}`) : '/',
    children: section.pages.map((page) => ({
      id: page.slug,
      label: page.title,
      path: ensureWikiPath(`page/${page.slug}`)
    }))
  }))

  return [
    { id: 'overview', label: 'Overview', icon: ICON_MAP.overview, path: '/' },
    ...sections,
    { id: 'databases', label: 'Databases', icon: ICON_MAP.databases, path: '/databases' },
    { id: 'media', label: 'Media', icon: ICON_MAP.media, path: '/media' }
  ]
}

const computeDestination = (node) => {
  if (!node) return '/'
  if (node.path) return ensureWikiPath(node.path)
  if (Array.isArray(node.children) && node.children.length > 0) {
    return computeDestination(node.children[0])
  }
  return '/'
}

const isNodeActive = (node, normalizedPath) => {
  const destination = computeDestination(node)
  if (normalizedPath === destination) {
    return true
  }

  if (Array.isArray(node.children) && node.children.length > 0) {
    return node.children.some((child) => isNodeActive(child, normalizedPath))
  }

  return normalizedPath.startsWith(`${destination}/`)
}

const WikiSidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  const normalizedPath = location.pathname.replace(/\/$/, '') || '/'
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isSidebarLocked, setIsSidebarLocked] = useState(false)
  const [expandedItems, setExpandedItems] = useState({})
  const [activeOverlay, setActiveOverlay] = useState(null)
  const [overlayPosition, setOverlayPosition] = useState({ top: 0, left: 0 })
  const lastExpandedRef = useRef({})
  const routes = useMemo(() => buildRoutes(), [])

  useEffect(() => {
    const width = isCollapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH
    document.documentElement.style.setProperty('--wiki-primary-sidebar-width', `${width}px`)
    return () => {
      document.documentElement.style.removeProperty('--wiki-primary-sidebar-width')
    }
  }, [isCollapsed])

  useEffect(() => {
    if (!activeOverlay) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveOverlay(null)
  }, [normalizedPath, activeOverlay])

  const toggleGroup = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev
      if (next) {
        lastExpandedRef.current = expandedItems
        setExpandedItems({})
      } else {
        setExpandedItems(lastExpandedRef.current || {})
      }
      return next
    })
    setActiveOverlay(null)
  }

  const primaryIcons = useMemo(
    () =>
      routes.map((route) => {
        const destination = computeDestination(route)
        const isActive = normalizedPath === destination || normalizedPath.startsWith(`${destination}/`)
        return {
          id: route.id,
          label: route.label,
          icon: route.icon || ICON_MAP.default,
          to: destination,
          isActive,
          hasChildren: Boolean(route.children?.length)
        }
      }),
    [routes, normalizedPath]
  )

  const renderNode = (node, depth = 0) => {
    const hasChildren = Array.isArray(node.children) && node.children.length > 0
    const destination = computeDestination(node)
    const isActive = isNodeActive(node, normalizedPath)
    const indentStyle = depth ? { marginInlineStart: `${depth * 24}px` } : undefined
    const isExpanded = hasChildren ? Boolean(expandedItems[node.id]) : false

    if (hasChildren) {
      const handleParentClick = (event) => {
        if (normalizedPath === destination) {
          event.preventDefault()
          toggleGroup(node.id)
        } else if (isExpanded) {
          event.preventDefault()
          setExpandedItems((prev) => {
            const next = { ...prev }
            delete next[node.id]
            return next
          })
        }
      }

      return (
        <div key={node.id} className="flex flex-col gap-1" style={indentStyle}>
          <NavLink
            to={destination}
            onClick={handleParentClick}
            className={({ isActive: navActive }) =>
              [
                'flex h-9 w-full items-center gap-4 rounded-full px-3 transition-colors duration-200',
                navActive || isActive ? 'bg-fg-04 text-auto' : 'text-auto hover:bg-fg-012'
              ].join(' ')
            }
          >
            <Icon name={node.icon || ICON_MAP.default} size={16} />
            <span className="kol-mono-text text-[14px]">{node.label}</span>
            <button
              type="button"
              className="ml-auto flex h-7 w-7 items-center justify-center rounded-full text-current transition-colors duration-200 hover:bg-fg-012"
              onClick={(event) => {
                event.preventDefault()
                event.stopPropagation()
                toggleGroup(node.id)
              }}
              aria-label={isExpanded ? `Collapse ${node.label}` : `Expand ${node.label}`}
            >
              <Icon name={isExpanded ? '12px-minus' : '12px-plus'} size={12} />
            </button>
          </NavLink>
          {isExpanded ? (
            <div className="flex flex-col gap-0">
              {node.children.map((child) => renderNode(child, depth + 1))}
            </div>
          ) : null}
        </div>
      )
    }

    return (
      <NavLink
        key={node.id}
        to={destination}
        className={({ isActive: navActive }) =>
          [
            'flex h-9 items-center gap-3 rounded-full px-3 transition-colors duration-200',
            navActive ? 'bg-fg-04 text-auto' : 'text-auto hover:bg-fg-012'
          ].join(' ')
        }
        style={indentStyle}
      >
        <Icon name={node.icon || ICON_MAP.default} size={16} />
        <span className="kol-mono-text text-[14px]">{node.label}</span>
      </NavLink>
    )
  }

  const handleIconClick = (event, item) => {
    if (!isCollapsed) return
    event.preventDefault()
    if (item.hasChildren) {
      if (activeOverlay === item.id) {
        setActiveOverlay(null)
        return
      }
      const rect = event.currentTarget.getBoundingClientRect()
      setOverlayPosition({ top: rect.bottom + 8, left: rect.left })
      setActiveOverlay(item.id)
    } else {
      navigate(item.to)
      setActiveOverlay(null)
    }
  }

  if (isSidebarLocked) {
    // Keep sidebar expanded
    if (isCollapsed) {
      setIsCollapsed(false)
    }
  }

  return (
    <>
      {activeOverlay && isCollapsed ? (
        <>
          <div className="fixed inset-0 z-[55]" onClick={() => setActiveOverlay(null)} />
          <div
            className="fixed z-[60] rounded-lg border border-fg-08 bg-surface-secondary/80 backdrop-blur px-4 py-3"
            style={{ top: overlayPosition.top, left: overlayPosition.left }}
          >
            <div className="mb-3 kol-helper-s text-fg-80 uppercase tracking-[0.2em]">
              {routes.find((route) => route.id === activeOverlay)?.label}
            </div>
            <div className="flex flex-col gap-2">
              {routes
                .find((route) => route.id === activeOverlay)
                ?.children?.map((child) => (
                  <Link
                    key={child.id}
                    to={child.path}
                    className="kol-helper-xs text-fg-72 hover:text-fg-96"
                  >
                    {child.label}
                  </Link>
                ))}
            </div>
          </div>
        </>
      ) : null}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-40 border-r border-fg-08 bg-surface-primary transition-all duration-200',
          isCollapsed ? 'w-[96px]' : 'w-[320px]'
        ].join(' ')}
      >
        {isCollapsed ? (
          <div className="flex h-full flex-col items-center gap-6 py-8">
            <button
              type="button"
              aria-label="Expand sidebar"
              onClick={toggleSidebar}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-fg-02"
            >
              <Icon name="menu" size={16} />
            </button>
            <nav className="flex flex-1 flex-col items-center gap-2">
              {primaryIcons.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={(event) => handleIconClick(event, item)}
                  className={[
                    'flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200',
                    item.isActive ? 'bg-fg-02 text-fg-96' : 'text-fg-48 hover:bg-fg-012'
                  ].join(' ')}
                >
                  <Icon name={item.icon} size={16} />
                </button>
              ))}
            </nav>
            <ThemeToggleButton
              variant="compact"
              isToggled={theme === 'dark'}
              onClick={toggleTheme}
            />
          </div>
        ) : (
          <div className="flex h-full flex-col px-6 py-10">
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="inline-flex text-2xl font-semibold uppercase tracking-[0.4em]"
                onClick={() => navigate('/')}
              >
                Kolkrabbi
              </button>
              <button
                type="button"
                aria-label="Collapse sidebar"
                onClick={toggleSidebar}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-fg-02"
              >
                <Icon name="chevron-left" size={16} />
              </button>
            </div>

            <div className="space-y-3 mt-8">
              <p className="text-4xl font-semibold tracking-tight">Wiki</p>
              <p className="kol-mono-text text-[14px] text-fg-48">
                Tokens, rituals, and references. Drag the edge to keep it parked open.
              </p>
            </div>

            <Divider className="my-8" />

            <nav className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
              {routes.map((route) => renderNode(route))}
            </nav>

            <div className="mt-6 flex items-center gap-4">
              <ThemeToggleButton
                variant="compact"
                isToggled={theme === 'dark'}
                onClick={toggleTheme}
              />
              <button
                type="button"
                className="toggle-switch border-0 bg-surface-primary"
                data-state={isSidebarLocked ? 'on' : 'off'}
                onClick={() => setIsSidebarLocked((prev) => !prev)}
                aria-label="Lock sidebar"
                aria-pressed={isSidebarLocked}
              >
                <span className="toggle-switch-indicator" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}

export default WikiSidebar
