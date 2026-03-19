import { defineCliConfig } from "sanity/cli";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "ue1xr5ow";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const studioHost = process.env.SANITY_STUDIO_HOST ?? "vluu-gallery";
const deploymentAppId = process.env.SANITY_STUDIO_APP_ID ?? "g7n5h95o2v8m3goa5jq20hbi";

export default defineCliConfig({
  api: { projectId, dataset },
  deployment: {
    appId: deploymentAppId,
  },
  studioHost,
});
