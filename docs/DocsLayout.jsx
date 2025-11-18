const join = (...classes) => classes.filter(Boolean).join(' ')

export const DocsLayout = ({ children, className }) => (
  <div
    className={join(
      'grid gap-8 lg:grid-cols-[304px_minmax(0,1fr)] xl:grid-cols-[304px_minmax(0,1fr)_192px]',
      className
    )}
  >
    {children}
  </div>
)

export const DocsNavColumn = ({ children, sticky = false, className }) => {
  return (
    <aside className={join('flex-shrink-0', className)}>
      <div className="py-8 pr-8">{children}</div>
    </aside>
  )
}

export const DocsMainColumn = ({ children, className }) => (
  <main className={join('', className)}>
    <div className="py-8">
      {children}
    </div>
  </main>
)

export const DocsTocColumn = ({ children, className }) => (
  <aside className={join('flex-shrink-0', className)}>
    <div className="py-8 pl-8">{children}</div>
  </aside>
)

export default DocsLayout
