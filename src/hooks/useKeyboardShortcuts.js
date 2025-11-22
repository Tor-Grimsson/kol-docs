import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Keyboard shortcuts for Notion-like navigation
 * Cmd+K - Quick search
 * Cmd+N - New page
 * Cmd+[ - Go back
 * Cmd+] - Go forward
 */

export function useKeyboardShortcuts({ onOpenSearch, onNewPage, allDocs, currentSlug }) {
  const navigate = useNavigate()

  useEffect(() => {
    function handleKeyDown(e) {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
      const modKey = isMac ? e.metaKey : e.ctrlKey

      // Cmd/Ctrl + K - Quick search
      if (modKey && e.key === 'k') {
        e.preventDefault()
        onOpenSearch?.()
        return
      }

      // Cmd/Ctrl + N - New page
      if (modKey && e.key === 'n') {
        e.preventDefault()
        onNewPage?.()
        return
      }

      // Cmd/Ctrl + [ - Go back
      if (modKey && e.key === '[') {
        e.preventDefault()
        navigate(-1)
        return
      }

      // Cmd/Ctrl + ] - Go forward
      if (modKey && e.key === ']') {
        e.preventDefault()
        navigate(1)
        return
      }

      // Arrow keys for prev/next page (when not in input)
      if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        if (modKey && e.key === 'ArrowUp') {
          e.preventDefault()
          navigateToAdjacentPage(allDocs, currentSlug, -1, navigate)
          return
        }

        if (modKey && e.key === 'ArrowDown') {
          e.preventDefault()
          navigateToAdjacentPage(allDocs, currentSlug, 1, navigate)
          return
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [navigate, onOpenSearch, onNewPage, allDocs, currentSlug])
}

/**
 * Navigate to previous/next page in the list
 */
function navigateToAdjacentPage(allDocs, currentSlug, direction, navigate) {
  if (!allDocs || !currentSlug) return

  const currentIndex = allDocs.findIndex(doc => doc.slug === currentSlug)
  if (currentIndex === -1) return

  const nextIndex = currentIndex + direction
  if (nextIndex < 0 || nextIndex >= allDocs.length) return

  const nextDoc = allDocs[nextIndex]
  navigate(nextDoc.path)
}
