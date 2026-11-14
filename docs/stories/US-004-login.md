# US-004 Log in with Google or Microsoft

**Status:** Later (do not implement until picked up)
**Priority:** Should

As the **organiser** I want **only the group to see the site by logging in with Google or Microsoft**, so that **the address, photos and programme are not public**.

## Acceptance criteria

- [ ] Without logging in, no page is visible (except `/healthz`)
- [ ] Login works with a Google or Microsoft account
- [ ] Only email addresses on an allow list get access; the list is not stored in the repo
- [ ] A session stays valid for at least a week, so people don't have to log in again constantly
- [ ] A logout link in the footer

## Technical direction

[oauth2-proxy](https://oauth2-proxy.github.io/oauth2-proxy/) as an extra container in front of the site, with the Google and Microsoft Entra ID providers. The reverse proxy uses `auth_request` against oauth2-proxy. The static site itself does not need to change.
