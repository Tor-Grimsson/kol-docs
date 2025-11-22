const DocsToc = ({ headings = [] }) => {
  if (!headings.length) return null

  return (
    <nav className="p-4">
      <h2 className="kol-heading-sm mb-4">Contents</h2>
      <ul className="space-y-2">
        {headings.map((heading, i) => (
          <li key={i}>
            <a
              href={`#${heading.id}`}
              className="kol-body-sm kol-link"
              style={{ paddingLeft: `${(heading.level - 1) * 12}px` }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default DocsToc
