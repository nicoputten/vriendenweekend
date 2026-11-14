import { describe, expect, it } from "vitest";
import { auth, loginPage, membersPage } from "../../src/config/auth";
import { icons } from "../../src/components/icons";
import {
  loginErrorMessage,
  loginPageUrl,
  loginUrl,
  logoutUrl,
  parseUserInfo,
  safeRedirect,
  sessionStateFromStatus,
} from "../../src/lib/auth";

describe("safeRedirect", () => {
  it("keeps paths on this site", () => {
    expect(safeRedirect("/leden")).toBe("/leden");
    expect(safeRedirect("/programma?dag=zaterdag#avond")).toBe(
      "/programma?dag=zaterdag#avond",
    );
  });

  it.each([
    null,
    undefined,
    "",
    "https://evil.example.com",
    "//evil.example.com",
    "/\\evil.example.com",
    "javascript:alert(1)",
    "leden",
  ])("falls back to / for %s", (rd) => {
    expect(safeRedirect(rd)).toBe("/");
  });

  it("never returns to the login page itself", () => {
    expect(safeRedirect("/inloggen")).toBe("/");
    expect(safeRedirect("/inloggen?rd=/leden")).toBe("/");
  });
});

describe("loginUrl", () => {
  it("starts oauth2-proxy with the provider as Dex connector", () => {
    const url = new URL(loginUrl("google", "/leden"), "https://x.test");
    expect(url.pathname).toBe("/oauth2/start");
    expect(url.searchParams.get("connector_id")).toBe("google");
    expect(url.searchParams.get("rd")).toBe("/leden");
  });

  it("sanitises the redirect", () => {
    const url = new URL(loginUrl("microsoft", "//evil.test"), "https://x.test");
    expect(url.searchParams.get("rd")).toBe("/");
  });
});

describe("loginPageUrl", () => {
  it("links to the login page with a way back", () => {
    expect(loginPageUrl("/programma")).toBe("/inloggen?rd=%2Fprogramma");
  });

  it("drops the way back when it would be the home page anyway", () => {
    expect(loginPageUrl("/")).toBe("/inloggen");
    expect(loginPageUrl("https://evil.test")).toBe("/inloggen");
  });
});

describe("parseUserInfo", () => {
  it("reads the email from oauth2-proxy's userinfo", () => {
    expect(
      parseUserInfo({ user: "123", email: "sam@example.com", groups: [] }),
    ).toEqual({ email: "sam@example.com", name: "sam" });
  });

  it.each([null, "x", {}, { email: 3 }, { email: "geen-email" }])(
    "returns null for %j",
    (data) => {
      expect(parseUserInfo(data)).toBeNull();
    },
  );
});

describe("sessionStateFromStatus", () => {
  it("maps HTTP statuses to a session state", () => {
    expect(sessionStateFromStatus(200)).toBe("in");
    expect(sessionStateFromStatus(401)).toBe("out");
    expect(sessionStateFromStatus(403)).toBe("out");
    // No oauth2-proxy behind the site: hide the login button.
    expect(sessionStateFromStatus(404)).toBe("off");
    expect(sessionStateFromStatus(502)).toBe("off");
  });
});

describe("loginErrorMessage", () => {
  it("knows the errors Nginx redirects to", () => {
    expect(loginErrorMessage("geen-toegang")).toBe(
      loginPage.errors["geen-toegang"],
    );
    expect(loginErrorMessage("mislukt")).toBe(loginPage.errors.mislukt);
  });

  it("ignores unknown codes", () => {
    expect(loginErrorMessage(null)).toBeNull();
    expect(loginErrorMessage("toString")).toBeNull();
    expect(loginErrorMessage("<script>")).toBeNull();
  });
});

describe("auth config", () => {
  it("offers Google and Microsoft", () => {
    expect(auth.providers.map((p) => p.id)).toEqual(["google", "microsoft"]);
  });

  it("signs out back to the home page", () => {
    expect(logoutUrl).toBe("/oauth2/sign_out?rd=%2F");
  });

  it("uses only icons that exist on the members page", () => {
    for (const item of membersPage.soon)
      expect(icons).toHaveProperty(item.icon);
  });

  it("keeps the members area in sync with deploy/nginx.conf", async () => {
    const { readFile } = await import("node:fs/promises");
    const nginx = await readFile("deploy/nginx.conf", "utf8");
    expect(nginx).toContain(`location ~ ^${auth.membersPath}`);
    expect(nginx).toContain(`return 302 ${auth.loginPath}?rd=`);
    expect(nginx).toContain(`location ${auth.proxyPrefix}/ {`);
  });
});
