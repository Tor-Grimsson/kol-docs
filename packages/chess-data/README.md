# @kol/chess-data

Workspace package for the chess analytics program. It collects the raw CSV exports, normalises them into generated JSON modules, and exposes helpers for consumers inside the styleguide (and eventually production apps).

## Directory Layout

- `sources/` — raw monthly CSV drops. Keep filenames stable (e.g. `2025-01.csv`).
- `generated/` — build artefacts emitted by the ingestion script (`build.js`).
- `scripts/` — utilities for parsing and transforming the archive.
- `src/` — public helpers that import from `generated/` and provide ergonomics to UI layers.

## Getting Started

1. Place the raw CSV files inside `sources/`.
2. Implement `scripts/build.js` to parse the CSV archive and emit structured JSON into `generated/`.
3. Export typed helpers from `src/index.js` so routes can request datasets like `getMonthlyStats()` or `getOpeningBreakdown()`.

Until the build script is ready, `src/index.js` returns static placeholders so UI scaffolds can develop in parallel.
