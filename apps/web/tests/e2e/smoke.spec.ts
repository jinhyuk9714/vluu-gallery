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

test("homepage, about, and contact render core editorial content without collections navigation", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: /home/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /contact/i })).toBeVisible();
  await expect(page.getByRole("main").getByText(/^scroll$/i)).toBeVisible();
  await expect(page.getByRole("main").getByText(/short stories, sparse captions/i)).toBeVisible();
  await expect(page.getByRole("link", { name: /collections/i })).toHaveCount(0);
  await expect(page.getByRole("main").getByText(/view collection/i)).toHaveCount(0);

  const viewportWidth = page.viewportSize()?.width ?? 0;
  if (viewportWidth < 768) {
    await expect(page.getByRole("button", { name: /^s$/i })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /^m$/i })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /^l$/i })).toHaveCount(0);
  } else {
    await expect(page.getByRole("button", { name: /^s$/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /^m$/i })).toBeVisible();
    await expect(page.getByRole("button", { name: /^l$/i })).toBeVisible();
  }
  await expectCanonical(page, "/");

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

test("home wall density controls are desktop-and-tablet only and change the column flow", async ({
  page,
}) => {
  await page.goto("/");
  const viewportWidth = page.viewportSize()?.width ?? 0;

  if (viewportWidth < 768) {
    await expect(page.getByRole("button", { name: /^s$/i })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /^m$/i })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /^l$/i })).toHaveCount(0);
    return;
  }

  const wall = page.getByTestId("home-wall");
  await expect(wall).toBeVisible();

  const readColumnCount = async () =>
    wall.evaluate((element) => window.getComputedStyle(element).columnCount);

  await page.getByRole("button", { name: /^s$/i }).click();
  const denseColumns = await readColumnCount();

  await page.getByRole("button", { name: /^l$/i }).click();
  const looseColumns = await readColumnCount();

  expect(Number.parseInt(denseColumns, 10)).toBeGreaterThan(Number.parseInt(looseColumns, 10));
});

