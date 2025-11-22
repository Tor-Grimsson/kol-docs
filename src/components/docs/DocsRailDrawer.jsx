import { useState } from 'react'

const DocsRailDrawer = ({ side = 'left', children }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="kol-btn md:hidden fixed top-4 z-50"
        style={{ [side]: '1rem' }}
      >
        ☰
      </button>
      <div
        className={`
          fixed md:sticky top-0 ${side === 'left' ? 'left-0' : 'right-0'}
          h-screen bg-auto z-40 overflow-y-auto
          transition-transform duration-300
          ${isOpen ? 'translate-x-0' : side === 'left' ? '-translate-x-full md:translate-x-0' : 'translate-x-full md:translate-x-0'}
        `}
      >
        {children}
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 bg-fg-24 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default DocsRailDrawer
