const pageContent = {
  'theme-system': {
    slug: 'theme-system',
    title: 'Theme System',
    subtitle: 'Tokens, palettes, and responsive layers shared across every Kolkrabbi surface.',
    summary: 'A field guide to the `@kol/ui` theme contract so the wiki can feel identical to production surfaces.',
    meta: [
      { label: 'Last updated', value: 'Mar 12, 2025' },
      { label: 'Reading time', value: '8 min' }
    ],
    heroBadges: ['Design System'],
    toc: [
      { id: 'layering-model', label: 'Layering model', level: 2 },
      { id: 'semantic-pairs', label: 'Semantic pairs', level: 3 },
      { id: 'state-utilities', label: 'State utilities', level: 3 },
      { id: 'implementation-notes', label: 'Implementation notes', level: 2 }
    ],
    sections: [
      {
        id: 'layering-model',
        title: 'Layering model',
        summary: 'Surface → container → accent tokens are declared inside `theme.css` using the Tailwind v4 `@theme` block.',
        content: [
          {
            type: 'paragraph',
            text: 'Every layout in the wiki should inherit the same layering model as the marketing site. Tokens are grouped by responsibility: surfaces shape the global canvas, containers focus components, and accents call attention to actions.'
          },
          {
            type: 'list',
            items: [
              'Surfaces define background/foreground pairs such as `--kol-surface-primary` and `--kol-surface-on-primary`.',
              'Containers mirror the same pairing but are used for tiles, cards, or drawers.',
              'Accents and status colors expose both the base and muted variants to keep gradients consistent.'
            ]
          },
          {
            type: 'callout',
            tone: 'accent',
            title: 'Use CSS variables first',
            text: 'Treat Tailwind utilities as helpers. When building wiki primitives prefer CSS variables from `theme.css` so styles stay aligned when tokens shift.'
          }
        ],
        subsections: [
          {
            id: 'semantic-pairs',
            title: 'Semantic pairs',
            content: [
              {
                type: 'paragraph',
                text: 'Every token ships as a semantic pair. When referencing colors in prose or components, always reference both the base and its companion `--on-*` token.'
              },
              {
                type: 'code',
                code: `:root {
  color: var(--kol-surface-on-primary);
  background: var(--kol-surface-primary);
}
.wiki-article-section {
  border: 1px solid var(--kol-border-subtle);
  background: var(--kol-surface-tertiary);
}`
              }
            ]
          },
          {
            id: 'state-utilities',
            title: 'State utilities',
            content: [
              {
                type: 'paragraph',
                text: 'Use the predefined opacity ramp for hover/active effects. For example `text-fg-48` or `bg-fg-08` utilities reference calculated opacity values so AA contrast holds.'
              }
            ]
          }
        ]
      },
      {
        id: 'implementation-notes',
        title: 'Implementation notes',
        summary: 'Guidelines for bootstrapping Vite + Tailwind 4 with the design system package.',
        content: [
          {
            type: 'list',
            items: [
              'Import `@kol/ui/theme.css` before local CSS so base tokens register.',
              'Include `@kol/ui/css/docs.css` for the documentation-specific primitives.',
              'Call `applyTheme(getInitialTheme())` on boot to sync system preference.'
            ]
          },
          {
            type: 'callout',
            title: 'Tailwind 4 tip',
            text: 'When you need custom utilities add them via local CSS `@layer` blocks instead of editing the shared design system.'
          }
        ]
      }
    ]
  },
  'docs-layout': {
    slug: 'docs-layout',
    title: 'Documentation Layout',
    subtitle: 'Re-using DocsLayout components for wiki navigation, rails, and article scaffolding.',
    summary: 'Every wiki page uses the shared layout primitives so browsing feels like the production documentation.',
    meta: [
      { label: 'Last updated', value: 'Mar 18, 2025' },
      { label: 'Reading time', value: '6 min' }
    ],
    heroBadges: ['Docs UI'],
    toc: [
      { id: 'columns', label: 'Columns & grid', level: 2 },
      { id: 'navigation', label: 'Navigation rails', level: 2 },
      { id: 'responsive', label: 'Responsive behavior', level: 2 }
    ],
    sections: [
      {
        id: 'columns',
        title: 'Columns & grid',
        summary: 'DocsLayout exposes nav, content, and toc columns with built-in padding and gaps.',
        content: [
          {
            type: 'paragraph',
            text: 'Wrap content with `DocsLayout` and drop `DocsNavColumn`, `DocsMainColumn`, and `DocsTocColumn` as children. The grid scales from a two-column stack on mobile to a three-column desktop view.'
          },
          {
            type: 'list',
            items: [
              'Use `max-w-[1400px] mx-auto` containers so the layout mirrors production.',
              'Stick nav + toc columns using standard `top-[96px]` offsets.',
              'Allow the main column to handle article routing via `<Outlet />` from React Router.'
            ]
          }
        ],
        subsections: [
          {
            id: 'navigation',
            title: 'Navigation rails',
            content: [
              {
                type: 'paragraph',
                text: 'Pair the layout with `DocsRailDrawer` to expose the navigation tree on mobile. The drawer already handles focus trapping and backdrop interactions.'
              }
            ]
          },
          {
            id: 'responsive',
            title: 'Responsive behavior',
            content: [
              {
                type: 'paragraph',
                text: 'On small screens show a compact toolbar with “Browse” and “Outline” buttons. They toggle the same rail components so there is no second implementation.'
              }
            ]
          }
        ]
      }
    ]
  },
  'collaboration-guide': {
    slug: 'collaboration-guide',
    title: 'Collaboration Guide',
    subtitle: 'Working agreements for maintaining the wiki alongside product work.',
    summary: 'Spell out ownership, triage cadence, and review rituals so the wiki stays trustworthy.',
    meta: [
      { label: 'Last updated', value: 'Mar 4, 2025' },
      { label: 'Reading time', value: '5 min' }
    ],
    heroBadges: ['Ops'],
    toc: [
      { id: 'cadence', label: 'Weekly cadence', level: 2 },
      { id: 'triage', label: 'Triage workflow', level: 2 },
      { id: 'templates', label: 'Templates & snippets', level: 2 }
    ],
    sections: [
      {
        id: 'cadence',
        title: 'Weekly cadence',
        summary: 'A lightweight rhythm keeps the wiki evolving without derailing product work.',
        content: [
          {
            type: 'paragraph',
            text: 'Block 30 minutes after design critique to capture deltas. Rotate the note-taker weekly so context spreads.'
          },
          {
            type: 'list',
            items: [
              'Monday — capture release highlights from the changelog.',
              'Wednesday — document any new tokens or patterns introduced.',
              'Friday — archive stale experiments into the `Labs` section.'
            ]
          }
        ]
      },
      {
        id: 'triage',
        title: 'Triage workflow',
        content: [
          {
            type: 'paragraph',
            text: 'Use Linear to capture wiki issues. Tag them with `docs` + `wiki` and link back to the relevant route.'
          },
          {
            type: 'callout',
            tone: 'warning',
            title: 'Immutable pages',
            text: 'Foundational docs (Theme System, Layout spec) require design system approval before merging updates.'
          }
        ]
      },
      {
        id: 'templates',
        title: 'Templates & snippets',
        content: [
          {
            type: 'paragraph',
            text: 'Keep canonical snippets inside `/docs` so any app can render them. Each snippet should be a pure component without API coupling.'
          }
        ],
        subsections: [
          {
            id: 'template-code',
            title: 'Article template',
            content: [
              {
                type: 'code',
                code: `import { DocsHeader, DocsArticle } from '@docs'

export const Article = () => (
  <>
    <DocsHeader title="Title" subtitle="Context" />
    <DocsArticle>…</DocsArticle>
  </>
)`
              }
            ]
          }
        ]
      }
    ]
  }
}

const navigationConfig = [
  {
    id: 'foundations',
    label: 'Foundations',
    description: 'Tokens, surfaces, and layout primitives.',
    items: ['theme-system', 'docs-layout']
  },
  {
    id: 'operations',
    label: 'Operations',
    description: 'Rituals that keep the wiki alive.',
    items: ['collaboration-guide']
  }
]

export const wikiNavigation = navigationConfig.map((section) => ({
  ...section,
  pages: section.items
    .map((slug) => pageContent[slug])
    .filter(Boolean)
}))

export const wikiTabs = [
  { id: 'overview', label: 'Overview', path: '/' },
  { id: 'theme', label: 'Theme', path: '/page/theme-system' },
  { id: 'layout', label: 'Layout', path: '/page/docs-layout' },
  { id: 'ops', label: 'Ops', path: '/page/collaboration-guide' }
]

export const wikiPages = pageContent

export const getPage = (slug) => pageContent[slug]
