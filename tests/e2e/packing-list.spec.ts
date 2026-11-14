import { expect, test } from "@playwright/test";
import { packingList } from "../../src/config/packing-list";

const total = packingList.categories.reduce(
  (sum, category) => sum + category.items.length,
  0,
);

test.describe("packing list", () => {
  test("shows every category and item, nothing ticked yet", async ({
    page,
  }) => {
    await page.goto("/paklijst");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Paklijst",
    );
    for (const category of packingList.categories) {
      const group = page.getByRole("region", { name: category.name });
      await expect(group.getByRole("checkbox")).toHaveCount(
        category.items.length,
      );
    }
    await expect(page.getByText(`0 van ${total} ingepakt`)).toBeVisible();
    await expect(
      page.getByRole("progressbar", { name: "Voortgang paklijst" }),
    ).toHaveAttribute("aria-valuenow", "0");
    await expect(
      page.locator("main").getByText("Binnenkort", { exact: true }),
    ).toHaveCount(0);
  });

  test("ticking updates the progress and is remembered after a reload", async ({
    page,
  }) => {
    await page.goto("/paklijst");
    const [first, second] = packingList.categories[0].items;
    const box = page.getByRole("checkbox", { name: first.label });
    // Tapping the text checks the box too: the whole row is the label.
    await page.getByText(first.label, { exact: true }).click();
    await expect(box).toBeChecked();
    await page.getByRole("checkbox", { name: second.label }).check();

    const percent = String(Math.round((2 / total) * 100));
    await expect(page.getByText(`2 van ${total} ingepakt`)).toBeVisible();
    await expect(page.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      percent,
    );

    await page.reload();
    await expect(box).toBeChecked();
    await expect(
      page.getByRole("checkbox", { name: second.label }),
    ).toBeChecked();
    await expect(page.getByText(`2 van ${total} ingepakt`)).toBeVisible();

    await box.uncheck();
    await page.reload();
    await expect(box).not.toBeChecked();
    await expect(page.getByText(`1 van ${total} ingepakt`)).toBeVisible();
  });

  test("ignores a broken stored value", async ({ page }) => {
    await page.addInitScript((key) => {
      localStorage.setItem(key, "{not json");
    }, packingList.storageKey);
    await page.goto("/paklijst");
    await expect(page.getByText(`0 van ${total} ingepakt`)).toBeVisible();
    await expect(page.getByRole("checkbox", { checked: true })).toHaveCount(0);
  });
});
