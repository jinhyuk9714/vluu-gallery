import { expect, test } from "@playwright/test";

test("desktop hero shows one full-screen featured image at a time", async ({ page }) => {
  await page.goto("/");

  const visibleSlides = await page.evaluate(() => {
    const hero = document.querySelector('[data-testid="home-hero"]');
    if (!(hero instanceof HTMLElement)) {
      return 0;
    }

    const heroRect = hero.getBoundingClientRect();
    const slides = Array.from(hero.querySelectorAll('[data-testid="hero-slide"]'));

    return slides.filter((slide) => {
      const rect = slide.getBoundingClientRect();
      const overlapsHero =
        rect.right > heroRect.left &&
        rect.left < heroRect.right &&
        rect.bottom > heroRect.top &&
        rect.top < heroRect.bottom &&
        rect.width > 0 &&
        rect.height > 0;

      return overlapsHero;
    }).length;
  });

  expect(visibleSlides).toBe(1);
});

test("desktop hero autoplay advances to the next featured collection", async ({ page }) => {
  await page.goto("/");
  await page.bringToFront();
  await expect
    .poll(() => page.evaluate(() => document.visibilityState), {
      timeout: 5_000,
    })
    .toBe("visible");

  const title = page.getByTestId("hero-title");
  const firstTitle = await title.textContent();
  await expect
    .poll(async () => title.textContent(), {
      timeout: 15_000,
      intervals: [6_500, 1_500, 1_500],
    })
    .not.toBe(firstTitle);
});

test("featured collection buttons switch the active hero slide", async ({ page }) => {
  await page.goto("/");

  const title = page.getByTestId("hero-title");
  const titleBefore = await title.textContent();
  await page.getByRole("button", { name: /open featured collection/i }).nth(1).click();
  await expect(title).not.toHaveText(titleBefore ?? "");

  const titleAfter = await title.textContent();

  expect(titleAfter).not.toBe(titleBefore);
});
