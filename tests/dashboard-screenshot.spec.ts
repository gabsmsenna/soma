import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  // Wait for the Dashboard title to be visible to know the page has loaded
  await expect(page.locator("text=Dashboard Financeiro")).toBeVisible();

  // Basic screenshot of the dashboard
  await page.screenshot({
    path: "/home/jules/verification/dashboard.png",
    fullPage: true,
  });
});
