import { test, expect } from "@playwright/test";

test("Go to home page", async ({ page }) => {
  await page.goto("http://apigateway/");

  await page.waitForLoadState("networkidle");
  await expect(page.getByText("LA NOUVELLE ÈRE DU DASHBOARDING")).toBeVisible();
});

test("Test an URL", async ({ page }) => {
  await page.goto("http://apigateway/");
  await page.getByPlaceholder("Tester une URL...").click();
  await page
    .getByPlaceholder("Tester une URL...")
    .fill("https://www.google.fr/");
  await page.getByRole("button").nth(1).click();
  await expect(page.locator(".card__content")).toBeVisible();
});
