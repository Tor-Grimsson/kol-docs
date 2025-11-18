# Session Log: Documentation Layout Refactor

**Date:** 2025-11-12
**Session Focus:** Reworking documentation page layout structure, header behavior, and tab styling

## Overview

This session focused on completely restructuring the documentation pages to match modern documentation site patterns (Claude Docs, MiniMax docs) with a fixed header, independently scrolling sidebars, simplified tab styling, and consistent behavior across all documentation pages.

## Key Accomplishments

### 1. Fixed Max-Width Standardization
- **Issue:** Documentation was using inconsistent max-widths (1320px vs 1400px)
- **Resolution:** Standardized all documentation pages to use `max-w-[1400px]`
- **Files Updated:**
  - `DocsPageHeader.jsx`
  - `Documentations.jsx`
  - `DocumentationReader.jsx`
  - `docs.css` (comment)

**New Layout Spec:**
```
Container: max-w-[1400px]
Padding: px-10 (40px)
Gap: gap-8 (32px)

Columns:
├─ Nav:  w-64 (256px)
├─ Main: flex-1 (~760px)
└─ Toc:  w-60 (240px)

Math: 1400 - 80 (padding) - 256 - 240 - 64 (gaps) = 760px ✓
```

### 2. Fixed Header Implementation
- **Challenge:** Header should always be visible regardless of scroll position
- **Solution:** Created `DocsPageHeader` component with `sticky top-0 z-50`
- **File:** `apps/web/src/components/workshop/docs/DocsPageHeader.jsx` (NEW)

**Component Structure:**
```jsx
<div className="sticky top-0 z-50 flex-shrink-0 bg-surface-primary">
  {/* Logo + Docs + Toggle */}
  <div className="border-b border-fg-08">
    <div className="max-w-[1400px] mx-auto px-10 py-6">
      <Wordmark /> + <DocsLogo /> + <ThemeToggle />
    </div>
  </div>

  {/* Tabs */}
  <div className="w-full border-b border-fg-08">
    <div className="max-w-[1400px] mx-auto px-10">
      <tabs />
    </div>
  </div>
</div>
```

### 3. Simplified Tab Styling
- **Previous:** Pill-style tabs with borders, backgrounds, and rounded corners
- **New:** Clean text-based tabs with bottom border indicator (Claude Docs style)

**CSS Changes in `packages/ui/css/docs.css`:**

```css
/* Before */
.docs-tab {
  padding: 6px 20px;
  border: 1px solid ...;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background: color-mix(...);
}

/* After */
.docs-tab {
  font-size: 13px;
  font-weight: 500;
  color: color-mix(in srgb, var(--kol-surface-on-primary) 60%, transparent);
  padding-block: 8px;
  border-bottom: 2px solid transparent;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.docs-tab:hover {
  color: color-mix(in srgb, var(--kol-surface-on-primary) 90%, transparent);
}

.docs-tab.active,
.docs-tab:active {
  color: color-mix(in srgb, var(--kol-surface-on-primary) 100%, transparent);
  border-bottom-color: color-mix(in srgb, var(--kol-surface-on-primary) 100%, transparent);
}
```

### 4. Single-Row Tabs with Scroll
- **Issue:** Tabs were wrapping to multiple rows
- **Solution:** Changed `flex-wrap: wrap` to `flex-wrap: nowrap` with `overflow-x: auto`

```css
.docs-tabrow-items {
  display: flex;
  flex-wrap: nowrap;
  gap: 24px;
  overflow-x: auto;
  padding-block: 12px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.docs-tab {
  white-space: nowrap;
  flex-shrink: 0;
}
```

### 5. Smart Tab Name Shortening
- **Problem:** Tab names were too long (e.g., "Foundry Navigation Structure Research")
- **Solution:** Enhanced `cleanDocTitle()` function to aggressively shorten names

**Algorithm:**
1. Remove version numbers (1.0.0, etc.)
2. Remove category prefixes (Foundry:, Chess:, etc.)
3. Strip filler words: Structure, Research, Log, Documentation, Overview, Guide, System, Maintenance
4. Take only the last 2 meaningful words

**Examples:**
- "Foundry Navigation Structure Research" → "Navigation"
- "Chess Controls Maintenance Log" → "Chess Controls"
- "Typography System Overview" → "Typography"
- "3.2.0 Design System: Molecules Overview" → "Molecules"

### 6. Shared Tab Builder Utility
- **Issue:** Tabs disappeared on individual doc pages because DocumentationReader used empty array
- **Root Cause:** Tab generation logic was duplicated in Documentations.jsx only
- **Solution:** Created shared utility function

**File:** `apps/web/src/utils/docsTabBuilder.js` (NEW)

```javascript
export const buildDocHighlightTabs = (limit = MAX_HIGHLIGHT_TAGS) => {
  const docs = documentationInventory
  const docCounts = documentationCounts

  // Sort by recency
  // Add top categories
  // Generate shortened labels

  return highlights.map((doc) => ({
    id: doc.id,
    label: cleanDocTitle(doc.title, doc.id),
    path: `/workshop/design-system/documentation/${doc.id}`
  }))
}
```

**Usage in both components:**
```jsx
const docTabs = useMemo(() => buildDocHighlightTabs(), [])
<DocsPageHeader tabs={docTabs} />
```

### 7. Independent Scroll Containers
- **Layout Pattern:** Fixed header, three scrollable columns
- **Implementation:** Each column has `overflow-y-auto`

