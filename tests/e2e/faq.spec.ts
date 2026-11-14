import { expect, test } from "@playwright/test";
import { faq } from "../../src/config/faq";

test.describe("faq", () => {
  test("shows every group and question", async ({ page }) => {
    await page.goto("/faq");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Vragen");
    for (const group of faq) {
      await expect(
        page.getByRole("heading", { level: 2, name: group.title }),
      ).toBeVisible();
      for (const item of group.items) {
        await expect(page.locator(`#${item.id} summary`)).toContainText(
          item.question,
        );
      }
    }
  });

  test("first question is open, clicking opens another one", async ({
    page,
  }) => {
    await page.goto("/faq");
    const first = page.locator("#kosten");
    await expect(first).toHaveAttribute("open", "");
    await expect(
      first.getByText("Reiskosten zitten er niet bij"),
    ).toBeVisible();

    const carpool = page.locator("#carpoolen");
    await expect(carpool.locator(".answer")).toBeHidden();
    await carpool.locator("summary").click();
    await expect(carpool.locator(".answer")).toBeVisible();
    await expect(carpool.getByText("Binnenkort")).toBeVisible();
  });

  test("a link to a question opens it", async ({ page }) => {
    await page.goto("/faq#huisregels");
    await expect(page.locator("#huisregels .answer")).toBeVisible();
  });

  test("questions expand without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto("/faq");
    const rooms = page.locator("#slaapkamers");
    await rooms.locator("summary").click();
    await expect(rooms.locator(".answer")).toBeVisible();
    await context.close();
  });

  test("links to paying", async ({ page }) => {
    await page.goto("/faq");
    await page
      .getByRole("complementary")
      .getByRole("link", { name: "Naar betalen" })
      .click();
    await expect(page).toHaveURL(/\/#betalen$/);
  });

  test("fits a narrow screen without horizontal scrolling", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto("/faq");
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
