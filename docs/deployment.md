# Deployment Notes

## Web

- Deploy `apps/web` to Vercel as the web project root.
- Use the repo root as the install location and keep the web app build scoped to `apps/web`.
- Configure the environment variables from [`.env.example`](../.env.example) for both Preview and Production.
- Set `NEXT_PUBLIC_SITE_URL` per environment:
  - Preview: the current `*.vercel.app` preview URL.
  - Production: Vercel's default production domain, for example `https://<project>.vercel.app`.
- If `NEXT_PUBLIC_SITE_URL` is omitted on Vercel, the app falls back to Vercel's system URLs so preview and production metadata still resolve to the active deployment origin.
- Use Preview Deployments for code review and validation before promoting content changes.
- `SANITY_API_WRITE_TOKEN` is not required for this launch flow. The web app only reads from Sanity and accepts publish webhooks for revalidation.

## Studio

- Host `apps/studio` on Sanity Studio hosting
- Reuse the same project ID and dataset as the web app
- The current hosted Studio URL is `https://vluu-gallery.sanity.studio`
- Keep `NEXT_PUBLIC_SANITY_STUDIO_URL` aligned with that hosted Studio URL in Preview and Production

## Revalidation

- Create a Sanity publish webhook that calls `POST https://<deployment-url>/api/revalidate`.
- Pass the shared secret as either `?secret=<value>` or an `Authorization: Bearer <value>` header.
- The endpoint validates `SANITY_REVALIDATE_SECRET`.
- Revalidated routes depend on the changed document type and slug.
- Keep webhook URLs aligned with the active Preview or Production deployment URL.

## Launch Checklist

- Verify preview and production environment variables, including the correct Vercel domain in `NEXT_PUBLIC_SITE_URL`.
- Confirm 404, sitemap, robots, canonical, and OG metadata.
- Confirm homepage hero is the only prioritized LCP image.
- Confirm content updates refresh without full redeploy.
- Use [release-checklist.md](./release-checklist.md) for the full preview, production, publish validation, and rollback procedure.
