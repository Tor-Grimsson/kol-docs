# Wiki - Simple Documentation & Notes App

A clean, minimal wiki application for documenting ideas, plans, and knowledge. Built with modern web technologies.

## Features

- 📝 **Rich Documentation**: Markdown-based content with structured blocks
- 🎨 **Clean Design**: Minimalist interface with light/dark theme support
- 🗂️ **Organized**: Pages, databases, and media library
- ✍️ **Authoring Tools**: Input builder and composer for creating content
- 🚀 **Modern Stack**: React 19, Vite 7, Tailwind 4

## Project Structure

```
wiki/
├── apps/
│   └── wiki/              # Main application
│       ├── src/
│       │   ├── components/   # Wiki components
│       │   ├── pages/        # Route pages
│       │   ├── data/         # Documentation data
│       │   └── utils/        # Utilities
│       └── public/           # Static assets
├── packages/
│   └── ui/                # Shared design system
│       ├── index.css         # Consolidated styles
│       └── src/              # Minimal components
└── llm-context/          # LLM agent context
```

## Getting Started

### Prerequisites
- Node.js 18+
- Yarn 4

### Installation

```bash
# Install dependencies
yarn install

# Run development server
yarn workspace wiki dev

# Build for production
yarn workspace wiki build
```

## Development

### Available Commands

```bash
# Development
yarn workspace wiki dev          # Start dev server
yarn workspace wiki build        # Build for production
yarn workspace wiki preview      # Preview production build
yarn workspace wiki lint         # Lint code
```

### Design System

The project uses a minimal design system (`@kol/ui`) with:
- **Consolidated CSS**: All styles in `index.css`
- **Color Tokens**: Semantic, theme-aware colors
- **Typography**: Responsive heading and body text classes
- **Components**: Minimal set (Divider, Icon, ThemeToggleButton)
- **Theme**: Light/dark mode with localStorage persistence

## Pages

- `/` - Home/Wiki index
- `/page/:slug` - Individual wiki pages
- `/input` - Input builder (markdown → JSON)
- `/new` - Composer (visual block editor)
- `/media` - Media library
- `/databases` - Database collection views

## Tech Stack

- **Framework**: React 19
- **Build**: Vite 7
- **Styling**: Tailwind 4
- **Routing**: React Router 7
- **Package Manager**: Yarn 4 (PnP)

## Philosophy

This project prioritizes simplicity and clarity:
- ✅ **Minimal dependencies** - Only what's needed
- ✅ **Clean code** - Easy to understand and modify
- ✅ **Consolidated** - One CSS file, clear structure
- ✅ **Documented** - Clear purpose and context

## Contributing

1. Read `llm-context/AGENT-ONBOARDING.md` for development guidelines
2. Check `llm-context/AGENT-CONTEXT.md` for current status
3. Review `LLM_RULES.md` for coding standards

## License

Private project - Not for public distribution
