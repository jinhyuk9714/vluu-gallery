# Deployment Notes

## Web

- Deploy `apps/web` to Vercel
- Configure the environment variables from `.env.example`
- Use Preview Deployments for code review

## Studio

- Host `apps/studio` on Sanity Studio hosting
- Reuse the same project ID and dataset as the web app

## Revalidation

- Sanity publish webhooks call `POST /api/revalidate`
- The endpoint validates `SANITY_REVALIDATE_SECRET`
- Revalidated routes depend on changed document type and slug

## Launch Checklist

- See [release-checklist.md](./release-checklist.md) for the preview, production, publish validation, and rollback checklist.
