import { useEffect } from 'react'
import { DocsArticle, DocsHeader } from '../components/docs'
import { useOutletContext } from 'react-router-dom'
import MediaTable from '../components/media/MediaTable.jsx'
import MediaGallery from '../components/media/MediaGallery.jsx'
import { mediaLibrary } from '../data/mediaLibrary.js'

const WikiMedia = () => {
  const { setToc } = useOutletContext()

  useEffect(() => {
    setToc([
      { id: 'media-library-table', label: 'Library table', level: 2 },
      { id: 'media-gallery', label: 'Gallery', level: 2 }
    ])
  }, [setToc])

  return (
    <div className="space-y-8">
      <DocsHeader
        title="Media Library"
        subtitle="Administrative view of wiki-ready art, screenshots, and supporting media."
        meta={[
          { label: 'Assets', value: `${mediaLibrary.length}` },
          { label: 'Sources', value: 'Docs, Studio, Foundry' }
        ]}
      />

      <DocsArticle id="media-library-table" className="wiki-article-section space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="wiki-section-label">Admin list</p>
            <p className="text-sm text-fg-64">
              Sort by update time or owner. Each row references the canonical asset stored in Drive.
            </p>
          </div>
          <span className="kol-mono-xs text-fg-48 uppercase tracking-[0.16em]">
            {mediaLibrary.length} items
          </span>
        </div>
        <MediaTable data={mediaLibrary} />
      </DocsArticle>

      <DocsArticle id="media-gallery" className="wiki-article-section space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="wiki-section-label">Gallery</p>
            <p className="text-sm text-fg-64">
              Quickly scan color, tone, and composition with the same Photo Album widget planned for docs.
            </p>
          </div>
          <span className="kol-mono-xs text-fg-48 uppercase tracking-[0.16em]">
            React Photo Album
          </span>
        </div>
        <MediaGallery items={mediaLibrary} />
      </DocsArticle>
    </div>
  )
}

export default WikiMedia
