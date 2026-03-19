import { createClient } from "@sanity/client";
import { createReadStream, readFileSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const DEFAULT_API_VERSION = "2025-03-01";
const DEFAULT_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "ppsg7ml5";
const DEFAULT_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const DEFAULT_WRITE_TOKEN = process.env.SANITY_API_WRITE_TOKEN ?? "";
const WORKSPACE_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");
const DEFAULT_SOURCE_DIR = resolve(
  WORKSPACE_ROOT,
  "content-source",
  "launch",
);

class LaunchManifestError extends Error {
  constructor(issues) {
    super(issues.join("\n"));
    this.name = "LaunchManifestError";
    this.issues = issues;
  }
}

function asFilePath(input) {
  if (input instanceof URL) {
    return fileURLToPath(input);
  }

  return input;
}

function normalizeSourceDir(sourceDir) {
  if (!sourceDir) {
    return DEFAULT_SOURCE_DIR;
  }

  return resolve(asFilePath(sourceDir));
}

function readLaunchManifestFromFile(filePathOrUrl) {
  const filePath = asFilePath(filePathOrUrl);
  const raw = readFileSync(filePath, "utf8");

  try {
    return JSON.parse(raw);
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown parse error";
    throw new LaunchManifestError([`Unable to parse manifest at ${filePath}: ${reason}`]);
  }
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function trimString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeFeaturedCollectionEntry(entry) {
  if (typeof entry === "string") {
    return entry.trim();
  }

  if (entry && typeof entry === "object" && typeof entry.slug === "string") {
    return entry.slug.trim();
  }

  return "";
}

function normalizeSocialLinks(value, issues, parentPath) {
  if (value === undefined) {
    return [];
  }

  if (!Array.isArray(value)) {
    issues.push(`${parentPath} must be an array of social links.`);
    return [];
  }

  return value.map((link, index) => {
    const label = trimString(link?.label);
    const url = trimString(link?.url);

    if (!label) {
      issues.push(`${parentPath}[${index}].label is required.`);
    }

    if (!url) {
      issues.push(`${parentPath}[${index}].url is required.`);
    }

    return { label, url };
  });
}

function resolveRelativePath(sourceDir, relativePath) {
  return resolve(sourceDir, relativePath);
}

function assertFileExists(filePath, issues, label) {
  try {
    const stat = statSync(filePath);
    if (!stat.isFile()) {
      issues.push(`${label}: expected a file at ${filePath}.`);
    }
  } catch {
    issues.push(`${label}: missing file at ${filePath}.`);
  }
}

function validateLaunchManifest(manifest) {
  const issues = [];

  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    throw new LaunchManifestError(["Manifest must be a JSON object."]);
  }

  const collections = Array.isArray(manifest.collections) ? manifest.collections : [];
  if (collections.length === 0) {
    issues.push("Manifest must include at least one collection.");
  }

  const siteSettings =
    manifest.siteSettings && typeof manifest.siteSettings === "object"
      ? manifest.siteSettings
      : undefined;
  if (!siteSettings) {
    issues.push("Manifest must include siteSettings.");
  }

  const aboutPage =
    manifest.aboutPage && typeof manifest.aboutPage === "object" ? manifest.aboutPage : undefined;
  if (!aboutPage) {
    issues.push("Manifest must include aboutPage.");
  }

  const slugOwners = new Map();
  const collectionSlugs = [];

  for (const [collectionIndex, collection] of collections.entries()) {
    const collectionPath = `collections[${collectionIndex}]`;
    const collectionSlug = trimString(collection?.slug);
    const collectionTitle = trimString(collection?.title);
    const coverFile = trimString(collection?.coverFile);
    const coverAlt = trimString(collection?.coverAlt);
    const photos = Array.isArray(collection?.photos) ? collection.photos : [];

    if (!collectionSlug) {
      issues.push(`${collectionPath}.slug is required.`);
    }

    if (!collectionTitle) {
      issues.push(`${collectionPath}.title is required.`);
    }

    if (!isNonEmptyString(collection?.intro)) {
      issues.push(`${collectionPath}.intro is required.`);
    }

    if (!coverFile) {
      issues.push(`${collectionPath}.coverFile is required.`);
    }

    if (!coverAlt) {
      issues.push(`${collectionPath}.coverAlt is required.`);
    }

    if (photos.length === 0) {
      issues.push(`${collectionPath}.photos must include at least one photo.`);
    }

    if (collectionSlug) {
      const previous = slugOwners.get(collectionSlug);
      if (previous) {
        issues.push(`Duplicate slug "${collectionSlug}" found in ${previous} and ${collectionPath}.`);
      } else {
        slugOwners.set(collectionSlug, collectionPath);
      }
      collectionSlugs.push(collectionSlug);
    }

    for (const [photoIndex, photo] of photos.entries()) {
      const photoPath = `${collectionPath}.photos[${photoIndex}]`;
      const photoSlug = trimString(photo?.slug);
      const photoTitle = trimString(photo?.title);
      const photoFile = trimString(photo?.file);
      const photoAlt = trimString(photo?.alt);
      const photoCaptionShort = trimString(photo?.captionShort);
      const shotDate = trimString(photo?.shotDate);
      const locationLabel = trimString(photo?.locationLabel);

      if (!photoSlug) {
        issues.push(`${photoPath}.slug is required.`);
      }

      if (!photoTitle) {
        issues.push(`${photoPath}.title is required.`);
      }

      if (!photoFile) {
        issues.push(`${photoPath}.file is required.`);
      }

      if (!photoAlt) {
        issues.push(`${photoPath}.alt is required.`);
      }

      if (!photoCaptionShort) {
        issues.push(`${photoPath}.captionShort is required.`);
      }

      if (photo?.shotDate !== undefined && !shotDate) {
        issues.push(`${photoPath}.shotDate, when provided, must be a non-empty string.`);
      }

      if (photo?.locationLabel !== undefined && !locationLabel) {
        issues.push(`${photoPath}.locationLabel, when provided, must be a non-empty string.`);
      }

      if (photoSlug) {
        const previous = slugOwners.get(photoSlug);
        if (previous) {
          issues.push(`Duplicate slug "${photoSlug}" found in ${previous} and ${photoPath}.`);
        } else {
          slugOwners.set(photoSlug, photoPath);
        }
      }
    }
  }

  const featuredCollections = Array.isArray(siteSettings?.featuredCollections)
    ? siteSettings.featuredCollections.map(normalizeFeaturedCollectionEntry).filter(Boolean)
    : [];
  if (featuredCollections.length === 0) {
    issues.push("siteSettings.featuredCollections must include at least one collection.");
  }

  const socialLinks = siteSettings
    ? normalizeSocialLinks(siteSettings.socialLinks, issues, "siteSettings.socialLinks")
    : [];

  if (siteSettings) {
    if (!isNonEmptyString(siteSettings.siteTitle)) {
      issues.push("siteSettings.siteTitle is required.");
    }

    if (!isNonEmptyString(siteSettings.siteDescription)) {
      issues.push("siteSettings.siteDescription is required.");
    }

    if (!isNonEmptyString(siteSettings.homeIntro)) {
      issues.push("siteSettings.homeIntro is required.");
    }

    if (!isNonEmptyString(siteSettings.contactEmail)) {
      issues.push("siteSettings.contactEmail is required.");
    }

    const seenFeatured = new Set();
    for (const [index, featuredSlug] of featuredCollections.entries()) {
      if (!collectionSlugs.includes(featuredSlug)) {
        issues.push(
          `siteSettings.featuredCollections[${index}] references missing collection "${featuredSlug}".`,
        );
      }

      if (seenFeatured.has(featuredSlug)) {
        issues.push(`Duplicate featured collection "${featuredSlug}" found in siteSettings.`);
      }
      seenFeatured.add(featuredSlug);
    }
  }

  if (aboutPage) {
    if (!isNonEmptyString(aboutPage.title)) {
      issues.push("aboutPage.title is required.");
    }

    if (!isNonEmptyString(aboutPage.intro)) {
      issues.push("aboutPage.intro is required.");
    }

    if (!Array.isArray(aboutPage.body) || aboutPage.body.length === 0) {
      issues.push("aboutPage.body must include at least one paragraph.");
    }

    if (aboutPage.portraitFile !== undefined && !trimString(aboutPage.portraitFile)) {
      issues.push("aboutPage.portraitFile, when provided, must be a non-empty string.");
    }

    if (aboutPage.portraitFile !== undefined && !trimString(aboutPage.portraitAlt)) {
      issues.push("aboutPage.portraitAlt is required when portraitFile is provided.");
    }

    if (!aboutPage.portraitFile && aboutPage.portraitAlt) {
      issues.push("aboutPage.portraitAlt requires portraitFile.");
    }
  }

  if (issues.length > 0) {
    throw new LaunchManifestError(issues);
  }

  return {
    aboutPage: {
      body: [...aboutPage.body],
      intro: trimString(aboutPage.intro),
      portraitAlt: trimString(aboutPage.portraitAlt),
      portraitFile: trimString(aboutPage.portraitFile),
      title: trimString(aboutPage.title),
    },
    collections: collections.map((collection) => ({
      coverAlt: trimString(collection.coverAlt),
      coverFile: trimString(collection.coverFile),
      intro: trimString(collection.intro),
      photos: collection.photos.map((photo) => ({
        alt: trimString(photo.alt),
        captionShort: trimString(photo.captionShort),
        file: trimString(photo.file),
        locationLabel: trimString(photo.locationLabel),
        shotDate: trimString(photo.shotDate),
        slug: trimString(photo.slug),
        title: trimString(photo.title),
      })),
      slug: trimString(collection.slug),
      title: trimString(collection.title),
    })),
    siteSettings: {
      contactEmail: trimString(siteSettings.contactEmail),
      featuredCollections: featuredCollections,
      homeIntro: trimString(siteSettings.homeIntro),
      siteDescription: trimString(siteSettings.siteDescription),
      siteTitle: trimString(siteSettings.siteTitle),
      socialLinks,
    },
  };
}

function buildLaunchImportPlan(manifest, options = {}) {
  const normalized = validateLaunchManifest(manifest);
  const sourceDir = normalizeSourceDir(options.sourceDir);

  const collections = normalized.collections.map((collection) => ({
    ...collection,
    documentId: `collection.${collection.slug}`,
    coverPath: resolveRelativePath(sourceDir, collection.coverFile),
    photos: collection.photos.map((photo) => ({
      ...photo,
      documentId: `photo.${photo.slug}`,
      path: resolveRelativePath(sourceDir, photo.file),
    })),
  }));

  const aboutPage = {
    ...normalized.aboutPage,
    documentId: "aboutPage",
    portraitPath: normalized.aboutPage.portraitFile
      ? resolveRelativePath(sourceDir, normalized.aboutPage.portraitFile)
      : undefined,
  };

  const siteSettings = {
    ...normalized.siteSettings,
    documentId: "siteSettings",
  };

  const checks = [];
  for (const collection of collections) {
    checks.push([collection.coverPath, `collections[${collection.slug}].coverFile`]);
    for (const photo of collection.photos) {
      checks.push([photo.path, `collections[${collection.slug}].photos[${photo.slug}]`]);
    }
  }
  if (aboutPage.portraitPath) {
    checks.push([aboutPage.portraitPath, "aboutPage.portraitFile"]);
  }

  const fileIssues = [];
  for (const [filePath, label] of checks) {
    assertFileExists(filePath, fileIssues, label);
  }
  if (fileIssues.length > 0) {
    throw new LaunchManifestError(fileIssues);
  }

  return {
    aboutPage,
    collections,
    featuredCollections: siteSettings.featuredCollections,
    projectId: options.projectId ?? DEFAULT_PROJECT_ID,
    siteSettings,
    sourceDir,
  };
}

async function uploadImageAsset(client, filePath) {
  const stream = createReadStream(filePath);
  const upload = await client.assets.upload("image", stream, {
    filename: filePath.split(/[\\/]/).pop(),
  });

  return upload;
}

function createDocumentBase(documentId, type) {
  return {
    _id: documentId,
    _type: type,
  };
}

function parseCliArgs(argv) {
  const args = {
    dryRun: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];

    if (value === "--") {
      continue;
    }

    if (value === "--dry-run") {
      args.dryRun = true;
      continue;
    }

    if (value === "--help" || value === "-h") {
      args.help = true;
      continue;
    }

    if (value === "--manifest") {
      args.manifestPath = argv[++index];
      continue;
    }

    if (value === "--source-dir") {
      args.sourceDir = argv[++index];
      continue;
    }

    if (value === "--project-id") {
      args.projectId = argv[++index];
      continue;
    }

    if (value === "--dataset") {
      args.dataset = argv[++index];
      continue;
    }

    if (value === "--token") {
      args.token = argv[++index];
    }
  }

  return args;
}

