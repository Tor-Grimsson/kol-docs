import { defineType, defineField } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    { name: 'meta', title: 'Meta' },
    { name: 'content', title: 'Content' },
    { name: 'media', title: 'Media' },
    { name: 'settings', title: 'Settings' }
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().min(4),
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
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      group: 'meta',
      validation: (Rule) => Rule.max(300)
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 6,
      group: 'meta'
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
      group: 'meta'
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      group: 'meta',
      validation: (Rule) =>
        Rule.regex(/^[0-9]{4}$/).warning('Prefer a four digit year, e.g. 2024')
    }),
    defineField({
      name: 'timeframe',
      title: 'Timeframe',
      description: 'Example: Q3 2024 or "6 weeks".',
      type: 'string',
      group: 'meta'
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'meta',
      options: {
        layout: 'tags'
      }
    }),
    defineField({
      name: 'fonts',
      title: 'Fonts',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'fontFamily' }] }],
      group: 'content'
    }),
    defineField({
      name: 'content',
      title: 'Body Content',
      type: 'array',
      group: 'content',
      of: [{ type: 'block' }]
    }),
    defineField({
      name: 'thumbnail',
      title: 'Thumbnail Image',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (Rule) => Rule.required().error('Alt text improves accessibility.')
        })
      ],
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          validation: (Rule) => Rule.required().error('Alt text improves accessibility.')
        })
      ]
    }),
    defineField({
      name: 'svg',
      title: 'SVG Icon',
      type: 'file',
      group: 'media',
      description: 'Upload an SVG file for this project',
      options: {
        accept: '.svg'
      }
    }),
    defineField({
      name: 'images',
      title: 'Gallery Images',
      type: 'array',
      group: 'media',
      of: [
        defineField({
          type: 'image',
          name: 'galleryImage',
          options: {
            hotspot: true
          },
          fields: [
            defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
            defineField({ name: 'caption', title: 'Caption', type: 'string' })
          ]
        })
      ]
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      initialValue: false,
      group: 'settings'
    }),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      group: 'settings',
      description: 'Lower numbers surface first in listings.'
    }),
    defineField({
      name: 'published',
      title: 'Published',
      type: 'boolean',
      initialValue: true,
      group: 'settings'
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      group: 'settings',
      fields: [
        defineField({
          name: 'metaTitle',
          title: 'Meta title',
          type: 'string',
          validation: (Rule) => Rule.max(60)
        }),
        defineField({
          name: 'metaDescription',
          title: 'Meta description',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.max(160)
        })
      ]
    })
  ],
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }]
    },
    {
      title: 'Title (A → Z)',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }]
    }
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'client',
      media: 'thumbnail',
      featured: 'featured'
    },
    prepare({ title, subtitle, media, featured }: { title?: string; subtitle?: string; media?: unknown; featured?: boolean }) {
      return {
        title,
        subtitle: featured ? `${subtitle || '—'} • Featured` : subtitle,
        media
      }
    }
  }
})
