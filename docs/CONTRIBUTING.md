# Workflow

## Language

Code, comments, tests, docs, commit messages and PRs are in English. Only the text shown on the site is in Dutch.

## Privacy

This repository is public. Never commit real names of participants or organisers, private domain names, addresses, phone numbers, IP addresses or secrets. Use placeholders such as `site.example.com` and `OWNER` in examples.

## Branches and pull requests (gitflow)

| Branch            | Purpose                                                   | Branches off | Merges into          |
| ----------------- | --------------------------------------------------------- | ------------ | -------------------- |
| `main`            | What is live. Every commit on `main` is a release.        | -            | -                    |
| `develop`         | Integration branch for the next release.                  | `main`       | `main` (at release)  |
| `feat/…`, `fix/…` | One user story or fix. Also `docs/…`, `chore/…`, `test/…` | `develop`    | `develop`            |
| `release/X.Y.Z`   | Version bump and changelog for a release.                 | `develop`    | `main`               |
| `hotfix/…`        | Urgent fix for what is live.                              | `main`       | `main` and `develop` |

- Feature PRs target `develop`, never `main`.
- Every PR references a user story in `docs/stories/` and ticks the acceptance criteria it completes.
- CI runs on every PR and on pushes to `main` and `develop`, and must be green before merging.
- Dependabot opens its weekly PR against `develop`.
- After a release or hotfix is merged into `main`, merge `main` back into `develop` so they don't drift.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/): `feat: pay button with bunq link`, `fix: …`, `docs: …`, `test: …`, `chore: …`.

## Releases

Semantic versioning. To cut a release:

1. Create `release/X.Y.Z` from `develop`.
2. Move the entries under `## [Unreleased]` in `CHANGELOG.md` to a new heading `## [X.Y.Z] - YYYY-MM-DD`.
3. Set the same version in `package.json` (`npm version X.Y.Z --no-git-tag-version`).
4. Open a PR from `release/X.Y.Z` into `main`. After merging, merge `main` back into `develop`.
5. Start the release in one of two ways (the workflow refuses to run from any branch other than `main`):
   - On GitHub: Actions > Release > _Run workflow_ on `main`. The workflow creates the tag `vX.Y.Z` from `package.json` itself (and refuses if that tag already exists).
   - Locally: `git tag vX.Y.Z && git push origin vX.Y.Z`.
6. The release workflow checks that the tag matches `package.json`, builds the image `ghcr.io/<owner>/vriendenweekend:X.Y.Z` (plus `latest`) and creates a GitHub release with the changelog section as notes.
7. Deploy as described in [DEPLOYMENT.md](DEPLOYMENT.md).
