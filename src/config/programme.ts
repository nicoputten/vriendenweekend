/**
 * Loose programme per day (US-010). Times are rough parts of the day until the
 * chateau is booked. Dates come from `event` in site.ts.
 */
export interface ProgrammeItem {
  /** Part of the day, e.g. "Ochtend". */
  when: string;
  what: string;
}

export interface ProgrammeDay {
  day: string;
  /** ISO date (Europe/Brussels) of this day. */
  date: string;
  items: ProgrammeItem[];
}

export const programme = {
  kicker: "13–16 augustus",
  intro:
    "Een losse planning: niks moet, alles mag. Tijden vullen we in zodra het chateau vastligt.",
  days: [
    {
      day: "Vrijdag",
      date: "2027-08-13",
      items: [
        { when: "Middag", what: "Aankomst, bedden verdelen, eerste biertje" },
        { when: "Avond", what: "Kookavond 1 en spellen op tafel" },
      ],
    },
    {
      day: "Zaterdag",
      date: "2027-08-14",
      items: [
        { when: "Ochtend", what: "Rustig ontbijt" },
        { when: "Middag", what: "Eropuit: wandelen, kajakken of luieren" },
        {
          when: "Avond",
          what: "Kookavond 2 en de Vriendenweekend Quiz by Suus & Nico",
        },
      ],
    },
    {
      day: "Zondag",
      date: "2027-08-15",
      items: [
        { when: "Ochtend", what: "Ontbijt en bijkomen" },
        { when: "Middag", what: "Vrije middag, tips onder In de buurt" },
        { when: "Avond", what: "Kookavond 3 en het laatste fust leegdrinken" },
      ],
    },
    {
      day: "Maandag",
      date: "2027-08-16",
      items: [
        { when: "Ochtend", what: "Ontbijt en samen opruimen" },
        { when: "Vertrek", what: "Tijd volgt (check-out van het chateau)" },
      ],
    },
  ] satisfies ProgrammeDay[],
  cooking: {
    intro:
      "Elke avond koken twee mensen voor de rest. De boodschappen betalen we uit de pot.",
    cooksPerEvening: 2,
    /** Days with a cooking evening, matching `day` above. */
    evenings: ["Vrijdag", "Zaterdag", "Zondag"],
    note: "Aanmelden kan straks na inloggen. Namen zie je alleen als je ingelogd bent.",
  },
} as const;
