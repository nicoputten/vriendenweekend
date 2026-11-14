# Changelog

All notable changes. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versions follow [SemVer](https://semver.org/).

## [Unreleased]

### Fixed

- Dependabot config: `target-branch` moved to the weekly group, where Dependabot requires it.

## [0.2.1] - 2026-11-14

### Fixed

- The pay button prefills €250 in the bunq.me link.

## [0.2.0] - 2026-11-14

### Changed

- Gitflow: features go into `develop`, releases go from `develop` to `main`. CI also runs on `develop`, Dependabot targets `develop`, and the Release workflow only runs from `main`.
- Dependabot collects all updates into one weekly pull request and skips Node, `@types/node` and TypeScript major versions.
- GitHub Actions bumped: `actions/checkout` v7, `docker/login-action` v4.

### Added

- Programma page: loose programme per day (Friday to Monday) including the Vriendenweekend Quiz by Suus & Nico, and the three cooking evenings with two spots each. Signing up follows after login.
- "Paklijst" page: a checklist per category with a progress bar; ticks are remembered in the browser.
- New look from the approved design: forest green, amber and cream, with self-hosted Fraunces and Inter fonts.
- Desktop pill navigation and a mobile burger menu with a dark sheet.
- Home page with hero, countdown, "Doe mee" pay card with days left until the deadline, what the €250 covers, the plan in four steps and tiles for every page.
- "Binnenkort" pages now explain what each page will contain and link back to paying.
- "Vragen" (FAQ) page: questions grouped by topic (paying, travel, the chateau, other) that expand without JavaScript, with a "Binnenkort" label on answers that wait for the booking and a direct link per question (`/faq#carpoolen`). Leftover money goes to next year's pot. Uses the shared page hero.
- Release workflow can be started from the Actions tab ("Run workflow"); it creates the tag from `package.json`.

## [0.1.0] - 2026-11-14

### Added

- Astro project with a home page (dates, countdown, pay button linking to bunq.me) and "coming soon" pages for the house, location, nearby, programme, packing list and FAQ.
- Unit tests (Vitest) and end-to-end tests (Playwright, desktop and mobile).
- CI workflow, and a release workflow that publishes a Docker image to GHCR.
- Docker image with Nginx, security headers and a health check; example YAML for a TrueNAS Custom App.
- Docs on architecture, workflow and deployment, plus user stories US-001 to US-013.
