/**
 * Login (US-004). The site itself stays static: oauth2-proxy and Dex run next
 * to it and the browser asks `/oauth2/userinfo` who is logged in. Client IDs,
 * secrets and the list of allowed email addresses live only on the server.
 */

export interface LoginProvider {
  /** Dex connector ID, passed to oauth2-proxy as `connector_id`. */
  id: "google" | "microsoft";
  label: string;
}

export const auth = {
  /** Path prefix of oauth2-proxy, proxied by the site's own Nginx. */
  proxyPrefix: "/oauth2",
  loginPath: "/inloggen",
  /** Members-only area; Nginx sends visitors without a session to the login page. */
  membersPath: "/leden",
  providers: [
    { id: "google", label: "Doorgaan met Google" },
    { id: "microsoft", label: "Doorgaan met Microsoft" },
  ] as const satisfies readonly LoginProvider[],
} as const;

/** Copy of the login page ("/inloggen"). */
export const loginPage = {
  title: "Inloggen",
  heroTitle: "Welkom terug",
  heroText:
    "De informatie over het weekend is voor iedereen te zien. Ingelogd zie je straks ook de dingen die alleen voor de groep zijn.",
  perks: [
    "Je betaalstatus in één oogopslag",
    "Aanmelden voor de kookploegen",
    "Namen alleen zichtbaar voor ingelogde deelnemers",
  ],
  note: "Log in met het Google- of Microsoft-account van het e-mailadres dat je aan de beheerder hebt doorgegeven.",
  errors: {
    "geen-toegang":
      "Dit account staat niet op de gastenlijst. Vraag de beheerder in de groepsapp om je e-mailadres toe te voegen.",
    mislukt: "Inloggen is niet gelukt. Probeer het nog een keer.",
  },
} as const;

/** Copy of the members page ("/leden"). */
export const membersPage = {
  title: "Voor deelnemers",
  intro:
    "Hier komt alles wat alleen voor de groep is. Voorlopig staat er nog niet veel.",
  soon: [
    {
      icon: "check",
      title: "Betaalstatus",
      text: "Zie of je betaling binnen is.",
    },
    {
      icon: "food",
      title: "Kookploegen",
      text: "Meld je aan voor een kookavond, met z'n tweeën per avond.",
    },
    {
      icon: "house",
      title: "Adres van het chateau",
      text: "Zodra het chateau geboekt is.",
    },
  ],
} as const;