async function importLaunchContent({
  dataset = DEFAULT_DATASET,
  manifestPath = pathToFileURL(resolve(DEFAULT_SOURCE_DIR, "manifest.json")),
  projectId = DEFAULT_PROJECT_ID,
  sourceDir,
  token = DEFAULT_WRITE_TOKEN,
  dryRun = false,
} = {}) {
  if (!token && !dryRun) {
    throw new Error("SANITY_API_WRITE_TOKEN is required to import launch content.");
  }

  const manifest = readLaunchManifestFromFile(manifestPath);
  const plan = buildLaunchImportPlan(manifest, {
    projectId,
    sourceDir: sourceDir ?? dirname(asFilePath(manifestPath)),
  });

  if (dryRun) {
    return plan;
  }

  const client = createClient({
    apiVersion: DEFAULT_API_VERSION,
    dataset,
    projectId,
    token,
    useCdn: false,
  });

  const uploadedCollections = [];

  for (const collection of plan.collections) {
    const coverAsset = await uploadImageAsset(client, collection.coverPath);
    const photoDocuments = [];

    for (const photo of collection.photos) {
      const asset = await uploadImageAsset(client, photo.path);
      const photoDoc = {
        ...createDocumentBase(photo.documentId, "photo"),
        alt: photo.alt,
        captionShort: photo.captionShort,
        image: {
          _type: "image",
          asset: {
            _ref: asset.asset?._id ?? asset._id,
            _type: "reference",
          },
        },
        locationLabel: photo.locationLabel || undefined,
        shotDate: photo.shotDate || undefined,
        slug: { _type: "slug", current: photo.slug },
        title: photo.title,
      };

      await client.createOrReplace(photoDoc);
      photoDocuments.push(photoDoc);
    }

    const collectionDoc = {
      ...createDocumentBase(collection.documentId, "collection"),
      coverAlt: collection.coverAlt,
      coverImage: {
        _type: "image",
        asset: {
          _ref: coverAsset.asset?._id ?? coverAsset._id,
          _type: "reference",
        },
      },
      intro: collection.intro,
      photos: photoDocuments.map((photoDoc) => ({
        _key: photoDoc._id,
        _ref: photoDoc._id,
        _type: "reference",
      })),
      slug: { _type: "slug", current: collection.slug },
      title: collection.title,
    };

    await client.createOrReplace(collectionDoc);
    uploadedCollections.push(collectionDoc);
  }

  const aboutPageDoc = {
    ...createDocumentBase(plan.aboutPage.documentId, "aboutPage"),
    body: plan.aboutPage.body.map((paragraph, index) => ({
      _key: `paragraph-${index}`,
      _type: "block",
      children: [{ _key: `span-${index}`, _type: "span", marks: [], text: paragraph }],
      markDefs: [],
      style: "normal",
    })),
    intro: plan.aboutPage.intro,
    title: plan.aboutPage.title,
  };

  if (plan.aboutPage.portraitPath) {
    const aboutAsset = await uploadImageAsset(client, plan.aboutPage.portraitPath);
    aboutPageDoc.portraitAlt = plan.aboutPage.portraitAlt;
    aboutPageDoc.portraitImage = {
      _type: "image",
      asset: {
        _ref: aboutAsset.asset?._id ?? aboutAsset._id,
        _type: "reference",
      },
    };
  }

  await client.createOrReplace(aboutPageDoc);

  await client.createOrReplace({
    ...createDocumentBase(plan.siteSettings.documentId, "siteSettings"),
    contactEmail: plan.siteSettings.contactEmail,
    featuredCollections: plan.siteSettings.featuredCollections.map((slug) => ({
      _key: slug,
      _ref: `collection.${slug}`,
      _type: "reference",
    })),
    homeIntro: plan.siteSettings.homeIntro,
    siteDescription: plan.siteSettings.siteDescription,
    siteTitle: plan.siteSettings.siteTitle,
    socialLinks: plan.siteSettings.socialLinks.map((link) => ({
      _key: `${link.label}-${link.url}`,
      _type: "socialLink",
      label: link.label,
      url: link.url,
    })),
  });

  const photoCount = uploadedCollections.reduce(
    (sum, collection) => sum + collection.photos.length,
    0,
  );

  return {
    aboutPageId: plan.aboutPage.documentId,
    collectionCount: uploadedCollections.length,
    photoCount,
    siteSettingsId: plan.siteSettings.documentId,
  };
}

