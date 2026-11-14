import { expect, test } from "@playwright/test";
import { nav } from "../../src/config/site";

/** Opens the mobile sheet if the desktop pill nav is hidden, and returns the visible nav. */
async function openNav(page: import("@playwright/test").Page) {
  const pill = page.getByRole("navigation", { name: "Hoofdmenu", exact: true });
  if (await pill.isVisible()) return pill;
  await page.getByRole("button", { name: "Menu openen" }).click();
  return page.getByRole("navigation", { name: "Hoofdmenu (mobiel)" });
}

test.describe("navigation", () => {
  for (const item of nav) {
    test(`${item.label} is reachable from the menu`, async ({ page }) => {
      await page.goto("/");
      const menu = await openNav(page);
      await menu.locator(`a[href="${item.href}"]`).click();
      await expect(page).toHaveURL(
        new RegExp(`${item.href === "/" ? "/$" : item.href}$`),
      );
      const active = (await openNav(page)).locator('a[aria-current="page"]');
      await expect(active).toHaveAttribute("href", item.href);
      if (item.status === "binnenkort") {
        await page.keyboard.press("Escape");
        await expect(
          page.locator("main").getByText("Binnenkort", { exact: true }),
        ).toBeVisible();
      }
    });
  }

  test("mobile menu opens, closes with the button and with Escape", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const open = page.getByRole("button", { name: "Menu openen" });
    const sheet = page.getByRole("navigation", { name: "Hoofdmenu (mobiel)" });
    await open.click();
    await expect(sheet).toBeVisible();
    await expect(open).toHaveAttribute("aria-expanded", "true");
    await page.getByRole("button", { name: "Menu sluiten" }).click();
    await expect(sheet).toBeHidden();
    await open.click();
    await page.keyboard.press("Escape");
    await expect(sheet).toBeHidden();
    await expect(open).toHaveAttribute("aria-expanded", "false");
  });

  test("coming-soon pages link back to paying", async ({ page }) => {
    await page.goto("/huis");
    await page.getByRole("link", { name: "Naar betalen" }).click();
    await expect(page).toHaveURL(/\/#betalen$/);
  });

  test("unknown page returns the 404 page", async ({ page }) => {
    const response = await page.goto("/bestaat-niet");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Deze pagina bestaat niet",
    );
  });
});
