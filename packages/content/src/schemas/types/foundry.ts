import { defineType, defineField } from 'sanity'

export const foundry = defineType({
  name: 'foundry',
  title: 'Foundry',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'fonts', type: 'array', of: [{ type: 'reference', to: [{ type: 'fontFamily' }] }] })
  ]
})
