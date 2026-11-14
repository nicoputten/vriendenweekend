import { expect, test } from "@playwright/test";

test.describe("home", () => {
  test("shows title, dates and countdown", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Vriendenweekend 2027");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Vriendenweekend 2027",
    );
    await expect(page.getByText("13 – 16 augustus 2027")).toBeVisible();
    await expect(
      page.getByRole("region", { name: "Nog te gaan" }),
    ).toBeVisible();
  });

  test("shows the amount and payment deadline", async ({ page }) => {
    await page.goto("/");
    const pay = page.getByRole("region", { name: "Betaal je bijdrage" });
    await expect(pay).toContainText("250");
    await expect(pay).toContainText("maandag 30 november");
  });

  test("pay button links to bunq.me", async ({ page }) => {
    await page.goto("/");
    const button = page.getByRole("link", { name: /Betaal .*250 via bunq/ });
    await expect(button).toHaveAttribute("href", /^https:\/\/bunq\.me\//);
    await expect(button).toHaveAttribute("target", "_blank");
  });

  test("fits a narrow screen without horizontal scrolling", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto("/");
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
