/**
 * "Paklijst" (US-011): items per category, ticked off and remembered in the
 * visitor's browser.
 */
import { event } from "./site";

export interface PackingItem {
  /**
   * Stable key, used to remember the tick in the browser.
   * Never reuse or rename an id, or people lose their ticks.
   */
  id: string;
  label: string;
  hint?: string;
}

export const packingList = {
  kicker: "Niks vergeten",
  intro:
    "Vink af wat je al hebt ingepakt. Je vinkjes worden alleen op dit apparaat bewaard.",
  /** localStorage key; contains the year so a new edition starts empty. */
  storageKey: `paklijst-${event.year}`,
  categories: [
    {
      name: "Belangrijk",
      items: [
        { id: "id-card", label: "Identiteitskaart of paspoort" },
        { id: "health-card", label: "Zorgpas (met EHIC op de achterkant)" },
        { id: "phone", label: "Telefoon en oplader" },
        { id: "medicine", label: "Eigen medicijnen" },
      ],
    },
    {
      name: "Slapen",
      items: [
        {
          id: "bedding",
          label: "Beddengoed of slaapzak",
          hint: "Check bij Het chateau zodra bekend",
        },
        { id: "towels", label: "Handdoeken" },
        {
          id: "earplugs",
          label: "Oordopjes",
          hint: "Er wordt gesnurkt, beloofd",
        },
      ],
    },
    {
      name: "Kleding",
      items: [
        { id: "hiking-shoes", label: "Wandelschoenen" },
        { id: "rain-jacket", label: "Regenjas", hint: "Het zijn de Ardennen" },
        { id: "sweater", label: "Warme trui voor de avond" },
        {
          id: "swimwear",
          label: "Zwemspullen",
          hint: "Als het chateau een zwembad of sauna heeft",
        },
      ],
    },
    {
      name: "Gezelligheid",
      items: [
        {
          id: "board-game",
          label: "Je favoriete bordspel",
          hint: "Zet het in de groepsapp, dan nemen we geen vijf keer Catan mee",
        },
        {
          id: "special-beer",
          label: "Een bijzonder biertje om te delen",
          hint: "Optioneel, de drank zit al in de pot",
        },
        { id: "speaker", label: "Speaker" },
      ],
    },
  ],
} as const satisfies {
  kicker: string;
  intro: string;
  storageKey: string;
  categories: readonly { name: string; items: readonly PackingItem[] }[];
};
