import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { searchDocs } from '../utils/loadDocs.js'

/**
 * Quick search modal (Cmd+K)
 * Fuzzy search across all pages
 */

export default function QuickSearch({ isOpen, onClose, allDocs }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef(null)

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      setQuery('')
      setResults([])
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Search when query changes
  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchDocs(allDocs, query)
      setResults(searchResults.slice(0, 10)) // Limit to 10 results
      setSelectedIndex(0)
    } else {
      setResults([])
    }
  }, [query, allDocs])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(i => Math.min(i + 1, results.length - 1))
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(i => Math.max(i - 1, 0))
        return
      }

      if (e.key === 'Enter' && results[selectedIndex]) {
        e.preventDefault()
        navigate(results[selectedIndex].path)
        onClose()
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, navigate, onClose])

  if (!isOpen) return null

  return (
    <div className="quick-search-overlay" onClick={onClose}>
      <div className="quick-search-modal" onClick={e => e.stopPropagation()}>
        {/* Search Input */}
        <div className="quick-search-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="quick-search-input"
            placeholder="Search pages... (type to search)"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="quick-search-results">
            {results.map((doc, index) => (
              <button
                key={doc.slug}
                className={`quick-search-result ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => {
                  navigate(doc.path)
                  onClose()
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="quick-search-result-version">{doc.version}</div>
                <div className="quick-search-result-title">{doc.title}</div>
              </button>
            ))}
          </div>
        )}

        {/* Empty State */}
        {query && results.length === 0 && (
          <div className="quick-search-empty">
            No results found for "{query}"
          </div>
        )}

        {/* Keyboard Hints */}
        <div className="quick-search-hints">
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  )
}
