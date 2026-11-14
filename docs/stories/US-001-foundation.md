# US-001 Foundation: repo, tests and pipelines

**Status:** In progress
**Priority:** Must

As a **developer** I want **a repo with tests, CI and a release pipeline**, so that **every change is checked and I can ship a new version with a single tag**.

## Acceptance criteria

- [x] Astro project with TypeScript (strict) and Prettier
- [x] Unit tests with Vitest for the logic in `src/lib` and `src/config`
- [x] End-to-end tests with Playwright on desktop and mobile
- [x] CI runs format check, typecheck, unit tests, build, e2e and a Docker build on every PR
- [x] A `vX.Y.Z` tag builds a Docker image to `ghcr.io/<owner>/vriendenweekend` and creates a GitHub release
- [x] Docs on structure (`docs/ARCHITECTURE.md`) and deployment (`docs/DEPLOYMENT.md`)
- [ ] First release `v0.1.0` published
