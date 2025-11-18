import { defineType, defineField } from 'sanity'

export const font = defineType({
  name: 'font',
  title: 'Font',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string' }),
    defineField({ name: 'family', type: 'reference', to: [{ type: 'fontFamily' }] }),
    defineField({ name: 'variationAxes', type: 'array', of: [{ type: 'object', fields: [
      { name: 'tag', type: 'string' },
      { name: 'min', type: 'number' },
      { name: 'max', type: 'number' }
    ] }] })
  ]
})
