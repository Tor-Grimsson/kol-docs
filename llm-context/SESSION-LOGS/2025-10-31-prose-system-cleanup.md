# Prose System Cleanup & Design System Compliance

**Date:** 2025-10-31
**Session Focus:** Simplifying prose system architecture and ensuring design system compliance

---

## Overview

Major refactoring of the prose typography system to eliminate unnecessary abstraction layers and ensure all components follow design system rules. Reduced complexity from 6 files (538 lines) to 1 file (209 lines).

---

## Work Completed

### 1. Prose System Simplification

**Problem:** Over-engineered component architecture with 5 layers of indirection making it difficult to find and edit content.

**Changes:**
- **Consolidated** all prose examples into single `Prose.jsx` file (209 lines)
- **Deleted** 4 unnecessary files:
  - `ProseBaseline.jsx` - merged baseline grid inline
  - `ProseExample.jsx` - unnecessary wrapper
  - `ProseRenderer.jsx` - 28 lines that was just `<div className="kol-prose">`
  - `BaselineGrid.jsx` - moved SVG inline
- **Updated** `ArticleLayout.jsx` to use `className="kol-prose"` directly
- **Removed** ProseBaseline route from navigation

**Impact:**
- 72% reduction in code (538 → 209 lines)
- All content now visible and editable in one place
- Zero layers of indirection

### 2. Design System Compliance Fixes

#### Component Usage
- **Tag Component:** Fixed incorrect `size` prop usage in `ArticleLayout.jsx`
  - Removed invalid `size="sm"` prop (Tag only accepts `variant`, `children`, `className`)
  - Changed header tags from `variant="inverse"` to `variant="subtle"`
  - Fixed footer tags to remove `size` prop

#### Typography Classes
- **Fixed** System Information labels from `text-fg-80` to `text-fg-64`
- **Verified** all typography classes follow design system conventions:
  - `kol-heading-section` for main heading
  - `kol-mono-text` for descriptions
  - `kol-mono-xs text-fg-64` for metadata/labels

#### Control Components
- **Replaced** raw `<button>` elements with proper `Tag` component
- Tags are more appropriate for view/filter controls (non-intrusive, toggleable)
- Uses `tag-control` class with proper `.is-active` state support
- Controls now appear as: "Default (65ch)" instead of "DEFAULT (65CH)"

### 3. Baseline Grid Enhancement

**Problem:** Grid only covered immediate container, disappearing when zoomed out.

**Solution:** Expanded SVG grid coverage:
```jsx
<svg
  style={{
    width: '200vw',
    height: '200vh',
    left: '-50vw',
    top: '-50vh'
  }}
>
```

**Impact:** Grid now extends beyond viewport, visible even when zoomed out to 25%.

---

## Files Modified

### Created
- `docs/SESSION-LOGS/2025-10-31-prose-system-cleanup.md`

### Modified
- `apps/web/src/routes/styleguide/Prose.jsx` - Complete rewrite, consolidated all functionality
- `apps/web/src/components/prose/layouts/ArticleLayout.jsx` - Fixed Pill usage, removed ProseRenderer
- `apps/web/src/routes/Styleguide.jsx` - Removed ProseBaseline import and route
- `apps/web/src/data/styleguide/navigation.js` - Removed ProseBaseline from navigation

### Deleted
- `apps/web/src/routes/styleguide/ProseBaseline.jsx`
- `apps/web/src/components/styleguide/molecules/ProseExample.jsx`
- `apps/web/src/components/prose/core/ProseRenderer.jsx`
- `apps/web/src/components/prose/core/BaselineGrid.jsx`

---

## Design System Patterns Applied

### Tag Component Usage
```jsx
// INCORRECT - size prop doesn't exist
<Pill variant="inverse" size="sm">{tag}</Pill>

// CORRECT - only variant, children, className
<Pill variant="subtle">{tag}</Pill>
```

### Typography Classes
```jsx
// System uses design token opacity scale: 02, 04, 08, 16, 32, 64, 80, 100
<p className="kol-mono-xs text-fg-64">Label text</p>
```

### Button vs Tag for Controls
- **Button:** Primary actions, CTAs
- **Tag:** Filters, view options, toggleable controls (chosen for prose variant controls)

---

## Technical Decisions

### Why Tag Over Button?
- Tags are less visually prominent (subtle, non-intrusive)
- Better suited for toggleable view options
- `tag-control` class already supports `.is-active` state
- Matches usage patterns seen in similar UI controls

### Why Inline SVG Grid?
- Eliminates component file for single-use element
- All grid configuration visible in one place
- No props to track across files
- Easier to modify grid size/opacity

### Why Expanded Grid Coverage?
- Original grid disappeared when user zoomed out
- 200vw × 200vh with -50vw/-50vh offset ensures coverage
- Pattern repeats seamlessly regardless of zoom level

---

## Lessons Learned

1. **Simplicity over abstraction** - 5 layers of components for className application is excessive
2. **Co-locate related code** - Baseline grid configuration should be with prose controls
3. **Follow component APIs** - Check prop definitions before usage (Tag size issue)
4. **Design system compliance** - Use proper classes, not generic utilities

---

## Next Steps

- Consider if other styleguide sections have similar over-engineering
- Document Tag vs Button usage patterns in design system docs
- Add prop validation warnings for incorrect component usage

---

## Stats

- **Files deleted:** 4
- **Lines removed:** 329
- **Code reduction:** 72%
- **Abstraction layers eliminated:** 5 → 0
- **Components fixed:** 2 (Prose.jsx, ArticleLayout.jsx)
