import { defineType, defineField } from 'sanity'

export const fontFamily = defineType({
  name: 'fontFamily',
  title: 'Font Family',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' } }),
    defineField({ name: 'styles', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'foundry', type: 'reference', to: [{ type: 'foundry' }] })
  ]
})
