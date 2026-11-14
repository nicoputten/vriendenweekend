# Changelog

All notable changes. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versions follow [SemVer](https://semver.org/).

## [Unreleased]

### Changed

- Dependabot collects all updates into one weekly pull request and skips Node, `@types/node` and TypeScript major versions.
- GitHub Actions bumped: `actions/checkout` v7, `docker/login-action` v4.

### Added

- Release workflow can be started from the Actions tab ("Run workflow"); it creates the tag from `package.json`.

## [0.1.0] - 2026-11-14

### Added

- Astro project with a home page (dates, countdown, pay button linking to bunq.me) and "coming soon" pages for the house, location, nearby, programme, packing list and FAQ.
- Unit tests (Vitest) and end-to-end tests (Playwright, desktop and mobile).
- CI workflow, and a release workflow that publishes a Docker image to GHCR.
- Docker image with Nginx, security headers and a health check; example YAML for a TrueNAS Custom App.
- Docs on architecture, workflow and deployment, plus user stories US-001 to US-013.
