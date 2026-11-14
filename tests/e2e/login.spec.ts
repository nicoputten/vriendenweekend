import { expect, test, type Page } from "@playwright/test";

/**
 * The static preview has no oauth2-proxy, so these tests fake
 * `/oauth2/userinfo`. The real login flow is covered by tests/auth/run.sh.
 */
async function mockUserInfo(page: Page, status: number, body?: object) {
  await page.route("**/oauth2/userinfo", (route) =>
    route.fulfill({
      status,
      contentType: "application/json",
      body: body ? JSON.stringify(body) : "",
    }),
  );
}

const isDesktop = (page: Page) =>
  page.getByRole("navigation", { name: "Hoofdmenu", exact: true }).isVisible();

async function openMenuIfMobile(page: Page) {
  if (!(await isDesktop(page))) {
    await page.getByRole("button", { name: "Menu openen" }).click();
  }
}

test.describe("login", () => {
  test("without a login service there is no login button", async ({ page }) => {
    await mockUserInfo(page, 404);
    await page.goto("/");
    await openMenuIfMobile(page);
    await expect(page.locator("html")).toHaveAttribute("data-session", "off");
    await expect(page.getByRole("link", { name: "Inloggen" })).toHaveCount(0);
  });

  test("logged out: the login button keeps the current page", async ({
    page,
  }) => {
    await mockUserInfo(page, 401);
    await page.goto("/programma");
    await openMenuIfMobile(page);
    const login = page.getByRole("link", { name: "Inloggen" });
    await expect(login).toBeVisible();
    await expect(login).toHaveAttribute("href", "/inloggen?rd=%2Fprogramma");
    await expect(page.getByRole("link", { name: "Uitloggen" })).toHaveCount(0);
  });

  test("logged in: shows who is logged in and a logout link", async ({
    page,
  }) => {
    await mockUserInfo(page, 200, { user: "1", email: "sam@example.com" });
    await page.goto("/");
    const footer = page.locator("footer");
    await expect(footer).toContainText("Ingelogd als sam@example.com");
    await expect(
      footer.getByRole("link", { name: "Uitloggen" }),
    ).toHaveAttribute("href", "/oauth2/sign_out?rd=%2F");

    await openMenuIfMobile(page);
    const account = (await isDesktop(page))
      ? page.getByRole("link", { name: "Ingelogd als sam" })
      : page.getByRole("link", { name: "Voor deelnemers" });
    await expect(account).toHaveAttribute("href", "/leden");
    await expect(page.getByRole("link", { name: "Inloggen" })).toHaveCount(0);
  });

  test("login page starts Google and Microsoft with the way back", async ({
    page,
  }) => {
    await mockUserInfo(page, 401);
    await page.goto("/inloggen?rd=%2Fleden");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Welkom terug",
    );
    for (const [name, id] of [
      ["Doorgaan met Google", "google"],
      ["Doorgaan met Microsoft", "microsoft"],
    ]) {
      await expect(page.getByRole("link", { name })).toHaveAttribute(
        "href",
        `/oauth2/start?rd=%2Fleden&connector_id=${id}`,
      );
    }
  });

  test("login page ignores a redirect to another site", async ({ page }) => {
    await mockUserInfo(page, 401);
    await page.goto("/inloggen?rd=https%3A%2F%2Fevil.example.com");
    await expect(
      page.getByRole("link", { name: "Doorgaan met Google" }),
    ).toHaveAttribute("href", "/oauth2/start?rd=%2F&connector_id=google");
  });

  test("login page explains a refused account in Dutch", async ({ page }) => {
    await mockUserInfo(page, 401);
    await page.goto("/inloggen?fout=geen-toegang");
    await expect(page.getByRole("alert")).toContainText(
      "Dit account staat niet op de gastenlijst",
    );
  });

  test("login page has no horizontal scroll on a small phone", async ({
    page,
  }) => {
    await mockUserInfo(page, 401);
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto("/inloggen");
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    expect(overflow).toBe(false);
  });
});
