import { defineType, defineField } from 'sanity'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'modules', type: 'array', of: [
      { type: 'hero' }, { type: 'richText' }, { type: 'galleryGrid' }, { type: 'specimenEmbed' }
    ]})
  ]
})
