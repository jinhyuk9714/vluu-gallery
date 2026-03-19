# Editorial Workflow

1. Create a `collection`
2. Add title, slug, intro, and a distinct cover image
3. Create `photo` documents with title, alt text, image, and short caption
4. Add photos to `collection.photos[]` in display order
5. Feature collections from `siteSettings.featuredCollections[]`
6. Publish photo documents first, then collection/settings changes

## Rules

- `collection.photos[]` order is the single source of truth for collection sequence
- `siteSettings.featuredCollections[]` order is the single source of truth for homepage curation
- A photo belongs to exactly one collection in v1
- EXIF, GPS, lens data, and tags stay out of scope for launch

