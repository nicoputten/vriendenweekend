/**
 * Asks oauth2-proxy who is logged in and shows the matching parts of the page.
 *
 * Elements with `data-session-show="in" | "out"` start hidden and are shown
 * when the state matches. `data-user-name` / `data-user-email` get the user's
 * details, and `data-login-link` points to the login page with a way back to
 * the current page. Without a login service (`off`) everything stays hidden,
 * so a deploy without oauth2-proxy shows no broken login button.
 */
import {
  loginPageUrl,
  parseUserInfo,
  sessionStateFromStatus,
  userInfoUrl,
  type SessionState,
  type User,
} from "../lib/auth";

async function fetchSession(): Promise<{
  state: SessionState;
  user: User | null;
}> {
  try {
    const response = await fetch(userInfoUrl, {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    });
    let state = sessionStateFromStatus(response.status);
    let user: User | null = null;
    if (state === "in") {
      user = parseUserInfo(await response.json().catch(() => null));
      // A 2xx without JSON means something else answered (for example a dev server).
      if (!user) state = "off";
    }
    return { state, user };
  } catch {
    return { state: "off", user: null };
  }
}

function render(state: SessionState, user: User | null) {
  document.documentElement.dataset.session = state;
  document
    .querySelectorAll<HTMLElement>("[data-session-show]")
    .forEach((el) => {
      el.hidden = el.dataset.sessionShow !== state;
    });
  document.querySelectorAll<HTMLElement>("[data-user-name]").forEach((el) => {
    el.textContent = user?.name ?? "";
  });
  document.querySelectorAll<HTMLElement>("[data-user-email]").forEach((el) => {
    el.textContent = user?.email ?? "";
  });
  const here = `${location.pathname}${location.search}`;
  document
    .querySelectorAll<HTMLAnchorElement>("a[data-login-link]")
    .forEach((a) => {
      a.href = loginPageUrl(here);
    });
}

void fetchSession().then(({ state, user }) => render(state, user));
