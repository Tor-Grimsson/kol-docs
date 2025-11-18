import { type SchemaTypeDefinition } from 'sanity'
import { project } from './types/project'
import { blog } from './types/blog'
import { author } from './types/author'
import { fontFamily } from './types/fontFamily'
import { font } from './types/font'
import { page } from './types/page'
import { foundry } from './types/foundry'
import { navigation } from './types/navigation'
import { siteSettings } from './types/siteSettings'
import { hero, richText, galleryGrid, specimenEmbed } from './types/modules'
import { dividerBlock } from './types/dividerBlock'

export const schemaTypes: SchemaTypeDefinition[] = [
  project, blog, author, fontFamily, font, foundry, page, navigation, siteSettings,
  hero, richText, galleryGrid, specimenEmbed, dividerBlock
]

export { project } from './types/project'
export { blog } from './types/blog'
export { author } from './types/author'
