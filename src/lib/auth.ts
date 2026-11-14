/**
 * Pure helpers for the login flow. Kept free of DOM access so they can be
 * unit tested; `src/scripts/session.ts` wires them up in the browser.
 */
import { auth, loginPage } from "../config/auth";

export type ProviderId = (typeof auth.providers)[number]["id"];
export type LoginError = keyof typeof loginPage.errors;

/** What oauth2-proxy returns on `/oauth2/userinfo` for a logged-in visitor. */
export interface User {
  email: string;
  /** Short name for the header: the part of the email before the @. */
  name: string;
}

/**
 * Only allow redirects to a path on this site, so `?rd=` cannot be used to
 * send people to another domain after logging in.
 */
export function safeRedirect(rd: string | null | undefined): string {
  if (!rd || !rd.startsWith("/") || rd.startsWith("//") || rd.includes("\\")) {
    return "/";
  }
  // Never bounce back to the login page itself.
  if (rd === auth.loginPath || rd.startsWith(`${auth.loginPath}?`)) return "/";
  return rd;
}

/** Link that starts the OAuth flow for one provider and returns to `rd`. */
export function loginUrl(provider: ProviderId, rd?: string | null): string {
  const params = new URLSearchParams({
    rd: safeRedirect(rd),
    connector_id: provider,
  });
  return `${auth.proxyPrefix}/start?${params}`;
}

/** Link to the login page that returns to `rd` afterwards. */
export function loginPageUrl(rd?: string | null): string {
  const target = safeRedirect(rd);
  return target === "/"
    ? auth.loginPath
    : `${auth.loginPath}?${new URLSearchParams({ rd: target })}`;
}

export const logoutUrl = `${auth.proxyPrefix}/sign_out?rd=%2F`;

export const userInfoUrl = `${auth.proxyPrefix}/userinfo`;

/** Parses the `/oauth2/userinfo` response; `null` if it has no usable email. */
export function parseUserInfo(data: unknown): User | null {
  if (typeof data !== "object" || data === null) return null;
  const email = (data as { email?: unknown }).email;
  if (typeof email !== "string" || !email.includes("@")) return null;
  return { email, name: email.slice(0, email.indexOf("@")) };
}

/**
 * Session state as the header shows it:
 * - `in`: logged in
 * - `out`: login is available but nobody is logged in
 * - `off`: no login service behind this site (local preview, or not deployed yet)
 */
export type SessionState = "in" | "out" | "off";

export function sessionStateFromStatus(status: number): SessionState {
  if (status >= 200 && status < 300) return "in";
  if (status === 401 || status === 403) return "out";
  return "off";
}

/** Dutch error message for `/inloggen?fout=…`, or `null` for an unknown code. */
export function loginErrorMessage(code: string | null): string | null {
  if (!code || !Object.hasOwn(loginPage.errors, code)) return null;
  return loginPage.errors[code as LoginError];
}
