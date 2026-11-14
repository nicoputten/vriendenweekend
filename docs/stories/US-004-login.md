# US-004 Log in with Google or Microsoft

**Status:** In progress (on `develop`; needs the OAuth apps and a deploy on TrueNAS)
**Priority:** Should

As a **participant** I want **to log in with my Google or Microsoft account**, so that **I can see the things that are only for the group** (payment status, cooking sign-up, names, the address), while the general information stays easy to find.

## Decisions

- **Providers:** Google and Microsoft (personal and work or school accounts).
- **What is public:** all information pages stay public; only the members area (`/leden`, and later the API for US-005 and US-006) needs a login. Decided by the organiser on 2026-11-14 because nothing private is on the site yet and the payment deadline is close.

## Acceptance criteria

- [x] Login works with a Google or Microsoft account (`/inloggen`, one button per provider)
- [x] Only email addresses on an allow list get access; the list is not stored in the repo
- [x] Someone who is not on the list gets a clear Dutch message on the login page
- [x] Without a session, members-only pages redirect to the login page and back afterwards
- [x] The public pages, `/inloggen` and `/healthz` need no login
- [x] A session stays valid for at least a week (30 days)
- [x] The header shows who is logged in; a logout link in the footer
- [x] Without the login containers the site still works and shows no login button
- [ ] OAuth apps created at Google and Microsoft, and the login deployed on TrueNAS

## Technical design

```
Browser ──▶ reverse proxy (TLS) ──▶ site container (Nginx :8080)
                                      ├─ /            static pages (public)
                                      ├─ /leden       auth_request ─▶ oauth2-proxy /oauth2/auth
                                      ├─ /oauth2/…  ─▶ oauth2-proxy :4180 (session cookie, allow list)
                                      └─ /dex/…     ─▶ Dex :5556 (Google / Microsoft)
```

- [oauth2-proxy](https://oauth2-proxy.github.io/oauth2-proxy/) keeps the session in an encrypted cookie and checks the allow list (`allowed-emails.txt` on the TrueNAS dataset; edits apply without a restart).
- oauth2-proxy supports one identity provider, so [Dex](https://dexidp.io/) sits in between as a broker with a Google and a Microsoft connector. The login buttons pass `connector_id`, so people go straight to Google or Microsoft without an extra chooser page.
- The site stays static. The header asks `/oauth2/userinfo` who is logged in (`src/scripts/session.ts`).
- Config: `deploy/auth/`, `deploy/nginx.conf` and `deploy/truenas-app.yaml`. Setup: [DEPLOYMENT.md](../DEPLOYMENT.md#login).

## Tests

- Unit: `tests/unit/auth.test.ts` (redirect sanitising, login URLs, userinfo parsing).
- E2E: `tests/e2e/login.spec.ts` (header states, login page, with a faked `/oauth2/userinfo`).
- Integration: `tests/auth/run.sh` starts the real site image, oauth2-proxy and Dex with a mock login and walks through the whole flow, including a refused email. Runs in CI.
