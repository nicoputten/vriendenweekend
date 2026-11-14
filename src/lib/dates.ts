const TIME_ZONE = "Europe/Brussels";

const dayMonth = new Intl.DateTimeFormat("nl-NL", {
  day: "numeric",
  month: "long",
  timeZone: TIME_ZONE,
});

const weekdayDayMonth = new Intl.DateTimeFormat("nl-NL", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: TIME_ZONE,
});

const year = new Intl.DateTimeFormat("nl-NL", {
  year: "numeric",
  timeZone: TIME_ZONE,
});

/** "13 – 16 augustus 2027", or "30 juli – 2 augustus 2027" across month boundaries. */
export function formatDateRange(start: Date, end: Date): string {
  const startParts = dayMonth.formatToParts(start);
  const endParts = dayMonth.formatToParts(end);
  const month = (parts: Intl.DateTimeFormatPart[]) =>
    parts.find((p) => p.type === "month")?.value;
  const day = (parts: Intl.DateTimeFormatPart[]) =>
    parts.find((p) => p.type === "day")?.value;

  const startText =
    month(startParts) === month(endParts)
      ? day(startParts)
      : dayMonth.format(start);
  return `${startText} – ${dayMonth.format(end)} ${year.format(end)}`;
}

/** "maandag 30 november" */
export function formatLongDate(date: Date): string {
  return weekdayDayMonth.format(date);
}

/** Number of nights between arrival and departure, based on calendar days. */
export function nights(start: Date, end: Date): number {
  const toDay = (d: Date) => {
    const iso = new Intl.DateTimeFormat("en-CA", {
      timeZone: TIME_ZONE,
    }).format(d);
    return Date.parse(`${iso}T00:00:00Z`);
  };
  return Math.round((toDay(end) - toDay(start)) / 86_400_000);
}

/** Amount in euros, without cents for whole amounts: "€ 250". */
export function formatEuro(amount: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

const dayMonthYear = new Intl.DateTimeFormat("nl-NL", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: TIME_ZONE,
});

/** "30 november 2026" */
export function formatDate(date: Date): string {
  return dayMonthYear.format(date);
}

/** "13–16 augustus 2027" (no spaces around the dash, for compact labels). */
export function formatDateRangeCompact(start: Date, end: Date): string {
  return formatDateRange(start, end).replace(" – ", "–");
}
