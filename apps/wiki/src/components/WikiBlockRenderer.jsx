import { DocsCodeBlock } from '../components/docs'
import { normalizeBlock } from '../utils/wikiSchema.js'
import WikiGallery from './WikiGallery.jsx'

const toneMap = {
  accent: 'accent',
  warning: 'warning',
  info: 'info'
}

const QuoteBlock = ({ content }) => (
  <figure className="wiki-quote-block">
    <blockquote>{content.text}</blockquote>
    {content.attribution ? <figcaption>— {content.attribution}</figcaption> : null}
  </figure>
)

const GalleryBlock = ({ content }) =>
  content.photos?.length ? (
    <div className="wiki-gallery-block">
      <WikiGallery
        photos={content.photos}
        spacing={content.spacing}
      />
    </div>
  ) : null

const CalloutBlock = ({ content }) => (
  <div className="wiki-callout" data-tone={toneMap[content.tone] || 'accent'}>
    {content.title ? (
      <p className="text-sm font-semibold uppercase tracking-[0.2em]">
        {content.title}
      </p>
    ) : null}
    <p className="mt-2 text-sm text-fg-80">{content.text}</p>
  </div>
)

const blockComponentMap = {
  heading: ({ content }) => (
    <h3 className="text-2xl font-semibold text-fg-96">
      {content.text}
    </h3>
  ),
  paragraph: ({ content }) => (
    <p className="text-base leading-relaxed text-fg-80">
      {content.text}
    </p>
  ),
  list: ({ content }) => (
    <ul className="wiki-list">
      {content.items?.map((item, index) => (
        <li key={`${item}-${index}`} className="mb-2 last:mb-0">
          {item}
        </li>
      ))}
    </ul>
  ),
  code: ({ content }) => (
    <DocsCodeBlock
      code={content.code}
      language={content.language}
    />
  ),
  callout: CalloutBlock,
  quote: QuoteBlock,
  gallery: GalleryBlock
}

const WikiBlockRenderer = ({ blocks = [] }) => (
  <div className="space-y-4">
    {blocks.map((block, index) => {
      const normalized = normalizeBlock(block)
      const Component = blockComponentMap[normalized.type]
      if (!Component) return null
      return (
        <div key={normalized.id || `${normalized.type}-${index}`}>
          <Component content={normalized.content} />
        </div>
      )
    })}
  </div>
)

export default WikiBlockRenderer
