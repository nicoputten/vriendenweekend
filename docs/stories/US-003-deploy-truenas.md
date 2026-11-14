# US-003 Run on TrueNAS

**Status:** To do
**Priority:** Must

As the **admin** I want **to run the site as a Custom App on my TrueNAS behind my own Nginx**, so that **it is reachable on its own domain over HTTPS**.

## Acceptance criteria

- [ ] Custom App runs the image from GHCR (see `deploy/truenas-app.yaml`)
- [ ] The reverse proxy forwards the domain to the container, with a Let's Encrypt certificate
- [ ] `/healthz` returns 200
- [ ] Rolling out a new release is documented in `docs/DEPLOYMENT.md`