export {
  LaunchManifestError,
  buildLaunchImportPlan,
  importLaunchContent,
  readLaunchManifestFromFile,
  validateLaunchManifest,
};

const executedPath = process.argv[1] ? pathToFileURL(process.argv[1]).href : undefined;

if (executedPath && import.meta.url === executedPath) {
  const cliArgs = parseCliArgs(process.argv.slice(2));

  if (cliArgs.help) {
    process.stdout.write(
      [
        "Usage: node scripts/launch-content.mjs [--dry-run] [--manifest PATH] [--source-dir PATH]",
        "       [--project-id ID] [--dataset NAME] [--token TOKEN]",
        "Writes use SANITY_API_WRITE_TOKEN by default.",
      ].join("\n") + "\n",
    );
  } else {
    importLaunchContent({
      dataset: cliArgs.dataset,
      manifestPath: cliArgs.manifestPath ? resolve(WORKSPACE_ROOT, cliArgs.manifestPath) : undefined,
      projectId: cliArgs.projectId,
      sourceDir: cliArgs.sourceDir ? resolve(WORKSPACE_ROOT, cliArgs.sourceDir) : undefined,
      token: cliArgs.token,
      dryRun: cliArgs.dryRun,
    })
      .then((result) => {
        if (cliArgs.dryRun) {
          process.stdout.write(
            `Dry run complete. ${result.collections.length} collections, ${result.collections.reduce((sum, collection) => sum + collection.photos.length, 0)} photos.\n`,
          );
          return;
        }

        process.stdout.write(
          `Launch content imported successfully. ${result.collectionCount} collections, ${result.photoCount} photos.\n`,
        );
      })
      .catch((error) => {
        process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
        process.exitCode = 1;
      });
  }
}
