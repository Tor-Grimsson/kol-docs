import { defineType, defineField } from 'sanity'

export const blog = defineType({
  name: 'blog',
  title: 'Blog Post',
  type: 'document',
  groups: [
    { name: 'meta', title: 'Meta' },
    { name: 'content', title: 'Content' },
    { name: 'media', title: 'Media' }
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'meta'
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'meta',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      group: 'meta',
      description: 'Short summary for preview/SEO',
      validation: (Rule) => Rule.max(300)
    }),
    defineField({
      name: 'type',
      title: 'Article Type',
      type: 'string',
      group: 'meta',
      description: 'Choose between research (two-column) and standard (single-column) layouts',
      initialValue: 'research',
      options: {
        layout: 'radio',
        list: [
          { title: 'Research Article (two-column)', value: 'research' },
          { title: 'Standard Blog Post (single column)', value: 'standard' }
        ]
      }
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'meta'
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      group: 'meta',
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
      group: 'meta',
      initialValue: false
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true
      },
      description: 'Main cover image for the article detail page'
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true
      },
      description: 'Thumbnail for article cards and previews'
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
            { title: 'Caption', value: 'caption' }
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' }
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url'
                  }
                ]
              }
            ]
          }
        },
        {
          type: 'image',
          title: 'Image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              description: 'Important for SEO and accessibility'
            },
            {
              name: 'label',
              type: 'string',
              title: 'Label',
              description: 'Optional label displayed above (e.g. "Figure 1" or "Example")'
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption displayed below the image'
            }
          ]
        },
        {
          type: 'code',
          title: 'Code Block',
          options: {
            language: 'javascript',
            languageAlternatives: [
              { title: 'JavaScript', value: 'javascript' },
              { title: 'TypeScript', value: 'typescript' },
              { title: 'JSX', value: 'jsx' },
              { title: 'TSX', value: 'tsx' },
              { title: 'CSS', value: 'css' },
              { title: 'HTML', value: 'html' },
              { title: 'JSON', value: 'json' },
              { title: 'Bash', value: 'bash' },
              { title: 'Shell', value: 'sh' },
              { title: 'Python', value: 'python' },
              { title: 'SQL', value: 'sql' },
              { title: 'Markdown', value: 'markdown' },
              { title: 'Plain Text', value: 'text' }
            ],
            withFilename: true
          }
        },
        {
          type: 'dividerBlock',
          title: 'Divider'
        }
      ]
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'meta',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags'
      }
    }),
    defineField({
      name: 'relatedProjects',
      title: 'Related Projects',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'reference',
          to: [{ type: 'project' }]
        }
      ]
    }),
    defineField({
      name: 'sources',
      title: 'Sources & References',
      type: 'array',
      group: 'content',
      description: 'Optional sources and references for this article',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              type: 'string',
              title: 'Title',
              validation: (Rule) => Rule.required()
            },
            {
              name: 'url',
              type: 'url',
              title: 'URL',
              validation: (Rule) => Rule.required()
            },
            {
              name: 'meta',
              type: 'string',
              title: 'Meta',
              description: 'Author or source info (e.g., "MDN Web Docs")'
            }
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'meta'
            }
          }
        }
      ]
    }),
    defineField({
      name: 'toc',
      title: 'Manual Table of Contents',
      type: 'array',
      group: 'content',
      description: 'Override the auto-generated TOC by specifying cards manually.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Card Title',
              type: 'string',
              validation: (Rule) => Rule.required()
            }),
            defineField({
              name: 'targetId',
              title: 'Target ID',
              type: 'slug',
              description: 'Matches the id of the heading you want to scroll to (auto-generates from title).',
              options: {
                source: (doc, { parent }) => parent?.title,
                slugify: (input) =>
                  input
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-+|-+$/g, '')
              }
            }),
            defineField({
              name: 'summary',
              title: 'Summary',
              type: 'text'
            }),
            defineField({
              name: 'bullets',
              title: 'Bullets',
              type: 'array',
              of: [{ type: 'string' }]
            })
          ],
          preview: {
            select: {
              title: 'title',
              targetIdCurrent: 'targetId.current'
            },
            prepare({ title, targetIdCurrent }) {
              return {
                title,
                subtitle: targetIdCurrent || 'no target id'
              }
            }
          }
        }
      ]
    })
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author',
      media: 'coverImage',
      publishedAt: 'publishedAt'
    },
    prepare(selection) {
      const { author, publishedAt } = selection
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : ''
      return {
        ...selection,
        subtitle: author ? `${author} • ${date}` : date
      }
    }
  },
  orderings: [
    {
      title: 'Published Date, New',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }]
    },
    {
      title: 'Published Date, Old',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }]
    }
  ]
})
