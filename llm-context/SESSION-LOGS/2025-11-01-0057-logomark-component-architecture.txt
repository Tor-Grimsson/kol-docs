┌─────────────────────────────────────────────────────────────────────────────┐
│                    LOGOMARK COLLECTION ARCHITECTURE                         │
│                         Component Hierarchy                                 │
└─────────────────────────────────────────────────────────────────────────────┘

Logomark (Route)
│
├─ LogomarkHero (Hero Section)
│  ├─ Container
│  ├─ SectionHeader
│  └─ Decorative orbital elements (CSS)
│
├─ LogoFilters (Filter System)
│  ├─ Filter by Category (Visual Identity, Brand Identity, etc.)
│  ├─ Filter by Type (Symbol, Wordmark, Lettermark)
│  ├─ Filter by Year (2024)
│  └─ Clear All button
│
├─ LogoGrid (Grid Container)
│  └─ LogoCard × 24 (Individual Logos)
│     ├─ Logo Shape (SVG)
│     │  ├─ Abstract Circle (gradient)
│     │  ├─ Typography Focus (wordmark)
│     │  ├─ Inverted Pyramid (rotated square)
│     │  ├─ GREIND (lettermark)
│     │  ├─ Geometric Type A (3×3 grid)
│     │  ├─ Minimal Chevron (triangle)
│     │  ├─ Square Grid (4×4)
│     │  ├─ Botanical Form (SVG bird)
│     │  ├─ Diagonal Slice (negative space)
│     │  ├─ Circular Split (concentric)
│     │  ├─ Triangular Peak (CSS triangle)
│     │  ├─ Double Frame (nested rectangles)
│     │  ├─ Typographic Grid (pixel letterform)
│     │  ├─ Negative Space (border-only)
│     │  ├─ Rotated Square (45°)
│     │  ├─ Cross Mark (plus sign)
│     │  ├─ Gradient Sphere (radial)
│     │  ├─ Overlapping Circles (offset)
│     │  ├─ Shattered Glass (fragments)
│     │  ├─ Modern Umbrella (silhouette)
│     │  ├─ Nested Forms (concentric)
│     │  ├─ Abstract Bird (full SVG)
│     │  ├─ Vertical Bars (bar chart)
│     │  └─ Orbital Path (circle + dot)
│     │
│     ├─ Metadata
│     │  ├─ Name (e.g., "Abstract Circle")
│     │  ├─ Type (Symbol/Wordmark/Lettermark)
│     │  ├─ Year (2024)
│     │  ├─ Category (Visual Identity, etc.)
│     │  └─ Description
│     │
│     └─ Tags
│        ├─ Type tag
│        └─ Year tag
│
└─ ProjectsList (Client Work)
   └─ FLÍK, Kaffistofan, Kolkrabbi, Canalix, etc.


┌─────────────────────────────────────────────────────────────────────────────┐
│                         DESIGN TOKEN USAGE                                  │
└─────────────────────────────────────────────────────────────────────────────┘

Colors:
├─ Surface Tokens
│  ├─ --kol-surface-primary (background)
│  ├─ --kol-surface-secondary (cards, filters)
│  ├─ --kol-surface-tertiary (card variants)
│  ├─ --kol-surface-inverse (hero background)
│  └─ --kol-surface-on-* (foreground pairing)
│
├─ Accent Tokens
│  ├─ --kol-accent-primary (brand yellow)
│  └─ --kol-accent-on-primary (dark text on yellow)
│
└─ Foreground Tokens
   ├─ --foreground (adaptive text color)
   ├─ --foreground-muted (secondary text)
   └─ --foreground-subtle (tertiary text)

Typography:
├─ kol-display (hero title)
├─ kol-headline (section titles)
├─ kol-text-large (hero description)
├─ kol-text (body text)
├─ kol-text-small (metadata)
└─ kol-label (filter buttons, tags)

Spacing & Layout:
├─ main-wrapper (page wrapper)
├─ card-wrapper (card container)
└─ Container component (padding/layout)


┌─────────────────────────────────────────────────────────────────────────────┐
│                           FILE STRUCTURE                                    │
└─────────────────────────────────────────────────────────────────────────────┘

apps/web/src/
├── routes/
│   └── Logomark.jsx                    # Main route with state & data
│
└── components/sections/logomark/
    ├── LogomarkHero.jsx                # Hero section with gradient bg
    ├── LogoGrid.jsx                    # Responsive grid container
    ├── LogoCard.jsx                    # Individual logo card
    ├── LogoFilters.jsx                 # Filter system
    └── ViewToggle.jsx                  # Grid/List toggle (ready)


┌─────────────────────────────────────────────────────────────────────────────┐
│                          STATE MANAGEMENT                                   │
└─────────────────────────────────────────────────────────────────────────────┘

Filter State:
├─ filters: Set<string>                 # Active filters
│  └─ Format: "category:Visual Identity"
│
└─ useMemo Hooks
   └─ filteredLogomarks: Array          # Computed when filters change


┌─────────────────────────────────────────────────────────────────────────────┐
│                         INTERACTIVE FEATURES                                │
└─────────────────────────────────────────────────────────────────────────────┘

Hover States:
├─ Card hover → scale-110 + shadow
├─ Button hover → background change
└─ Tag hover → border highlight

Animations:
├─ Pulse animation on orbital rings
├─ Scale transforms on logo shapes (300ms)
└─ Smooth color transitions (200ms)

Filtering:
├─ Real-time filter application
├─ Dynamic count display
├─ Multi-filter support (OR logic)
└─ Empty state with clear filters action


┌─────────────────────────────────────────────────────────────────────────────┐
│                         RESPONSIVE BREAKPOINTS                              │
└─────────────────────────────────────────────────────────────────────────────┘

Grid Columns:
├─ Mobile (≤640px)      → 1 column
├─ Tablet (641-1024px)  → 2 columns
├─ Desktop (1025-1280px) → 3 columns
└─ XL (≥1281px)         → 4 columns


┌─────────────────────────────────────────────────────────────────────────────┐
│                         PERFORMANCE FEATURES                                │
└─────────────────────────────────────────────────────────────────────────────┘

Optimizations:
├─ useMemo for filtered results
├─ Inline SVG shapes (no image requests)
├─ CSS transforms (hardware acceleration)
└─ Component modularity (tree-shaking)


┌─────────────────────────────────────────────────────────────────────────────┐
│                         BEFORE vs AFTER                                     │
└─────────────────────────────────────────────────────────────────────────────┘

Before (Figma Export):
├─ 500+ lines of inline styles
├─ Hardcoded colors (bg-zinc-900)
├─ Static prototype
├─ Fixed 1440px width
└─ Single monolithic file

After (Kolkrabbi):
├─ 6 focused React components
├─ Semantic design tokens
├─ Interactive filtering
├─ Fully responsive
└─ Modular architecture


Created: 2025-11-01 00:57
Status: ✅ COMPLETE & PRODUCTION READY
Checkpoint: docs/SESSION-LOGS/2025-11-01-0057-logomark-collection-refactor.md
