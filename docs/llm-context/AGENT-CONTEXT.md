# Agent Context - Wiki Project

> **Last Updated**: 2025-11-22

## Project Overview
Simple wiki/notes application for documenting ideas, plans, and knowledge. Built with React 19, Vite 7, and Tailwind 4.

## Current Status
**Phase**: Active Development
**Goal**: Create a clean, simple documentation/notes app (Notion-like)

## Repository Structure
```
wiki/
├── apps/
│   └── wiki/              # Main wiki application
├── packages/
│   └── ui/                # Shared design system (minimal)
│       ├── index.css      # All styles consolidated
│       └── src/
│           ├── atoms-minimal/  # Basic components
│           └── hooks/          # useTheme
└── llm-context/          # LLM agent context files
```

## Active Focus
- Wiki application development
- Simple, clean structure
- Easy to add notes/documentation
- Notion/Linear-like experience

## Tech Stack
- **Framework**: React 19 + Vite 7
- **Styling**: Tailwind 4 + custom design tokens
- **Routing**: React Router 7
- **Theme**: Light/dark mode support

## Recent Changes (2025-11-22)
- ✅ Removed 336MB of bloat (_ref/, sidebar/)
- ✅ Consolidated CSS files (theme + components + utilities → index.css)
- ✅ Simplified package structure (removed unused packages)
- ✅ Cleaned up workspace (minimal @kol/ui package)
- ✅ Removed complex design system components (chess, analytics, etc.)

## Next Steps
1. Test wiki application builds
2. Enhance editor experience (consider TipTap or similar)
3. Improve documentation UX
4. Add database/collection features
