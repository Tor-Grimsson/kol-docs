# 2025-11-07 18:28 – Chess Analysis Sidebar Width + Legacy Controls Fix

## Summary
- Resolved the `ChessComponents.jsx` build break caused by an inline `return` by extracting the legacy sidebar preview into its own component with scoped state. Imported the new chess controls context so the file compiles again.
- Added a `board-playback--sidebar-360` modifier that drives a CSS custom property for chess board + sidebar layouts, letting us lock the Analysis view’s controls column to exactly 360 px while keeping other contexts unaffected.
- Wrapped the Analysis mock card in a 360 px container so both the live sidebar and the mock present identical widths, keeping parity between reference and production views.

## Files Touched
- `apps/web/src/routes/styleguide/ChessComponents.jsx`
- `apps/web/src/routes/styleguide/ChessAnalysis.jsx`
- `apps/web/src/components/styleguide/chess/chess.css`

## Next Steps
1. Wire the new sidebar width modifier into any other chess showcase routes that also need the fixed measurement.
2. Evaluate whether the legacy sidebar preview is still necessary once the shared provider is fully adopted; if not, archive it and trim the extra render.
3. Continue iterating on the Chess Controls provider (variation tree hooks, edit mode UX) per the integration plan.
