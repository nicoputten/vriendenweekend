import { expect, test } from "@playwright/test";

test.describe("home", () => {
  test("shows title, dates and countdown", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Vriendenweekend 2027");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Vriendenweekend 2027",
    );
    await expect(
      page.getByText("Ardennen · 13–16 augustus 2027"),
    ).toBeVisible();
    const timer = page.getByRole("timer");
    await expect(timer).toBeVisible();
    await expect(
      page.getByText("Nog even geduld tot vrijdag 13 augustus"),
    ).toBeVisible();
  });

  test("countdown ticks in the browser", async ({ page }) => {
    await page.goto("/");
    const seconds = page.locator('[data-unit="seconds"]');
    const first = await seconds.textContent();
    await expect(seconds).not.toHaveText(first ?? "", { timeout: 3000 });
  });

  test("shows the amount, deadline and what the money covers", async ({
    page,
  }) => {
    await page.goto("/");
    const pay = page.getByRole("region", { name: "Doe mee" });
    await expect(pay).toContainText("€250");
    await expect(pay).toContainText("Uiterlijk 30 november 2026");
    await expect(pay).toContainText(/nog \d+ dagen/);
    const pot = page.getByRole("region", {
      name: "Waar gaat je €250 naartoe?",
    });
    for (const item of ["Het chateau", "Eten", "Drank"]) {
      await expect(pot.getByRole("heading", { name: item })).toBeVisible();
    }
  });

  test("pay button links to bunq.me", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("link", { name: /Betaal €250 via bunq/ });
    await expect(button).toHaveAttribute("href", /^https:\/\/bunq\.me\//);
    await expect(button).toHaveAttribute("target", "_blank");
  });

  test("fits a narrow screen without horizontal scrolling", async ({
    page,
  }) => {
    for (const path of ["/", "/huis"]) {
      await page.setViewportSize({ width: 360, height: 740 });
      await page.goto(path);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });
});
