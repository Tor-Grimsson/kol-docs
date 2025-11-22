const DocsCodeBlock = ({ code, language = 'text' }) => (
  <pre className="kol-code-block">
    <code className={`language-${language}`}>{code}</code>
  </pre>
)

export default DocsCodeBlock
