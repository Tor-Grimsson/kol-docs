# Kolkrabbi Wiki Documentation

> **Status:** ✅ FUNCTIONAL - Wiki is live and working!
> **Server:** http://localhost:5177/
> **Last Updated:** 2025-11-22

---

## 🎯 Current Status

### ✅ WHAT'S WORKING

**The wiki is fully functional!** You can:

- **Browse** all 137 documentation files
- **Click** any page in navigation to view it
- **Search** for pages by title
- **Create** new pages by adding .md files
- **Edit** existing pages (just edit the .md file)
- **Navigate** with breadcrumbs and TOC

**Completed Features:**
- ✅ Markdown parser (137 files loaded)
- ✅ Auto-generated navigation from file numbering
- ✅ Full markdown rendering (headings, lists, code, tables, links, blockquotes)
- ✅ Frontmatter parsing (title, version, date, status)
- ✅ 3-column reference design layout
- ✅ Dark theme styling
- ✅ Copy buttons on code blocks
- ✅ Table of contents (right sidebar)
- ✅ Breadcrumb navigation
- ✅ Active page highlighting

### 🚧 WHAT'S LEFT

**Phase 2 - Enhancement:**
- ⏳ Syntax highlighting for code blocks (Prism.js)
- ⏳ Tree navigation with expand/collapse
- ⏳ Scroll spy for TOC active states
- ⏳ Mobile responsive drawer navigation

**Phase 3 - Advanced:**
- ❌ Full-text search across content (fuse.js)
- ❌ Cross-reference system from frontmatter
- ❌ Keyboard shortcuts (Cmd+K, arrows)
- ❌ Hot reload on markdown file changes
- ❌ Light/dark theme toggle

---

## Quick Start

### View the Wiki
```bash
yarn dev
# Open http://localhost:5177/
```

### Create a New Page

1. **Add a markdown file** to `src/data/documentation/`

2. **Name it** using M.m.p format:
   ```
   1.2.3-my-page-title.md
   │ │ │ └── slug (URL-friendly)
   │ │ └──── patch version
   │ └────── minor version
   └──────── major version (determines section)
   ```

3. **Add frontmatter** at the top:
   ```markdown
   ---
   title: My Page Title
   version: 1.0.0
   date: 2025-11-22
   status: active
   ---

   # My Page Title

   Your markdown content here...
   ```

4. **Save** → Refresh browser → Page appears in navigation!

---

## File Organization

### Section Categories (by major version)

| Version | Category | Purpose | Files |
|---------|----------|---------|-------|
| **0.x** | Meta | Documentation about documentation | 14 |
| **1.x** | Foundation | Repo structure, naming, build system | 6 |
| **2.x** | Design System | Colors, typography, CSS architecture | 13 |
| **3.x** | Components | Atoms, molecules, organisms, templates | 16 |
| **4.x** | Pages | Public pages, features, templates | 24 |
| **5.x** | Workshop | Experiments, prototypes, explorations | 28 |
| **6.x** | Research | Studies, investigations, analysis | 9 |
| **7.x** | Operations | Workflows, protocols, development | 8 |
| **8.x** | Decisions | Architecture decisions, rationale | 1 |
| **9.x** | Future | Roadmap, proposals, planning | 1 |

**Total:** 137 markdown files

### Naming Examples

```
✅ Good:
0.0.0-documentation-index.md
1.0.0-foundation-repository-structure.md
2.1.0-design-system-colors.md
3.2.5-component-button-variants.md

❌ Bad:
my-page.md                    (no version number)
1-foundation.md               (incomplete version)
1.0.0_my_page.md             (underscores, not hyphens)
```

---

## Architecture

### Key Components

**Layout:**
- `WikiLayout.jsx` - 3-column grid (nav, content, TOC)
- `DocsNavbar.jsx` - Top navigation bar
- `SidebarNav.jsx` - Left navigation tree

