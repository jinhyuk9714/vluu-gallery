import { createClient } from "@sanity/client";

import { parseAppEnv } from "@/lib/env";

const env = parseAppEnv();

export const sanityClient = createClient({
  apiVersion: "2025-03-01",
  dataset: env.sanityDataset,
  projectId: env.sanityProjectId ?? "ppsg7ml5",
  useCdn: true,
});

export const isSanityConfigured = env.isSanityConfigured;

