/**
 * Central site configuration. Everything that changes per edition lives here,
 * so pages and components never hardcode dates or amounts.
 */

export type PageStatus = "live" | "binnenkort";

export interface NavItem {
  href: string;
  label: string;
  status: PageStatus;
}

export const event = {
  title: "Vriendenweekend 2027",
  tagline: "Een lang weekend bos, bier en bordspellen in de Ardennen.",
  /** Arrival, local time (Europe/Brussels). */
  start: "2027-08-13T16:00:00+02:00",
  /** Departure, local time (Europe/Brussels). */
  end: "2027-08-16T11:00:00+02:00",
  region: "Ardennen",
} as const;

export const payment = {
  amountEur: 250,
  /** Last moment to pay (inclusive). */
  deadline: "2026-11-30T23:59:59+01:00",
  /**
   * bunq.me link. Leave empty while the link is not final;
   * the pay button is then rendered disabled.
   */
  url: "https://bunq.me/vriendenardennen2027",
  covers: ["Huisje", "Eten", "Drinken"],
} as const;

export const nav: NavItem[] = [
  { href: "/", label: "Home", status: "live" },
  { href: "/huis", label: "Het huis", status: "binnenkort" },
  { href: "/locatie", label: "Locatie & reizen", status: "binnenkort" },
  { href: "/in-de-buurt", label: "In de buurt", status: "binnenkort" },
  { href: "/programma", label: "Programma", status: "binnenkort" },
  { href: "/paklijst", label: "Paklijst", status: "binnenkort" },
  { href: "/faq", label: "FAQ", status: "binnenkort" },
];
