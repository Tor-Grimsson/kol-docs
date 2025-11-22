import WikiGallery from '../WikiGallery.jsx'

const MediaGallery = ({ items }) => (
  <div className="wiki-media-gallery">
    <WikiGallery
      photos={items.map((item) => ({
        id: item.id,
        src: item.src,
        width: item.width,
        height: item.height,
        alt: item.name,
        meta: item,
        caption: item.name
      }))}
      spacing={16}
      showMeta
    />
  </div>
)

export default MediaGallery
