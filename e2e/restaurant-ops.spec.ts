import { expect, test } from "@playwright/test";

test("marking an order ready offers Undo", async ({ page }) => {
  await page.goto("/apps/restaurant-ops");

  await page.getByRole("button", { name: "Mark ready" }).first().click();

  await expect(page.getByRole("button", { name: "Undo" })).toBeVisible();
});
