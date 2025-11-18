import { defineType, defineField } from 'sanity'

export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({ name: 'label', type: 'string' }),
    defineField({ name: 'href', type: 'string' })
  ]
})
