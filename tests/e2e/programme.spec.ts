import { expect, test } from "@playwright/test";
import { programme } from "../../src/config/programme";

test.describe("programme", () => {
  test("shows every day with its items", async ({ page }) => {
    await page.goto("/programma");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Programma",
    );
    for (const day of programme.days) {
      const card = page.locator("article").filter({
        has: page.getByRole("heading", { name: day.day, exact: true }),
      });
      await expect(card).toBeVisible();
      for (const item of day.items) await expect(card).toContainText(item.what);
    }
  });

  test("names the quiz on Saturday evening", async ({ page }) => {
    await page.goto("/programma");
    await expect(
      page.getByText("Vriendenweekend Quiz by Suus & Nico"),
    ).toBeVisible();
  });

  test("lists the cooking evenings without participant sign-up yet", async ({
    page,
  }) => {
    await page.goto("/programma");
    const cooking = page.getByRole("region", { name: "Kookploegen" });
    await expect(cooking.getByRole("listitem")).toHaveCount(
      programme.cooking.evenings.length,
    );
    await expect(cooking).toContainText("Aanmelden kan straks na inloggen");
    await expect(cooking.getByRole("button")).toHaveCount(0);
  });
});