test("sitemap exposes home, about, contact, and photo routes without collection URLs", async ({ page, request }) => {
  const sitemapResponse = await request.get("/sitemap.xml");
  expect(sitemapResponse.ok()).toBeTruthy();

  const sitemapXml = await sitemapResponse.text();
  const urls = extractLocs(sitemapXml);

  expect(urls).toContain(siteOrigin);
  expect(urls).toContain(`${siteOrigin}/about`);
  expect(urls).toContain(`${siteOrigin}/contact`);
  expect(urls.some((url) => new URL(url).pathname.startsWith("/collections"))).toBe(false);

  const photoUrl = urls.find((url) => new URL(url).pathname.startsWith("/photo/"));

  expect(photoUrl).toBeDefined();

  const response = await page.goto(photoUrl!);
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expectCanonical(page, new URL(photoUrl!).pathname);
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

test("legacy collection routes redirect permanently to the homepage", async ({ page, request }) => {
  const collectionIndexResponse = await request.get("/collections", {
    maxRedirects: 0,
  });
  expect(collectionIndexResponse.status()).toBe(308);
  expect(collectionIndexResponse.headers()["location"]).toBe("/");

  const collectionDetailResponse = await request.get("/collections/seoul-evenings", {
    maxRedirects: 0,
  });
  expect(collectionDetailResponse.status()).toBe(308);
  expect(collectionDetailResponse.headers()["location"]).toBe("/");

  await page.goto("/collections/seoul-evenings");
  await expect(page).toHaveURL(/\/$/);
});

test("revalidation endpoint rejects unsigned requests", async ({ request }) => {
  const response = await request.post("/api/revalidate", {
    data: { _type: "siteSettings" },
  });

  expect(response.status()).toBe(401);
});

test("photo detail removes collection context and navigates across the full archive", async ({
  page,
}) => {
  await page.goto("/photo/condensation-window");

  await expect(page.getByRole("heading", { level: 1, name: /condensation window/i })).toBeVisible();
  await expect(page.getByText(/^collection$/i)).toHaveCount(0);
  await expect(page.getByRole("link", { name: /prev:\s*bridge reflections/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /next:\s*fare beep/i })).toBeVisible();
});

test("photo detail hero preserves the original image ratio instead of cropping to cover", async ({
  page,
}) => {
  await page.goto("/photo/condensation-window");

  const metrics = await page
    .getByRole("main")
    .locator("section")
    .first()
    .locator("img")
    .first()
    .evaluate((image: HTMLImageElement) => {
      const rect = image.getBoundingClientRect();
      const styles = window.getComputedStyle(image);

      return {
        naturalHeight: image.naturalHeight,
        naturalWidth: image.naturalWidth,
        objectFit: styles.objectFit,
        renderedHeight: rect.height,
        renderedWidth: rect.width,
      };
    });

  const naturalAspectRatio = metrics.naturalWidth / metrics.naturalHeight;
  const renderedAspectRatio = metrics.renderedWidth / metrics.renderedHeight;

  expect(metrics.objectFit).not.toBe("cover");
  expect(Math.abs(renderedAspectRatio - naturalAspectRatio)).toBeLessThan(0.03);
});

test("photo detail title sticks to the viewport bottom until the photo section ends", async ({
  page,
}) => {
  await page.goto("/photo/condensation-window");

  const hero = page.getByRole("main").locator("section").first();
  const title = hero.getByRole("heading", { level: 1, name: /condensation window/i });

  const sectionMetrics = await hero.evaluate((element) => {
    const rect = element.getBoundingClientRect();

    return {
      bottom: window.scrollY + rect.bottom,
      top: window.scrollY + rect.top,
      viewportHeight: window.innerHeight,
    };
  });

  const readTitleMetrics = async () =>
    title.evaluate((element) => {
      const rect = element.getBoundingClientRect();

      return {
        bottomOffset: window.innerHeight - rect.bottom,
        top: rect.top,
      };
    });

  const initial = await readTitleMetrics();

  expect(initial.bottomOffset).toBeGreaterThanOrEqual(0);
  expect(initial.bottomOffset).toBeLessThan(80);

  const stickyScrollY = Math.min(sectionMetrics.top + 320, sectionMetrics.bottom - sectionMetrics.viewportHeight - 40);

  await page.evaluate((scrollY) => {
    window.scrollTo(0, scrollY);
  }, stickyScrollY);
  await page.waitForTimeout(100);

  const sticky = await readTitleMetrics();

  expect(sticky.bottomOffset).toBeGreaterThanOrEqual(0);
  expect(sticky.bottomOffset).toBeLessThan(80);
  expect(Math.abs(sticky.bottomOffset - initial.bottomOffset)).toBeLessThan(40);

  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await expect
    .poll(async () => {
      const released = await readTitleMetrics();
      return released.bottomOffset >= sticky.bottomOffset + 120 || released.top < 0;
    })
    .toBe(true);
});

test("real-content launch exposes at least 22 photos in the sitemap without collection URLs", async ({
  page,
  request,
}) => {
  skipWhenNoRealContent();

  const sitemapResponse = await request.get("/sitemap.xml");
  expect(sitemapResponse.ok()).toBeTruthy();

  const urls = extractLocs(await sitemapResponse.text());
  const pathnames = urls.map((url) => new URL(url).pathname);
  const photoUrls = pathnames.filter((pathname) => pathname.startsWith("/photo/"));

  expect(photoUrls.length).toBeGreaterThanOrEqual(22);
  expect(pathnames.some((pathname) => pathname.startsWith("/collections"))).toBe(false);

  const pathname = photoUrls[0];
  const response = await page.goto(new URL(pathname, siteOrigin).toString());
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expectCanonical(page, pathname);
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
    revalidated: ["/", "/about", "/contact"],
    type: "siteSettings",
  });
});
