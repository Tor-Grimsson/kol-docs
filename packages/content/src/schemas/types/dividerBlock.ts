import {defineType} from 'sanity'

export const dividerBlock = defineType({
  name: 'dividerBlock',
  title: 'Divider',
  type: 'object',
  fields: [
    {
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: [
          {title: 'Default', value: 'default'}
        ],
        layout: 'radio'
      },
      initialValue: 'default'
    }
  ],
  preview: {
    prepare: () => ({
      title: 'Divider'
    })
  }
})
