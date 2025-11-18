# @kol/content

Shared Sanity schemas and content types for kolkrabbi.io monorepo.

## Schemas

### Production Dataset (`author`, `post`)
Used by `cms-1` for blog/article content.

- `author` - Content authors with bio and image
- `post` - Blog posts with rich content

### Projects Dataset (`project`)
Used by `cms-2` for portfolio/case study content.

- `project` - Portfolio projects with galleries, metadata, SEO

## Usage

```typescript
import { authorType, postType, projectType, allSchemas } from '@kol/content'

// In Sanity config
export default defineConfig({
  schema: {
    types: allSchemas, // or select specific schemas
  },
})
```

## Studio Mapping

- **cms-1** (production): Uses `author` + `post` schemas
- **cms-2** (projects): Uses `project` schema
