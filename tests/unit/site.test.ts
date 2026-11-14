import { describe, expect, it } from "vitest";
import { event, nav, payment, steps } from "../../src/config/site";
import { icons } from "../../src/components/icons";

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

  it("prefills the payment amount in the bunq.me link", () => {
    if (payment.url) {
      const amount = new URL(payment.url).searchParams.get("amount");
      expect(Number(amount)).toBe(payment.amountEur);
    }
  });

  it("has unique nav links starting with /", () => {
    const hrefs = nav.map((item) => item.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const href of hrefs) expect(href.startsWith("/")).toBe(true);
  });

  it("uses only icons that exist", () => {
    for (const item of nav) expect(icons).toHaveProperty(item.icon);
  });

  it("marks exactly one step as current", () => {
    expect(
      steps.filter((step) => "current" in step && step.current),
    ).toHaveLength(1);
  });
});
