import { defineType, defineField } from 'sanity'

export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'subtitle', type: 'string' }),
    defineField({ name: 'ctaLabel', type: 'string' }),
    defineField({ name: 'ctaHref', type: 'string' })
  ]
})

export const richText = defineType({
  name: 'richText',
  title: 'Rich Text',
  type: 'object',
  fields: [defineField({ name: 'body', type: 'array', of: [{ type: 'block' }] })]
})

export const galleryGrid = defineType({
  name: 'galleryGrid',
  title: 'Gallery Grid',
  type: 'object',
  fields: [
    defineField({ name: 'images', type: 'array', of: [{ type: 'image', fields: [{ name: 'caption', type: 'string' }] }] })
  ]
})

export const specimenEmbed = defineType({
  name: 'specimenEmbed',
  title: 'Specimen Embed',
  type: 'object',
  fields: [
    defineField({ name: 'fontRef', type: 'reference', to: [{ type: 'fontFamily' }] }),
    defineField({ name: 'options', type: 'object', fields: [
      { name: 'showControls', type: 'boolean', initialValue: true },
      { name: 'showMetrics', type: 'boolean', initialValue: true }
    ] })
  ]
})
