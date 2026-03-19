import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

const siteOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const revalidateSecret = process.env.SANITY_REVALIDATE_SECRET;
const isRealContentLaunch =
  Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) && siteOrigin !== "http://localhost:3000";

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

function skipWhenNoRealContent() {
  test.skip(
    !isRealContentLaunch,
    "Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SITE_URL to run real-content launch checks.",
  );
}

test("homepage, collections, about, and contact render core editorial content", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /home/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /collections/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /contact/i })).toBeVisible();
  await expect(page.getByRole("main").getByText(/view collection/i).first()).toBeVisible();
  await expect(page.getByRole("main").getByText(/^scroll$/i)).toBeVisible();
  await expectCanonical(page, "/");

  await page.goto("/collections");
  await expect(page.getByRole("main").getByText(/view collection/i).first()).toBeVisible();
  await expectCanonical(page, "/collections");

  await page.goto("/about");
  await expect(page.getByRole("main").getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("main").getByText(/^info$/i)).toBeVisible();
  await expectCanonical(page, "/about");

  await page.goto("/contact");
  await expect(page.getByRole("main").getByText(/^contact$/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: /reach out with context/i })).toBeVisible();
  await expect(page.getByText(/timeline, location, and intended use/i)).toBeVisible();
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
  await expect(page.getByRole("heading", { name: /this sequence is not in the edit/i })).toBeVisible();
  await expect(page.getByText(/may have moved/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /return to overview/i })).toBeVisible();
});

test("revalidation endpoint rejects unsigned requests", async ({ request }) => {
  const response = await request.post("/api/revalidate", {
    data: { _type: "siteSettings" },
  });

  expect(response.status()).toBe(401);
});

test("real-content launch exposes at least two collections and 22 photos in the sitemap", async ({
  page,
  request,
}) => {
  skipWhenNoRealContent();

  const sitemapResponse = await request.get("/sitemap.xml");
  expect(sitemapResponse.ok()).toBeTruthy();

  const urls = extractLocs(await sitemapResponse.text());
  const pathnames = urls.map((url) => new URL(url).pathname);
  const collectionUrls = pathnames.filter(
    (pathname) => pathname.startsWith("/collections/") && pathname !== "/collections/",
  );
  const photoUrls = pathnames.filter((pathname) => pathname.startsWith("/photo/"));

  expect(collectionUrls.length).toBeGreaterThanOrEqual(2);
  expect(photoUrls.length).toBeGreaterThanOrEqual(22);

  for (const pathname of [collectionUrls[0], photoUrls[0]]) {
    const response = await page.goto(new URL(pathname, siteOrigin).toString());
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expectCanonical(page, pathname);
  }
});

test("real-content about page stays text-only", async ({ page }) => {
  skipWhenNoRealContent();

  await page.goto("/about");
  await expect(page.getByRole("main").getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("main").locator("img")).toHaveCount(0);
});

test("real-content contact page surfaces the launch email and Instagram link", async ({ page }) => {
  skipWhenNoRealContent();

  await page.goto("/contact");

  await expect(
    page.getByRole("main").getByRole("link", { name: /jinhyuk9714@gmail.com/i }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: /instagram/i })).toHaveAttribute(
    "href",
    "https://instagram.com/sungjinhyuk",
  );
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
