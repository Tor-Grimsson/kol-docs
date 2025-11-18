import { Icon } from '@kol/ui'

const DocsRailDrawer = ({
  isOpen,
  onClose,
  anchor = 'left',
  title,
  children
}) => {
  if (!isOpen) return null

  const anchorClass = anchor === 'right' ? 'right-0' : 'left-0'

  return (
    <div className="lg:hidden">
      <div
        className="fixed inset-0 z-[80] bg-fg-0 bg-opacity-40"
        onClick={onClose}
      />
      <div
        className={`fixed inset-y-0 ${anchorClass} z-[90] flex w-full max-w-md flex-col bg-surface-primary px-5 py-6 shadow-2xl`}
      >
        <div className="mb-6 flex items-center justify-between">
          <p className="kol-mono-xs uppercase tracking-[0.2em] text-fg-48">
            {title}
          </p>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full border border-fg-16 px-3 py-1 text-xs uppercase tracking-[0.16em] text-fg-64 hover:border-fg-24"
          >
            <Icon name="chevron-right" size={12} className="rotate-180" />
            Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pr-1">
          {children}
        </div>
      </div>
    </div>
  )
}

export default DocsRailDrawer
