# Release Checklist

Use this checklist before a preview sign-off, again before production launch, and after each Sanity publish.

## Preview

- Confirm the preview build loads the homepage, collections, about, and contact pages.
- Verify the sitemap exposes at least one collection route and one photo route.
- Check `robots.txt` and `sitemap.xml` point at the expected site origin.
- Confirm the 404 page still renders for a missing route.
- Run the Playwright suite with the default mock-data fallback when Sanity is not configured.
- If preview has real-content environment variables, rerun Playwright with `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SITE_URL`, and `SANITY_REVALIDATE_SECRET` set.

## Production

- Verify production environment variables are present and correct before deploy.
- Confirm the deployed origin matches `NEXT_PUBLIC_SITE_URL`.
- Load the homepage, collections index, about, and contact pages in production.
- Open one collection route and one photo route taken from `sitemap.xml`.
- Confirm `robots.txt` and `sitemap.xml` reference the production origin.
- Verify the revalidation endpoint rejects unsigned requests and accepts signed requests with the shared secret.

## Publish Validation

- Publish a photo first, then its collection, then any site settings updates.
- Confirm the updated page content appears without a full redeploy.
- Confirm the collection and photo URLs remain present in `sitemap.xml`.
- Confirm the updated routes still return `200` and keep the expected canonical URL.
- If publish changes are not visible after revalidation, treat webhook handling as the first place to investigate.

## Rollback Criteria

- Any canonical launch route returns `404`, `5xx`, or a blank page.
- `robots.txt` or `sitemap.xml` points at the wrong origin.
- Collection or photo routes disappear from the sitemap.
- Published content does not refresh after a signed revalidation request.
- Critical imagery or metadata regresses on homepage, collections, about, or contact.
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
