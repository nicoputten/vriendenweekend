/**
 * Questions and answers for the "Vragen" (FAQ) page, grouped by topic.
 * Amounts, dates and names come from `site.ts`, so a new edition only
 * changes the config there. Answers that depend on the booked house are
 * marked `soon` and show a "Binnenkort" label until they are filled in.
 */
import { event, payment } from "./site";
import { formatDate, formatEuro } from "../lib/dates";

export interface FaqItem {
  /** Stable anchor, so a question can be linked from the group chat: /faq#<id>. */
  id: string;
  question: string;
  /** One or more paragraphs. */
  answer: readonly string[];
  /** Answer depends on the booking and is not final yet. */
  soon?: boolean;
  /** Optional link shown under the answer. */
  link?: { href: string; label: string };
}

export interface FaqGroup {
  title: string;
  items: readonly FaqItem[];
}

const amount = formatEuro(payment.amountEur).replace(/\s/g, "");
const deadline = formatDate(new Date(payment.deadline));
const house = event.houseName;

export const faq: readonly FaqGroup[] = [
  {
    title: "Betalen",
    items: [
      {
        id: "kosten",
        question: "Hoeveel kost het en wat zit erbij?",
        answer: [
          `${amount} per persoon. Daarvan betalen we ${house}, al het eten en heel veel bier (inclusief een fust), rum, wijn en fris. Snacks en ontbijt komen ook uit de pot.`,
          "Reiskosten zitten er niet bij: die regel je onderling met je carpool.",
        ],
      },
      {
        id: "deadline",
        question: "Tot wanneer kan ik betalen?",
        answer: [
          `Tot en met ${deadline}, via bunq.me. Daarna wordt ${house} geboekt bij ${event.bookingVia}.`,
        ],
        link: { href: "/#betalen", label: "Naar betalen" },
      },
      {
        id: "betaling-binnen",
        question: "Hoe weet ik of mijn betaling binnen is?",
        answer: [
          "Zet je naam in de omschrijving van je bunq-betaling, dan vink ik je af. Geen bunq? Betalen kan ook met iDEAL.",
        ],
      },
      {
        id: "overschot",
        question: "Wat gebeurt er als er geld overblijft?",
        answer: [
          "Na het weekend maken we de rekening op. Blijft er geld over, dan gaat dat naar de pot voor het vriendenweekend van volgend jaar.",
        ],
      },
    ],
  },
  {
    title: "Reizen",
    items: [
      {
        id: "carpoolen",
        question: "Kunnen we carpoolen?",
        answer: [
          "Ja, maar dat regel je zelf onderling. Spreek in de groepsapp af wie met wie meerijdt en hoe jullie de reiskosten delen.",
        ],
      },
    ],
  },
  {
    title: "Het chateau",
    items: [
      {
        id: "slaapkamers",
        question: "Hoe worden de slaapkamers verdeeld?",
        answer: [
          `Dat bepalen we zodra we weten welke kamers en bedden ${house} heeft.`,
        ],
        soon: true,
      },
      {
        id: "huisregels",
        question: "Wat zijn de huisregels?",
        answer: [
          "De regels van de verhuurder plus onze eigen afspraken (zoals: wie kookt, hoeft niet af te wassen). Volgt na de boeking.",
        ],
        soon: true,
      },
    ],
  },
  {
    title: "Overig",
    items: [
      {
        id: "namen",
        question: "Wie kan de namen van deelnemers zien?",
        answer: [
          "Op deze site staan geen namen. Komt er later een inlog, dan zien alleen ingelogde deelnemers wie er bijvoorbeeld kookt. Wie er betaald heeft, ziet alleen de beheerder.",
        ],
      },
    ],
  },
];
