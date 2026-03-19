import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { schemaTypes } from "./schemaTypes";
import { singletonTypes, structure } from "./structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "ue1xr5ow";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  basePath: "/",
  dataset,
  document: {
    actions: (previousActions, context) =>
      singletonTypes.has(context.schemaType)
        ? previousActions.filter(
            (action) => action.action !== "duplicate" && action.action !== "delete",
          )
        : previousActions,
    newDocumentOptions: (previousOptions, context) =>
      context.creationContext.type === "global"
        ? previousOptions.filter((option) => !singletonTypes.has(option.templateId))
        : previousOptions,
  },
  name: "vluu-studio",
  plugins: [structureTool({ structure }), visionTool()],
  projectId,
  schema: {
    types: schemaTypes,
  },
  title: "VLUU Studio",
});
