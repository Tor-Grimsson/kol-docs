import { normalizeBlocks } from '../utils/wikiSchema.js'

const withNormalizedPages = (databases) =>
  databases.map((database) => ({
    ...database,
    pages: database.pages
      ? database.pages.map((page) => ({
          ...page,
          blocks: normalizeBlocks(page.blocks || [])
        }))
      : []
  }))

const databaseContent = [
  {
    id: 'media-archive',
    name: 'Media Archive',
    type: 'photos',
    status: 'Active',
    owner: 'Nila',
    updated: 'Mar 24, 2025',
    entries: 1842,
    description: 'Backblaze-powered asset system feeding Docs, Studio, and the wiki previews.',
    tags: ['assets', 'photos', 'b2'],
    views: [
      { id: 'grid', label: 'Grid', description: 'Mosaic browser for quick art direction checks.' },
      { id: 'table', label: 'Table', description: 'Sortable metadata view synced with search.' },
      { id: 'timeline', label: 'Timeline', description: 'Chronological dump of uploads per sprint.' }
    ],
    tasks: [
      { id: 'archive-sync', label: 'Wire B2 CLI sync job', owner: 'Ops', due: 'Mar 26' },
      { id: 'metadata-pass', label: 'Normalize EXIF to camelCase', owner: 'Docs', due: 'Mar 28' }
    ],
    timeline: [
      { id: 'ingest', date: 'Mar 18', detail: 'First Backblaze ingest (1,842 files)' },
      { id: 'preview', date: 'Mar 20', detail: 'Wiki media page wired to mock gallery' }
    ],
    pages: [
      {
        id: 'ingestion-recipe',
        title: 'Ingestion recipe',
        subtitle: 'How we collect, tag, and sync captures before sending them upstream.',
        meta: [
          { label: 'Owner', value: 'Nila' },
          { label: 'Last updated', value: 'Mar 22, 2025' }
        ],
        heroBadges: ['Media', 'Ops'],
        blocks: [
          {
            type: 'heading',
            content: { text: 'Prep the source folder', level: 2 }
          },
          {
            type: 'paragraph',
            content: { text: 'Drop finished exports into `/Volumes/wiki-media/originals`. Use `YYYY-MM-DD-client-keyword.ext` so the CLI sync keeps chronological order.' }
          },
          {
            type: 'list',
            content: {
              items: [
                'Flatten Photoshop groups before export.',
                'Ensure width ≥ 1600px for hero art.',
                'Add a short `notes.md` if context will matter later.'
              ]
            }
          },
          {
            type: 'heading',
            content: { text: 'Backblaze sync', level: 2 }
          },
          {
            type: 'code',
            content: {
              code: `b2 sync --compareVersions size --delete /Volumes/wiki-media/originals \\
  b2://kol-wiki-media/originals`
            }
          },
          {
            type: 'callout',
            content: {
              tone: 'accent',
              title: 'Verify metadata',
              text: 'Run `scripts/inspect-exif.js` to capture camera + lens tags before announcing new batches.'
            }
          }
        ]
      },
      {
        id: 'naming-standard',
        title: 'Naming standard',
        subtitle: 'Filenames, folders, and tag rules for Media Archive rows.',
        meta: [
          { label: 'Owner', value: 'Ops' },
          { label: 'Last updated', value: 'Mar 19, 2025' }
        ],
        heroBadges: ['Standards'],
        blocks: [
          {
            type: 'paragraph',
            content: { text: 'Names start with date + client + short descriptor. Avoid spaces; use dashes. Keep suffix descriptors (hero, detail, alt) consistent.' }
          },
          {
            type: 'list',
            content: {
              items: [
                '`2025-03-18-kolkrabbi-wiki-hero-01.jpg`',
                '`2025-03-18-kolkrabbi-wiki-detail-01.png`'
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: 'token-docs',
    name: 'Token Docs',
    type: 'yaml',
    status: 'Review',
    owner: 'Vik',
    updated: 'Mar 23, 2025',
    entries: 86,
    description: 'Source of truth for color + typography tokens mirrored to @kol/ui.',
    tags: ['design system', 'yaml'],
    views: [
      { id: 'schema', label: 'Schema', description: 'Shows token group, semantic mapping, deprecations.' },
      { id: 'diff', label: 'Diff', description: 'Highlights recent changes for dev signoff.' }
    ],
    tasks: [
      { id: 'token-audit', label: 'Remove deprecated component tokens', owner: 'Design', due: 'Mar 29' }
    ],
    timeline: [
      { id: 'audit', date: 'Mar 15', detail: 'Migrated typography weights to YAML spec' }
    ],
    pages: [
      {
        id: 'color-contract',
        title: 'Color contract',
        subtitle: 'Mapping between tokens and docs demos.',
        meta: [
          { label: 'Owner', value: 'Vik' },
          { label: 'Last updated', value: 'Mar 21, 2025' }
        ],
        heroBadges: ['Tokens'],
        blocks: [
          {
            type: 'paragraph',
            content: { text: 'Each semantic pair includes foreground + background. When referencing tokens in prose, include both so consumers know which combination to import.' }
          },
          {
            type: 'list',
            content: {
              items: [
                '`--kol-surface-primary` + `--kol-surface-on-primary`',
                '`--kol-status-danger` + `--kol-status-danger-foreground`'
              ]
            }
          }
        ]
      }
    ]
  },
  {
    id: 'playbook-pages',
    name: 'Playbook Pages',
    type: 'pages',
    status: 'Active',
    owner: 'Kai',
    updated: 'Mar 22, 2025',
    entries: 42,
    description: 'Loose collection of operational notes waiting to be promoted into docs.',
    tags: ['ops', 'playbook'],
    views: [
      { id: 'kanban', label: 'Kanban', description: 'Status lanes for publishing readiness.' },
      { id: 'reading', label: 'Reading list', description: 'Quick links to most-referenced playbooks.' }
    ],
    tasks: [
      { id: 'ops-sweep', label: 'Archive outdated rituals', owner: 'Ops', due: 'Mar 25' }
    ],
    timeline: [
      { id: 'import', date: 'Mar 17', detail: 'Imported legacy Notion notes' }
    ],
    pages: [
      {
        id: 'handoff-loop',
        title: 'Handoff loop',
        subtitle: 'Checklist we run before every long weekend or release freeze.',
        meta: [
          { label: 'Owner', value: 'Kai' },
          { label: 'Last updated', value: 'Mar 17, 2025' }
        ],
        heroBadges: ['Ops'],
        blocks: [
          {
            type: 'paragraph',
            content: { text: 'Shared doc, Slack recap, and Sanity log update happen back-to-back. Nobody leaves without writing the state down.' }
          },
          {
            type: 'list',
            content: {
              items: [
                'Update `docs/AGENT-CONTEXT.md` with status + next steps.',
                'File blocking issues in Linear and tag `docs`.',
                'Paste mini summary into #kol-studio.'
              ]
            }
          },
          {
            type: 'callout',
            content: {
              tone: 'info',
              title: 'Reminder',
              text: 'If handoff touches customers, record it in the public changelog too.'
            }
          }
        ]
      }
    ]
  }
]

export const databases = withNormalizedPages(databaseContent)

export const getDatabases = () => databases

export const getDatabase = (id) => databases.find((database) => database.id === id)

export const getDatabasePage = (databaseId, pageId) => {
  const database = getDatabase(databaseId)
  if (!database) return null
  return database.pages.find((page) => page.id === pageId) || null
}
