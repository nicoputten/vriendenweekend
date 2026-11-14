import { expect, test } from "@playwright/test";
import { nav } from "../../src/config/site";

test.describe("navigation", () => {
  for (const item of nav) {
    test(`${item.label} is reachable from the menu`, async ({ page }) => {
      await page.goto("/");
      const menu = page.locator("details.menu");
      if (!(await menu.evaluate((el: HTMLDetailsElement) => el.open))) {
        await page.getByText("Menu", { exact: true }).click();
      }
      await page
        .getByRole("navigation", { name: "Hoofdmenu" })
        .locator(`a[href="${item.href}"]`)
        .click();
      await expect(page).toHaveURL(
        new RegExp(`${item.href === "/" ? "/$" : item.href}$`),
      );
      if (item.status === "binnenkort") {
        await expect(
          page.getByText("Binnenkort", { exact: true }),
        ).toBeVisible();
      }
    });
  }

  test("unknown page returns the 404 page", async ({ page }) => {
    const response = await page.goto("/bestaat-niet");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Deze pagina bestaat niet",
    );
  });
});
