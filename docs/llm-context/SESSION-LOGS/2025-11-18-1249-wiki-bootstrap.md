## Session: 2025-11-18 12:49 — Wiki Bootstrap & Authoring Tools

### Context
- Kicked off a new Vite React wiki app (`apps/wiki`) inside the Yarn 4 workspace.
- Goal: reproduce the documentation experience (layout + theme) and explore authoring flows.

### Work Completed
1. **Environment & Design System**
   - Initialized Yarn workspace + Vite React app.
   - Added Tailwind 4/PostCSS config, aliasing, and imported `@kol/ui` theme + docs CSS.
   - Registered `@kol/docs` workspace so shared docs components can be consumed by the app.
2. **Wiki Shell**
   - Built routing + layout (`DocsLayout`, nav/toc rails, mobile drawers), linked sample tabs, and seeded placeholder page data.
   - Wired `DocsHeader`, `DocsArticle`, `DocsCodeBlock`, `DocsToc`, etc., for consistency with the production docs.
3. **Authoring Utilities**
   - **Input Builder (`/input`)** — form that converts markdown + metadata into the structured wiki JSON object with copy-to-clipboard.
   - **Composer (`/new`)** — blank “wiki page” canvas with add/remove blocks (heading, paragraph, list, code, callout) and live preview.
4. **Housekeeping**
   - Added `_ref` to `.gitignore`, removed stale `@kol/ui` chess export, ensured Tailwind references compile, and verified `yarn workspace wiki build` succeeds.

### Decisions / Notes
- Composer currently uses simple block controls; planned upgrade is to replace with a richer editor (e.g., TOAST UI or TipTap) to mimic Notion/Linear feel.
- Fonts referenced in `@kol/ui/theme.css` still warn at build time; assets need to live in `apps/wiki/public/fonts`.
- Markdown files already live under `apps/wiki/src/data/documentation/` and can be wired into routes once ingestion strategy is settled.

### Next Steps
1. Integrate a real editor experience for `/new` (TOAST UI or TipTap) with design-system styling.
2. Hook the actual markdown docs into the wiki routes (or via content layer) so browsing surfaces live content.
3. Drop the font assets into `public/fonts` and update any URLs if necessary to eliminate build warnings.
