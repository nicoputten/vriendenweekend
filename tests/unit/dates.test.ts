import { describe, expect, it } from "vitest";
import {
  formatDateRange,
  formatEuro,
  formatLongDate,
  nights,
} from "../../src/lib/dates";

describe("formatDateRange", () => {
  it("mentions the month once within the same month", () => {
    expect(
      formatDateRange(
        new Date("2027-08-13T16:00:00+02:00"),
        new Date("2027-08-16T11:00:00+02:00"),
      ),
    ).toBe("13 – 16 augustus 2027");
  });

  it("mentions both months across a month boundary", () => {
    expect(
      formatDateRange(
        new Date("2027-07-30T16:00:00+02:00"),
        new Date("2027-08-02T11:00:00+02:00"),
      ),
    ).toBe("30 juli – 2 augustus 2027");
  });
});

describe("formatLongDate", () => {
  it("returns weekday, day and month in Dutch", () => {
    expect(formatLongDate(new Date("2026-11-30T23:59:59+01:00"))).toBe(
      "maandag 30 november",
    );
  });
});

describe("nights", () => {
  it("counts three nights from Friday to Monday", () => {
    expect(
      nights(
        new Date("2027-08-13T16:00:00+02:00"),
        new Date("2027-08-16T11:00:00+02:00"),
      ),
    ).toBe(3);
  });
});

describe("formatEuro", () => {
  it("omits cents for a whole amount", () => {
    expect(formatEuro(250).replace(/\s/g, " ")).toBe("€ 250");
  });

  it("shows cents for a fractional amount", () => {
    expect(formatEuro(12.5).replace(/\s/g, " ")).toBe("€ 12,50");
  });
});
