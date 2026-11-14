import { describe, expect, it } from "vitest";
import { programme } from "../../src/config/programme";
import { event } from "../../src/config/site";

const dayOf = (iso: string) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Brussels" }).format(
    new Date(iso),
  );

describe("programme config", () => {
  it("covers every day from arrival to departure, in order", () => {
    const dates = programme.days.map((d) => d.date);
    expect(dates[0]).toBe(dayOf(event.start));
    expect(dates.at(-1)).toBe(dayOf(event.end));
    expect([...dates].sort()).toEqual(dates);
  });

  it("uses weekday names that match the dates", () => {
    const weekday = new Intl.DateTimeFormat("nl-NL", {
      weekday: "long",
      timeZone: "UTC",
    });
    for (const day of programme.days) {
      const name = weekday.format(new Date(`${day.date}T12:00:00Z`));
      expect(day.day.toLowerCase()).toBe(name);
    }
  });

  it("only has cooking evenings on days in the programme", () => {
    const days = programme.days.map((d) => d.day as string);
    for (const evening of programme.cooking.evenings)
      expect(days).toContain(evening);
  });
});
