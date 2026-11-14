import { describe, expect, it } from "vitest";
import { countdown } from "../../src/lib/countdown";

describe("countdown", () => {
  const target = new Date("2027-08-13T16:00:00+02:00");

  it("splits the difference into days, hours, minutes and seconds", () => {
    const now = new Date(
      target.getTime() - (2 * 86_400 + 3 * 3_600 + 4 * 60 + 5) * 1000,
    );
    expect(countdown(target, now)).toEqual({
      days: 2,
      hours: 3,
      minutes: 4,
      seconds: 5,
      done: false,
    });
  });

  it("is done at the target moment", () => {
    expect(countdown(target, target).done).toBe(true);
  });

  it("never returns negative values after the target moment", () => {
    const later = new Date(target.getTime() + 60_000);
    expect(countdown(target, later)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      done: true,
    });
  });
});
