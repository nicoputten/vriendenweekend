# Vriendenweekend 2027

Website for our yearly friends weekend in the Belgian Ardennes, 13–16 August 2027.
A static site, self-hosted as a container on a TrueNAS box.

The code and docs are in English; the text on the site is in Dutch.

## Getting started

```bash
nvm use            # Node 22
npm ci
npm run dev        # http://localhost:4321
```

## Scripts

| Script             | What it does                                    |
| ------------------ | ----------------------------------------------- |
| `npm run dev`      | Dev server with hot reload                      |
| `npm run build`    | Build the static site into `dist/`              |
| `npm run preview`  | Serve the built site locally                    |
| `npm run check`    | TypeScript and Astro type checking              |
| `npm run format`   | Format everything with Prettier                 |
| `npm test`         | Unit tests (Vitest)                             |
| `npm run test:e2e` | End-to-end tests (Playwright, desktop + mobile) |
| `npm run ci`       | Everything CI runs, in one go                   |

First time running e2e tests locally: `npx playwright install chromium`.

## Documentation

- [Architecture and folder structure](docs/ARCHITECTURE.md)
- [Workflow: branches, commits and releases](docs/CONTRIBUTING.md)
- [Deploying to TrueNAS](docs/DEPLOYMENT.md)
- [User stories](docs/stories/README.md)
- [Changelog](CHANGELOG.md)

## Changing content

Dates, amount, deadline, payment link and menu live in [`src/config/site.ts`](src/config/site.ts).
Pages live in `src/pages/`.
