# Agent Onboarding - Wiki Project

## Quick Start
1. Read `LLM_RULES.md` for global rules
2. Read `AGENT-CONTEXT.md` for current project status
3. Check latest session log in `SESSION-LOGS/`

## Project Purpose
Build a simple, clean wiki/notes application for documenting ideas and plans. Think Notion-lite.

## Key Constraints
- Keep it simple - no over-engineering
- Clean, minimal codebase
- Easy to understand and modify
- Focus on content and usability

## Directory Guide
- `apps/wiki/` - Main application code
- `packages/ui/` - Minimal shared design system
- `llm-context/` - Agent context and session logs

## Development Commands
```bash
# Install dependencies
yarn install

# Run wiki dev server
yarn workspace wiki dev

# Build wiki
yarn workspace wiki build
```

## Design System
- Consolidated into `packages/ui/index.css`
- Light/dark theme support
- Basic components: Divider, Icon, ThemeToggleButton
- Simple, semantic color tokens

## Session Logging
- Log major milestones in `SESSION-LOGS/YYYY-MM-DD-HHMM.md`
- Update `AGENT-CONTEXT.md` after completing features
- Keep context files current and concise
