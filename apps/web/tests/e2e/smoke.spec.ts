import { expect, test } from "@playwright/test";

test("homepage, collections, and contact render core editorial content", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /quiet city studies/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /browse collections/i })).toBeVisible();

  await page.goto("/collections");
  await expect(page.getByRole("heading", { name: /edited as sequences/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /seoul evenings/i })).toBeVisible();

  await page.goto("/contact");
  await expect(
    page.getByRole("main").getByRole("link", { name: /hello@example.com/i }),
  ).toBeVisible();
});

test("about, collection detail, photo detail, and missing routes render expected states", async ({ page }) => {
  await page.goto("/about");
  await expect(page.getByRole("heading", { name: /^about$/i })).toBeVisible();
  await expect(page.getByText(/small movements, quiet infrastructure/i)).toBeVisible();

  await page.goto("/collections/seoul-evenings");
  await expect(page.getByRole("heading", { name: /seoul evenings/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /han river blue hour/i })).toBeVisible();

  await page.goto("/photo/bridge-reflections");
  await expect(page.getByRole("heading", { name: /bridge reflections/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /seoul evenings/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /last train platform/i })).toBeVisible();

  const notFoundResponse = await page.goto("/missing-frame");
  expect(notFoundResponse?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: /this frame is not in the edit/i })).toBeVisible();
});