**Content:**
- `DocsArticle.jsx` - Content wrapper (max-width 65ch, spacing)
- `DocsHeader.jsx` - Heading system (H1-H6, auto-anchors)
- `DocsCodeBlock.jsx` - Code with copy button
- `DocsPageHeader.jsx` - Breadcrumbs + title
- `DocsToc.jsx` - Table of contents

**Utilities:**
- `markdownParser.js` - Parse markdown + extract headings
- `simpleFrontmatter.js` - YAML parser (browser-safe, no Node.js deps)
- `loadDocs.js` - Load all .md files, auto-generate navigation

### Data Flow

```
.md files (src/data/documentation/)
    ↓
loadDocs.js → scans files, generates navigation tree
    ↓
WikiLayout → renders 3-column layout
    ↓
WikiArticle → displays selected page
    ↓
markdownParser.js → converts markdown to HTML
    ↓
Browser renders content with prose styling
```

---

## Development

### Commands

```bash
# Start dev server
yarn dev

# Build for production
yarn build

# Install dependencies
yarn install
```

### Tech Stack

- **React 19** - UI framework
- **Vite 7** - Build tool (fast HMR)
- **React Router 7** - Client-side routing
- **marked** - Markdown parsing
- **Tailwind 4** - CSS utilities (custom config)
- **Custom design system** - 757 lines of CSS

### Project Structure

```
kolkrabbi-docs/
├── src/
│   ├── components/
│   │   ├── docs/              # Heavy lifter components (6)
│   │   ├── DocsNavbar.jsx
│   │   ├── WikiLayout.jsx
│   │   └── SidebarNav.jsx
│   ├── pages/
│   │   └── WikiArticle.jsx
│   ├── utils/
│   │   ├── markdownParser.js
│   │   ├── simpleFrontmatter.js
│   │   └── loadDocs.js
│   ├── data/
│   │   └── documentation/     # 📚 137 .md files
│   └── styles.css
├── docs/
│   └── documentation/
│       ├── 0.0.0-site-tree.md       # Status & architecture
│       ├── IMPLEMENTATION-PLAN.md   # Full roadmap
│       └── README.md                # This file
└── package.json
```

---

## Metrics

- **Files:** 137 markdown documents
- **Sections:** 10 categories (0.x through 9.x)
- **Components:** 11 React components
- **Build Time:** ~1.6 seconds
- **Bundle Size:** 1.9MB (includes all docs)
- **CSS:** 757 lines (single file)
- **Hot Reload:** Files watched, browser refresh needed

---

## Troubleshooting

**Page not showing in navigation?**
- Check filename format: `M.m.p-slug.md`
- Ensure file is in `src/data/documentation/`
- Refresh browser

**Markdown not rendering correctly?**
- Check frontmatter format (YAML between `---`)
- Ensure content starts after closing `---`
- Check browser console for errors

**Search not finding pages?**
- Currently only searches title and slug
- Full-text search coming in Phase 3

**Need to refresh after editing?**
- Hot reload for .md files is on TODO list
- For now: save file → refresh browser

---

## Documentation

- **📍 Current Status:** `0.0.0-site-tree.md` (comprehensive status report)
- **📋 Full Roadmap:** `IMPLEMENTATION-PLAN.md` (6 phases, 23 steps)
- **📝 Session Logs:** `../../llm-context/SESSION-LOGS/`

---

## Next Steps

### Immediate (Sprint 1)
1. Add syntax highlighting (Prism.js)
2. Implement tree navigation (collapsible sections)
3. Add scroll spy to TOC
4. Mobile drawer navigation

### Short Term (Sprint 2)
5. Full-text search with fuse.js
6. Cross-reference links from frontmatter
7. Keyboard shortcuts (Cmd+K search, arrow keys)
8. Hot reload for markdown changes

---

## Contributing

1. Add your .md file to `src/data/documentation/`
2. Follow the M.m.p naming convention
3. Include proper frontmatter (title, version, date)
4. Write in standard markdown
5. Save and refresh browser to test

No build step needed - files are auto-loaded on page load!

---

**Welcome to the Kolkrabbi Wiki!** 🎉

*For detailed implementation status and component architecture, see `0.0.0-site-tree.md`*
