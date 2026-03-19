import { defineArrayMember, defineField, defineType } from "sanity";

async function validateExclusivePhotoRefs(
  value: Array<{ _ref?: string }> | undefined,
  context: {
    document?: { _id?: string };
    getClient: (options: { apiVersion: string }) => {
      fetch: <T>(query: string, params: Record<string, unknown>) => Promise<T>;
    };
  },
) {
  if (!value || value.length === 0) {
    return true;
  }

  const photoIds = value.map((item) => item._ref).filter(Boolean) as string[];

  if (new Set(photoIds).size !== photoIds.length) {
    return "A photo can only appear once inside a collection.";
  }

  const documentId = context.document?._id ?? "";
  const publishedId = documentId.replace(/^drafts\./, "");
  const draftId = `drafts.${publishedId}`;
  const client = context.getClient({ apiVersion: "2025-03-01" });
  const duplicates = await client.fetch<Array<{ title?: string }>>(
    `*[
      _type == "collection" &&
      !(_id in [$draftId, $publishedId]) &&
      count(photos[]._ref[@ in $photoIds]) > 0
    ]{
      title
    }`,
    { draftId, photoIds, publishedId },
  );

  if (duplicates.length > 0) {
    return `These photos already belong to another collection: ${duplicates
      .map((item) => item.title ?? "Untitled collection")
      .join(", ")}.`;
  }

  return true;
}

const socialLink = defineType({
  name: "socialLink",
  title: "Social link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (rule) => rule.required(),
    }),
  ],
});

const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({
      name: "siteTitle",
      title: "Site title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "siteDescription",
      title: "Site description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "homeIntro",
      title: "Home intro",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "featuredCollections",
      title: "Featured collections",
      type: "array",
      of: [
        defineArrayMember({
          to: [{ type: "collection" }],
          type: "reference",
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      of: [defineArrayMember({ type: "socialLink" })],
    }),
  ],
});

const photo = defineType({
  name: "photo",
  title: "Photo",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "captionShort",
      title: "Short caption",
      type: "text",
      rows: 2,
      validation: (rule) => rule.required().max(160),
    }),
    defineField({
      name: "shotDate",
      title: "Shot date",
      type: "date",
    }),
    defineField({
      name: "locationLabel",
      title: "Location label",
      type: "string",
    }),
  ],
});

const collection = defineType({
  name: "collection",
  title: "Collection",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coverAlt",
      title: "Cover alt text",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "photos",
      title: "Photos",
      type: "array",
      of: [
        defineArrayMember({
          to: [{ type: "photo" }],
          type: "reference",
        }),
      ],
      validation: (rule) =>
        rule.required().min(1).custom((value, context) =>
          validateExclusivePhotoRefs(value as Array<{ _ref?: string }> | undefined, {
            document: context.document as { _id?: string } | undefined,
            getClient: context.getClient,
          }),
        ),
    }),
  ],
});

const aboutPage = defineType({
  name: "aboutPage",
  title: "About page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "portraitImage",
      title: "Portrait image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "portraitAlt",
      title: "Portrait alt text",
      type: "string",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { portraitImage?: unknown };
          if (parent?.portraitImage && !value) {
            return "Portrait alt text is required when a portrait image is present.";
          }

          return true;
        }),
    }),
  ],
});

export const schemaTypes = [socialLink, siteSettings, collection, photo, aboutPage];
