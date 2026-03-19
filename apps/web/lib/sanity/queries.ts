import groq from "groq";

export const siteSettingsQuery = groq`
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    siteTitle,
    siteDescription,
    homeIntro,
    contactEmail,
    socialLinks[]{
      label,
      url
    },
    "featuredCollections": featuredCollections[]->{
      title,
      "slug": slug.current,
      intro,
      coverAlt,
      coverImage
    }
  }
`;

export const collectionsQuery = groq`
  *[_type == "collection"] | order(title asc){
    title,
    "slug": slug.current,
    intro,
    coverAlt,
    coverImage,
    "photos": photos[]->{
      title,
      "slug": slug.current,
      alt,
      captionShort,
      shotDate,
      locationLabel,
      image
    }
  }
`;

export const aboutPageQuery = groq`
  *[_type == "aboutPage" && _id == "aboutPage"][0]{
    title,
    intro,
    body,
    portraitAlt,
    portraitImage
  }
`;
