const Wordmark = ({ className = '', ...rest }) => (
  <span
    className={[
      'inline-flex items-center gap-2',
      'tracking-[0.32em] uppercase',
      'text-sm font-semibold text-fg-80',
      className
    ]
      .filter(Boolean)
      .join(' ')}
    {...rest}
  >
    <span className="text-fg-96">Kolkrabbi</span>
    <span className="text-fg-48 tracking-[0.2em]">Docs</span>
  </span>
)

export default Wordmark
