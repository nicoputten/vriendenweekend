import { describe, expect, it } from "vitest";
import { faq } from "../../src/config/faq";

const items = faq.flatMap((group) => group.items);

describe("faq config", () => {
  it("has unique, URL-safe anchors", () => {
    const ids = items.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it("has no empty groups, questions or answers", () => {
    for (const group of faq) expect(group.items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(item.question.trim()).not.toBe("");
      expect(item.answer.length).toBeGreaterThan(0);
      for (const text of item.answer) expect(text.trim()).not.toBe("");
    }
  });

  it("covers the topics the group asks about", () => {
    const ids = items.map((item) => item.id);
    for (const topic of [
      "kosten",
      "deadline",
      "overschot",
      "carpoolen",
      "slaapkamers",
      "huisregels",
      "namen",
    ]) {
      expect(ids).toContain(topic);
    }
  });

  it("fills in amount and deadline from the site config", () => {
    const text = (id: string) =>
      items.find((item) => item.id === id)?.answer.join(" ");
    expect(text("kosten")).toContain("€250");
    expect(text("deadline")).toContain("30 november 2026");
  });

  it("only links to pages on this site", () => {
    for (const item of items) {
      if (item.link) expect(item.link.href.startsWith("/")).toBe(true);
    }
  });
});
