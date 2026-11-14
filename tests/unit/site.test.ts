import { describe, expect, it } from "vitest";
import { event, nav, payment } from "../../src/config/site";

describe("site config", () => {
  it("has departure after arrival", () => {
    expect(Date.parse(event.end)).toBeGreaterThan(Date.parse(event.start));
  });

  it("has the payment deadline before the weekend", () => {
    expect(Date.parse(payment.deadline)).toBeLessThan(Date.parse(event.start));
  });

  it("only accepts a bunq.me payment link", () => {
    if (payment.url) {
      expect(payment.url).toMatch(/^https:\/\/bunq\.me\//);
    }
  });

  it("has unique nav links starting with /", () => {
    const hrefs = nav.map((item) => item.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const href of hrefs) expect(href.startsWith("/")).toBe(true);
  });
});
