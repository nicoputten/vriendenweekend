# Architecture

## Decisions

- **Astro, fully static.** The site is mostly information; static HTML is fast, secure and easy to host. Interactive bits (countdown, menu, packing list) are small scripts without a framework. State that belongs to one visitor (packing list ticks) stays in their browser via `localStorage`.
- **One config file.** Everything that changes per edition (dates, amount, deadline, payment link, menu) lives in `src/config/site.ts`. Pages read from it, so a new edition is mostly a config change.
- **English code, Dutch content.** Code, comments, tests, docs and commits are in English. Only user-facing text on the site is in Dutch.
- **No private data in the repo.** The repository is public: no real names of participants or organisers, no private domain names, addresses or secrets. Environment-specific values (domain, host IPs) live only on the server.
- **Design.** The approved design lives in a separate design canvas. Colours are CSS custom properties in `src/styles/global.css`; icons are inline stroke SVGs in `src/components/icons.ts`, rendered with `Icon.astro`. Fonts (Fraunces for headings, Inter for body text) are self-hosted through Fontsource npm packages.
- **No external resources.** No Google Fonts, analytics or embeds. That keeps the site fast and privacy-friendly, and allows a strict Content-Security-Policy.
- **Nginx in a container.** The Docker image contains the built site and its own Nginx (unprivileged, port 8080). TLS and the domain are handled by the existing reverse proxy on the TrueNAS host.
- **Later: login and a small API.** Login (US-004) will be oauth2-proxy in front of the site, without changing the static site. Features that need storage (US-005, US-006) get a separate API container with SQLite.

## Folder structure

```
.
├── .github/
│   ├── workflows/ci.yml        # Every PR and push to main: lint, typecheck, tests, build, e2e, Docker build
│   ├── workflows/release.yml   # Tag vX.Y.Z: image to GHCR and a GitHub release
│   └── pull_request_template.md
├── deploy/
│   ├── nginx.conf              # Nginx inside the site container
│   ├── security-headers.conf   # CSP and other security headers
│   ├── truenas-app.yaml        # YAML for the TrueNAS Custom App
│   └── reverse-proxy.example.conf
├── docs/
│   ├── ARCHITECTURE.md         # This file
│   ├── CONTRIBUTING.md         # Branches, commits, releases
│   ├── DEPLOYMENT.md           # Deploying to TrueNAS
│   └── stories/                # User stories, one file per feature
├── public/                     # Files copied as-is (favicon, robots.txt)
├── src/
│   ├── components/             # Reusable Astro components
│   ├── config/site.ts          # All data for this edition
│   ├── layouts/Base.astro      # HTML skeleton, header and footer
│   ├── lib/                    # Pure TypeScript functions (tested with Vitest)
│   ├── pages/                  # One file per page; file name = URL
│   └── styles/global.css       # Colours, typography and base rules
├── tests/
│   ├── unit/                   # Vitest
│   └── e2e/                    # Playwright (desktop + mobile)
├── Dockerfile
└── CHANGELOG.md
```

## Pages and status

The menu is `nav` in `src/config/site.ts`. Each page has a status: `live` or `binnenkort` ("coming soon"). Pages marked `binnenkort` use the `ComingSoon` component and show a label in the mobile menu. Switch the status to `live` once the content is there.

## URLs

Astro builds with `build.format: "file"`, so `/huis` becomes `huis.html`. Nginx resolves it with `try_files $uri $uri.html` and serves `404.html` with status 404 for unknown URLs.

The public URL is not stored in the repo. Set `SITE_URL` at build time if a feature needs absolute URLs (for example a sitemap or Open Graph images).

## Testing

- **Unit (Vitest):** logic in `src/lib` and sanity checks on the config (for example: deadline before the weekend, payment link is a bunq.me link).
- **End-to-end (Playwright):** runs against the built site (`astro preview`) in a desktop and a mobile profile. Checks the home page content, navigation to every page, the 404 page and that there is no horizontal scroll at 360 px.

## Security

- Strict CSP: only same-origin scripts, no inline scripts (Astro is configured to bundle scripts as separate files).
- `robots.txt` and `noindex`: the site should not appear in search engines.
- The container runs as non-root, read-only, without extra capabilities.
