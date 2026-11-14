# Instructions for Claude

- Code, comments, tests, docs, commit messages and PRs are in English. Only the text shown on the site is in Dutch.
- The repository is public: never commit real names, private domain names, addresses, IPs or secrets. Use placeholders (`site.example.com`, `OWNER`).
- Per-edition data (dates, amount, deadline, payment link, menu) belongs in `src/config/` (`site.ts`, plus one file per content page such as `programme.ts`), not hardcoded in pages.
- No participant names on public pages.
- No external scripts, fonts or trackers; the CSP in `deploy/security-headers.conf` blocks them anyway.
- Gitflow: branch features off `develop` and open PRs against `develop`; only release (`release/X.Y.Z`) and hotfix PRs target `main`. See `docs/CONTRIBUTING.md`.
- Every feature belongs to a user story in `docs/stories/`; update its acceptance criteria and `docs/stories/README.md`.
- Update `CHANGELOG.md` under `## [Unreleased]`.
- Run `npm run ci` before opening a PR.
