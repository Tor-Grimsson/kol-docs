# Session Log: Stack Sidebar + Sources polish

**Date:** 2025-11-16  
**Status:** ✅ Completed

---

## Summary
- Documented the latest Stack behaviors in `docs/documentation/4.0.33-stack-general-settings.md`, covering the overlapping research TOC stack and the reworked sources layout.
- Updated `packages/ui/css/prose.css` + `packages/ui/src/molecules/SourcesSection.jsx` to tighten spacing (1px divider, pt-4/mt-8 equivalents, 20×24 card padding) and ensure `.kol-prose` wrapping doesn’t introduce surprise gaps.
- Adjusted `apps/web/src/routes/StackArticle.jsx` so the sources block uses positive margins (no negative offsets) and the TOC overlap now only affects past sections with proper z-ordering and dimmed text.

## Files Touched
- `docs/documentation/4.0.33-stack-general-settings.md`
- `packages/ui/css/prose.css`
- `packages/ui/src/molecules/SourcesSection.jsx`
- `apps/web/src/routes/StackArticle.jsx`

## Next Steps
1. Verify the dense sources variant elsewhere (if other routes consume it) to ensure the tightened spacing is acceptable globally.
2. Consider adding automated visual tests or Storybook examples for StickyNavCard stacks so overlapping logic is easier to validate.
3. Begin capturing Stack page screenshots for documentation (e.g., hero, TOC state) now that layout rules are stable.
