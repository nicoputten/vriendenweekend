/**
 * Central site configuration. Everything that changes per edition lives here,
 * so pages and components never hardcode dates, amounts or copy that is
 * specific to this year.
 */
import type { IconName } from "../components/icons";

export type PageStatus = "live" | "binnenkort";

export interface NavItem {
  href: string;
  label: string;
  /** Longer label for the mobile menu, if different. */
  menuLabel?: string;
  icon: IconName;
  status: PageStatus;
}

export const event = {
  title: "Vriendenweekend",
  year: 2027,
  intro:
    "Drie nachten in een chateau in de Ardennen, met meer bier dan verstandig is. Eerst vullen we de pot, dan wordt er geboekt.",
  /** Arrival, local time (Europe/Brussels). */
  start: "2027-08-13T16:00:00+02:00",
  /** Departure, local time (Europe/Brussels). */
  end: "2027-08-16T11:00:00+02:00",
  region: "Ardennen",
  /** What we call the rental house everywhere on the site. */
  houseName: "het chateau",
  bookingVia: "Ardennes Etape",
  groupSize: "12 à 13",
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
  summary:
    "Eén bedrag voor het chateau, al het eten en heel veel bier. Zodra iedereen betaald heeft, wordt er geboekt.",
  tips: [
    "Zet je naam in de omschrijving, dan kan ik je afvinken.",
    "Geen bunq? Betalen kan ook met iDEAL.",
  ],
} as const;

/** "Waar gaat je €250 naartoe?" */
export const pot = {
  items: [
    {
      icon: "house",
      title: "Het chateau",
      text: "Drie nachten in ons eigen chateau in de Ardennen, geboekt via Ardennes Etape.",
      tone: "green",
    },
    {
      icon: "food",
      title: "Eten",
      text: "Ontbijt, lunch en de boodschappen voor de kookavonden.",
      tone: "green",
    },
    {
      icon: "beer",
      title: "Drank",
      text: "Heel veel bier (inclusief een fust), rum, wijn en fris.",
      tone: "amber",
    },
  ],
  footnote:
    "En dat is nog niet alles: snacks, ontbijtspul en wat er verder nodig is komt ook uit de pot.",
} as const satisfies {
  items: readonly {
    icon: IconName;
    title: string;
    text: string;
    tone: "green" | "amber";
  }[];
  footnote: string;
};

/** "Hoe het werkt": the plan from paying to leaving. `current` marks the active step. */
export const steps = [
  {
    title: "Iedereen betaalt",
    text: "€250 via bunq, vóór 30 november.",
    current: true,
  },
  {
    title: "Het chateau wordt geboekt",
    text: "Via Ardennes Etape, begin december.",
  },
  {
    title: "Alle info komt online",
    text: "Foto's, adres, kamers en tips in de buurt.",
  },
  { title: "13 augustus: op naar de Ardennen", text: "Bier koud, quiz klaar." },
] as const satisfies readonly {
  title: string;
  text: string;
  current?: boolean;
}[];

export const nav: NavItem[] = [
  { href: "/", label: "Home", icon: "home", status: "live" },
  { href: "/huis", label: "Het chateau", icon: "house", status: "binnenkort" },
  {
    href: "/locatie",
    label: "Locatie & reizen",
    icon: "pin",
    status: "binnenkort",
  },
  {
    href: "/in-de-buurt",
    label: "In de buurt",
    icon: "compass",
    status: "binnenkort",
  },
  {
    href: "/programma",
    label: "Programma",
    icon: "calendar",
    status: "live",
  },
  { href: "/paklijst", label: "Paklijst", icon: "bag", status: "binnenkort" },
  {
    href: "/faq",
    label: "Vragen",
    menuLabel: "Vragen (FAQ)",
    icon: "question",
    status: "live",
  },
];

export const footer = {
  note: "Vragen? Stel ze in de groepsapp.",
} as const;
