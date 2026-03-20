# Release Checklist

Use this checklist before a preview sign-off, again before production launch, and after each Sanity publish.

## Preview

- Confirm the preview build loads the homepage, about, contact, and photo pages.
- Verify the sitemap exposes photo routes and does not expose collection routes.
- If real content is configured, confirm the sitemap exposes at least 22 photo URLs and no collection URLs.
- If real content is configured, confirm `/about` renders text only and does not show a portrait placeholder.
- If real content is configured, confirm `/contact` shows `jinhyuk9714@gmail.com` and the Instagram link.
- Confirm `/collections` and `/collections/[slug]` redirect to `/`.
- Check `robots.txt` and `sitemap.xml` point at the expected site origin.
- Confirm the 404 page still renders for a missing route.
- Run the Playwright suite with the default mock-data fallback when Sanity is not configured.
- If preview has real-content environment variables, rerun Playwright with `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SITE_URL`, and `SANITY_REVALIDATE_SECRET` set.

## Production

- Verify production environment variables are present and correct before deploy.
- Confirm the deployed origin matches `NEXT_PUBLIC_SITE_URL`.
- Load the homepage, about, and contact pages in production.
- Open one photo route taken from `sitemap.xml`.
- Confirm the production sitemap exposes at least 22 photo URLs and no collection URLs for the launch drop.
- Confirm `/collections` and `/collections/[slug]` still redirect to `/`.
- Confirm `/about` stays text-only and `/contact` shows `jinhyuk9714@gmail.com` plus the Instagram link.
- Confirm `robots.txt` and `sitemap.xml` reference the production origin.
- Verify the revalidation endpoint rejects unsigned requests and accepts signed requests with the shared secret.

## Publish Validation

- Publish a photo first, then its collection, then any site settings updates.
- Confirm the updated page content appears without a full redeploy.
- Confirm photo URLs remain present in `sitemap.xml` and collection URLs do not return.
- Confirm the updated routes still return `200` and keep the expected canonical URL.
- Confirm a signed revalidation request refreshes the changed caption or featured order.
- If publish changes are not visible after revalidation, treat webhook handling as the first place to investigate.

## Rollback Criteria

- Any canonical launch route returns `404`, `5xx`, or a blank page.
- `robots.txt` or `sitemap.xml` points at the wrong origin.
- Photo routes disappear from the sitemap.
- Published content does not refresh after a signed revalidation request.
- Critical imagery or metadata regresses on homepage, photo, about, or contact.
- Roll back the deployment if the issue is in the deployed app; pause further publishes if the issue is in content or webhook configuration.

## Suggested Checks

```bash
pnpm --dir apps/web test:e2e
```

For a real-content launch rehearsal:

```bash
NEXT_PUBLIC_SITE_URL=https://example.com \
NEXT_PUBLIC_SANITY_PROJECT_ID=... \
NEXT_PUBLIC_SANITY_DATASET=production \
SANITY_REVALIDATE_SECRET=... \
pnpm --dir apps/web test:e2e
```
