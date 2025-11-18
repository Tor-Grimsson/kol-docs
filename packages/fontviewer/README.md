# @kol/fontviewer

Independent FontViewer module for variable font display and interaction.

## Overview

This package provides React components and utilities for displaying and interacting with variable fonts, including:
- Variable font axis controls
- Font metrics overlay
- Glyph animation
- Interactive UI controls
- Font information display

## Installation

```bash
# In the monorepo, this package is already linked via Yarn workspaces
yarn workspace <your-app> add @kol/fontviewer
```

## Usage

### Basic FontViewerComponent

```jsx
import { FontViewerComponent } from '@kol/fontviewer'
import '@kol/fontviewer/src/styles/styles.css'

function MyFontPage() {
  return (
    <FontViewerComponent
      fontUrl="/path/to/your/variable-font.ttf"
      showControls={true}
      showMetrics={false}
      initialFontSize={600}
      autoStart={true}
      animationDelay={1000}
    />
  )
}
```

### Using FontViewerSection

```jsx
import { FontViewerSection } from '@kol/fontviewer'

function MyPage() {
  return (
    <FontViewerSection
      fontUrl="/fonts/MyFont-VF.ttf"
      config={{
        showControls: true,
        showMetrics: true,
        initialFontSize: 500
      }}
    />
  )
}
```

### Using Utilities Directly

```jsx
import {
  FontLoader,
  GlyphAnimator,
  MetricsOverlay,
  UIControls,
  VariationAxes
} from '@kol/fontviewer'

// Use utilities for custom implementations
const fontLoader = new FontLoader()
const font = await fontLoader.load('/path/to/font.ttf')
```

## Props

### FontViewerComponent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `fontUrl` | string | required | Path to the variable font file (.ttf, .otf) |
| `showControls` | boolean | `true` | Show UI controls for font settings |
| `showMetrics` | boolean | `false` | Display font metrics overlay |
| `initialFontSize` | number | `600` | Starting font size in pixels |
| `autoStart` | boolean | `true` | Auto-start glyph animation |
| `animationDelay` | number | `1000` | Delay between glyph animations (ms) |
| `config` | object | `{}` | Additional configuration options |

## Features

- ✅ Variable font axis controls (weight, width, slant, optical size, etc.)
- ✅ Real-time font metrics visualization
- ✅ Glyph cycling animation
- ✅ Font size adjustment
- ✅ Font information panel (axes, glyphs, features)
- ✅ OpenType.js integration
- ✅ Responsive UI controls

## Dependencies

- `opentype.js` - Font parsing and manipulation
- `react` (peer dependency) - UI framework

## File Structure

```
@kol/fontviewer/
├── src/
│   ├── components/
│   │   ├── FontViewerComponent.jsx  # Main component
│   │   └── FontViewerSection.jsx    # Section wrapper
│   ├── utils/
│   │   ├── FontLoader.js            # Font loading
│   │   ├── GlyphAnimator.js         # Animation logic
│   │   ├── MetricsOverlay.js        # Metrics display
│   │   ├── UIControls.js            # UI control logic
│   │   ├── VariationAxes.js         # Variable font axes
│   │   ├── FontInfo.js              # Font information
│   │   └── Types.js                 # Type definitions
│   ├── styles/
│   │   └── styles.css               # Component styles
│   ├── assets/
│   │   └── variFont/                # Sample fonts
│   └── index.js                     # Public exports
└── package.json
```

## Notes

- **No TypeScript**: Per project rules, this package uses plain JavaScript/JSX only
- **Tailwind**: Does not use Tailwind; has standalone CSS
- **Peer Dependencies**: Apps using this package must provide React 18+

## Examples

See `apps/foundry` for a complete implementation using `@kol/fontviewer`.

## License

MIT
