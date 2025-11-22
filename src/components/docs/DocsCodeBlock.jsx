import { useState } from 'react'

/**
 * DocsCodeBlock
 *
 * Code block component with language label and copy functionality.
 * Supports syntax highlighting via CSS classes.
 * Provides copy-to-clipboard button for user convenience.
 */

const DocsCodeBlock = ({ code, language = 'text', showLineNumbers = false }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="docs-code-block-wrapper">
      <div className="docs-code-header">
        {language !== 'text' && (
          <span className="docs-code-language">{language}</span>
        )}
        <button
          type="button"
          onClick={handleCopy}
          className="docs-code-copy-btn"
          aria-label="Copy code to clipboard"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className={`docs-code-block ${showLineNumbers ? 'line-numbers' : ''}`}>
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  )
}

export default DocsCodeBlock
