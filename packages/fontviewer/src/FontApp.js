
import FontViewerSection from './components/FontViewerSection.jsx'

const defaultFontUrl = new URL('./assets/variFont/TGMalromurItalicVF.ttf', import.meta.url).href

const FontApp = () => (
  <div style={{ width: '100vw', height: '100vh' }}>
    <FontViewerSection fontUrl={defaultFontUrl} />
  </div>
)

export default FontApp
