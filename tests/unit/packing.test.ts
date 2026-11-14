import { describe, expect, it } from "vitest";
import { packingList } from "../../src/config/packing-list";
import { event } from "../../src/config/site";
import {
  parseChecked,
  progress,
  serializeChecked,
} from "../../src/lib/packing";

const ids = ["a", "b", "c"];

describe("progress", () => {
  it("counts only known ids and rounds the percentage", () => {
    expect(progress(new Set(["a", "x"]), ids)).toEqual({
      done: 1,
      total: 3,
      percent: 33,
    });
  });

  it("is 100% when everything is ticked", () => {
    expect(progress(new Set(ids), ids).percent).toBe(100);
  });

  it("is 0% for an empty list", () => {
    expect(progress(new Set(), [])).toEqual({ done: 0, total: 0, percent: 0 });
  });
});

describe("parseChecked", () => {
  it("returns an empty set for missing or broken values", () => {
    for (const raw of [null, "", "{", '{"a":true}', "42", "null"]) {
      expect(parseChecked(raw, ids).size).toBe(0);
    }
  });

  it("drops ids that are no longer on the list and non-strings", () => {
    expect([...parseChecked('["a","gone",3,"c"]', ids)]).toEqual(["a", "c"]);
  });

  it("round-trips with serializeChecked in list order", () => {
    const raw = serializeChecked(new Set(["c", "a"]), ids);
    expect(raw).toBe('["a","c"]');
    expect(parseChecked(raw, ids)).toEqual(new Set(["a", "c"]));
  });
});

describe("packing list config", () => {
  const ids = packingList.categories.flatMap((category) =>
    category.items.map((item) => item.id),
  );

  it("has unique, url-safe item ids", () => {
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9-]+$/);
  });

  it("has no empty categories", () => {
    for (const category of packingList.categories) {
      expect(category.items.length).toBeGreaterThan(0);
    }
  });

  it("stores ticks per edition", () => {
    expect(packingList.storageKey).toContain(String(event.year));
  });
});
