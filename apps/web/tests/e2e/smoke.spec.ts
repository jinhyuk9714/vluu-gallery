import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET;

function extractLocs(xml: string) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

function expectedCanonicalUrl(pathname: string) {
  return pathname === "/" ? siteOrigin : new URL(pathname, siteOrigin).toString();
}

async function expectCanonical(page: Page, pathname: string) {
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    expectedCanonicalUrl(pathname),
  );
}

test("homepage, collections, about, and contact render core editorial content", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /quiet city studies/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /browse collections/i })).toBeVisible();
  await expectCanonical(page, "/");

  await page.goto("/collections");
  await expect(page.getByRole("heading", { name: /edited as sequences/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /seoul evenings/i })).toBeVisible();
  await expectCanonical(page, "/collections");

  await page.goto("/about");
  await expect(page.getByRole("heading", { name: /^about$/i })).toBeVisible();
  await expect(page.getByText(/small movements, quiet infrastructure/i)).toBeVisible();
  await expectCanonical(page, "/about");

  await page.goto("/contact");
  await expect(
    page.getByRole("main").getByRole("link", { name: /hello@example.com/i }),
  ).toBeVisible();
  await expectCanonical(page, "/contact");
});

test("sitemap exposes collection and photo routes that resolve successfully", async ({
  page,
  request,
}) => {
  const sitemapResponse = await request.get("/sitemap.xml");
  expect(sitemapResponse.ok()).toBeTruthy();

  const sitemapXml = await sitemapResponse.text();
  const urls = extractLocs(sitemapXml);

  expect(urls).toContain(siteOrigin);
  expect(urls).toContain(`${siteOrigin}/about`);
  expect(urls).toContain(`${siteOrigin}/collections`);
  expect(urls).toContain(`${siteOrigin}/contact`);

  const collectionUrl = urls.find((url) => {
    const pathname = new URL(url).pathname;
    return pathname.startsWith("/collections/") && pathname !== "/collections/";
  });
  const photoUrl = urls.find((url) => new URL(url).pathname.startsWith("/photo/"));

  expect(collectionUrl).toBeDefined();
  expect(photoUrl).toBeDefined();

  for (const url of [collectionUrl, photoUrl]) {
    const response = await page.goto(url!);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expectCanonical(page, new URL(url!).pathname);
  }
});

test("robots and sitemap reference the configured site origin", async ({ request }) => {
  const robotsResponse = await request.get("/robots.txt");
  expect(robotsResponse.ok()).toBeTruthy();

  const robotsText = await robotsResponse.text();
  expect(robotsText).toContain(siteOrigin);
  expect(robotsText).toContain("/sitemap.xml");

  const sitemapResponse = await request.get("/sitemap.xml");
  expect(sitemapResponse.ok()).toBeTruthy();

  const sitemapXml = await sitemapResponse.text();
  expect(extractLocs(sitemapXml)).toContain(siteOrigin);
});

test("missing routes render the not-found state", async ({ page }) => {
  const notFoundResponse = await page.goto("/missing-frame");
  expect(notFoundResponse?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /this frame is not in the edit/i })).toBeVisible();
});

test("revalidation endpoint rejects unsigned requests", async ({ request }) => {
  const response = await request.post("/api/revalidate", {
    data: { _type: "siteSettings" },
  });

  expect(response.status()).toBe(401);
});

test("revalidation endpoint accepts signed launch payloads when a secret is configured", async ({
  request,
}) => {
  test.skip(!revalidateSecret, "Set SANITY_REVALIDATE_SECRET to exercise signed revalidation.");

  const response = await request.post(`/api/revalidate?secret=${revalidateSecret}`, {
    data: { _type: "siteSettings" },
  });

  expect(response.status()).toBe(200);
  expect(await response.json()).toEqual({
    revalidated: ["/", "/about", "/collections", "/contact"],
    type: "siteSettings",
  });
});