```jsx
<div className="fixed inset-0 flex flex-col">
  <DocsPageHeader /> {/* sticky top-0 */}

  <div className="flex-1 overflow-hidden">
    <div className="max-w-[1400px] mx-auto px-10 h-full flex gap-8">
      <DocsNavColumn className="w-64 overflow-y-auto" />
      <DocsMainColumn className="flex-1 overflow-y-auto" />
      <DocsTocColumn className="w-60 overflow-y-auto" />
    </div>
  </div>
</div>
```

### 8. DocsLayout Component Simplification
- **Before:** Complex component with built-in widths, borders, overflow handling
- **After:** Minimal wrapper, all styling controlled via className props

**File:** `apps/web/src/components/workshop/docs/DocsLayout.jsx`

```jsx
// Before
export const DocsLayout = ({ children, className }) => (
  <div className={join('flex flex-1 overflow-hidden', className)}>
    {children}
  </div>
)

// After
export const DocsLayout = ({ children }) => <>{children}</>

// Columns now receive all styling via props
<DocsNavColumn className="w-64 overflow-y-auto text-auto">
```

### 9. CSS Cleanup
- **Action:** Commented out legacy grid-based layout classes in `docs.css`
- **Reason:** Layout now handled via Tailwind utilities for better flexibility
- **Preserved:** All typography classes (.docs-title, .docs-article, etc.)

**Comment Added:**
```css
/* =============================================================================
 * Documentation Layout Utilities
 * =============================================================================
 * Layout is now handled via Tailwind utility classes in
 * DocsLayout.jsx components for better flexibility and maintainability.
 *
 * Layout spec: max-w-[1400px], px-10 (40px), gap-8 (32px)
 * Columns: Nav 256px (w-64), Main flex-1 (~760px), Toc 240px (w-60)
 */
```

## Files Modified

### New Files
1. `apps/web/src/components/workshop/docs/DocsPageHeader.jsx`
   - Shared header component with logo, docs nav, theme toggle, and tabs
   - Sticky positioning for always-visible header

2. `apps/web/src/utils/docsTabBuilder.js`
   - Shared tab generation logic
   - Smart title shortening algorithm
   - Exports `buildDocHighlightTabs()` function

### Updated Files
1. `apps/web/src/routes/workshop/Documentations.jsx`
   - Replaced header markup with `<DocsPageHeader />`
   - Removed duplicate tab generation functions
   - Updated max-width to 1400px
   - Imported shared tab builder

2. `apps/web/src/routes/workshop/DocumentationReader.jsx`
   - Complete restructure with fixed layout pattern
   - Added `<DocsPageHeader />` with shared tabs
   - Updated max-width to 1400px
   - Updated column classes

3. `apps/web/src/components/workshop/docs/DocsLayout.jsx`
   - Simplified all column components
   - Removed hard-coded widths/overflow
   - All styling now controlled via className props

4. `apps/web/src/components/workshop/docs/index.js`
   - Added export for `DocsPageHeader`

5. `packages/ui/css/docs.css`
   - Simplified tab styling (removed borders, backgrounds, rounded corners)
   - Added single-row behavior with horizontal scroll
   - Commented out legacy layout classes
   - Updated documentation comment with new spec

## Technical Notes

### Header Behavior
- Uses `sticky top-0 z-50` to remain at top during scroll
- `bg-surface-primary` ensures proper background when scrolling
- Border extends full width, content constrained to 1400px

### Tab Scrolling
- Hidden scrollbar for clean appearance
- Tabs use `flex-shrink: 0` to prevent compression
- Horizontal overflow allows unlimited tabs without wrapping

### Performance
- `useMemo` used for tab generation to prevent recalculation
- Shared utility prevents code duplication
- Empty dependency array since tabs based on static data

### Accessibility
- Tab links preserve keyboard navigation
- Hover states provide visual feedback
- Active state shows current location

## Challenges and Solutions

### Challenge 1: Tabs Disappearing on Individual Pages
- **Problem:** DocumentationReader passed empty array to header
- **Root Cause:** Tab generation logic only in Documentations.jsx
- **Solution:** Created shared utility, both components use same function

### Challenge 2: Max-Width Confusion
- **Problem:** Spec said 1320px, user wanted 1400px
- **Root Cause:** Documentation file not updated
- **Solution:** Standardized to 1400px everywhere, updated all references

### Challenge 3: Tabs Wrapping to Multiple Rows
- **Problem:** Long tab names caused multi-row layout
- **Solution:** Two-pronged approach:
  1. Shorten tab names aggressively
  2. Add horizontal scroll for overflow

### Challenge 4: Header Not Staying Fixed
- **Problem:** Initial implementation used `flex-shrink-0` but not `sticky`
- **Root Cause:** Misunderstanding of user's "always there" requirement
- **Solution:** Added `sticky top-0 z-50` to header component

## Related Documentation

- [0.0.2 Documentation: Layout Spec](../documentation/0.0.2-documentation-layout-spec.md)
- [1.2.0 Documentation Layout Evolution](../documentation/1.2.0-documentation-layout-evolution.md)

## Future Considerations

### Potential Enhancements
- Active tab indicator (underline current page's tab)
- Tab overflow indicators (fade/arrows at scroll edges)
- Keyboard navigation between tabs (arrow keys)
- Mobile responsive tab behavior (collapse to dropdown?)

### Performance Optimization
- Consider virtualizing long sidebar lists
- Lazy load documentation content
- Optimize tab generation for large doc sets

## Session Duration

Approximately 3 hours of iterative development and refinement.
