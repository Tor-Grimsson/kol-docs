# 2025-11-07 – Chess Controls Alt Mock + Icon Cleanup

## Summary
- Matched the “Controls Panel” card to the provided design reference by reworking layout, padding, and iconography in `apps/web/src/routes/styleguide/ChessComponents.jsx`.
- Introduced an `AlternativeControlsMock` stack that mirrors the screenshot: Setup header now shows paired `foundation` icons, palette rows are 80×80, status pills use shared `bg-opacity-hex-04`, capture summaries sit directly above the notation block, and bingo/notation/playback share a single column layout.
- Playback controls now use the actual `play-*` icons with dynamic play/pause toggling; all micro “{}” placeholders were swapped for icons to keep the mock consistent.
- Updated the migration doc (`docs/documentation/8.4.0-chess-components-ui-changes.md`) to capture these UI refinements for future reference.

## Files Touched
- `apps/web/src/routes/styleguide/ChessComponents.jsx`
- `packages/ui/src/atoms/icons/svg/play-*.svg`
- `docs/documentation/8.4.0-chess-components-ui-changes.md`
+ `apps/web/src/components/styleguide/chess/context/ChessControlsContext.jsx`
+ `apps/web/src/components/styleguide/chess/apparatus/ChessBoardWithSidebar.jsx`
+ `apps/web/src/components/styleguide/chess/apparatus/NotationPanel.jsx`

## Next Steps
1. Decide whether any of the mock-only styling should migrate into the production ChessSidebar component.
2. Hook the play/pause toggle into the real playback handlers if we want parity between the mock and live sidebar.

---

## Phase One Implementation (Later Same Day)

- **Shared Controls State:** Added `ChessControlsProvider` + `useChessControls` hook and refactored `ChessBoardWithSidebar` to consume it. Provider now owns PGN snapshots, playback state, loader flag, search filtering, and orientation toggles.
- **Shared Controls State:** Added `ChessControlsProvider` + `useChessControls` hook and refactored `ChessBoardWithSidebar` to consume it. Provider now owns PGN snapshots, playback state, loader flag, search filtering, orientation toggles, and a parsed `moveTree` produced by a custom `parsePgnTree` helper.
- **Notation MVP:** Built `NotationPanel` with click-to-jump support; Alternative Controls mock now renders real SAN pairs from the provider instead of static text.
- **Controls Panel Sync:** Wrapped the Controls Panel card in the new provider so the live ChessSidebar preview and the stylized mock share games/search state. Added flip + empty buttons, live search input, and context-driven playback icons.
- **Docs Updated:** Migration doc captures the new architecture, competitive references, and implementation details.

---

## Phase Two Implementation Log

- Built `VariationTree` (scrollable/expandable) hooked to `moveTree`; clicking SAN updates the board and notation.
- Added toolbar buttons (flip, clear, new variation stub, copy PGN, edit-mode toggle) wired into provider actions so the mock reflects intended behaviors.
- Provider now exposes `isEditMode/toggleEditMode`; palette tiles highlight the selected piece whenever edit mode is active.
- Added `trending.svg` to `packages/ui` to satisfy icon usage in the styleguide.
- Updated `docs/documentation/8.4.0-chess-components-ui-changes.md` with Phase Two progress notes.

**Next Phase Considerations**
- Wire variation UI to real data (PGN parser with variations)
- Enable empty-board editing (palette drag/drop)
- Finalize toolbar iconography (flip, clear, import/export)
- User variations are now stored in the provider (`addUserVariation/removeUserVariation/getPgnWithUserVariations`), the VariationTree renders them, and the toolbar’s “New variation” button prompts for SAN input and persists it.
- Moved the connected Alternative Controls mock onto `styleguide/chess/analysis` so it's the single-view demo (board + controls). ChessComponents now only keeps the legacy references.
