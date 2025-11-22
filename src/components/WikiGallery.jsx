const getAspectRatio = (photo) => {
  if (photo.width && photo.height) {
    return `${photo.width} / ${photo.height}`
  }
  return '4 / 3'
}

const WikiGallery = ({ photos = [], spacing = 12, showMeta = false }) => {
  if (!photos.length) return null

  return (
    <div
      className="wiki-gallery-grid"
      style={{ gap: `${spacing}px` }}
    >
      {photos.map((photo, index) => (
        <figure
          key={photo.id || photo.src || index}
          className="wiki-gallery-item"
          style={{ aspectRatio: getAspectRatio(photo) }}
        >
          <img
            src={photo.src}
            alt={photo.alt || photo.caption || 'Gallery image'}
            loading="lazy"
          />
          {showMeta ? (
            <figcaption>
              <p>{photo.caption || photo.alt || photo.meta?.name}</p>
              {photo.meta?.dimensions ? <span>{photo.meta.dimensions}</span> : null}
            </figcaption>
          ) : null}
        </figure>
      ))}
    </div>
  )
}

export default WikiGallery
