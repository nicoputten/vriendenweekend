# Workflow

## Language

Code, comments, tests, docs, commit messages and PRs are in English. Only the text shown on the site is in Dutch.

## Privacy

This repository is public. Never commit real names of participants or organisers, private domain names, addresses, phone numbers, IP addresses or secrets. Use placeholders such as `site.example.com` and `OWNER` in examples.

## Branches and pull requests

- `main` is always deployable.
- Work on a branch: `feat/…`, `fix/…`, `docs/…`, `chore/…`.
- Every PR references a user story in `docs/stories/` and ticks the acceptance criteria it completes.
- CI must be green before merging.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/): `feat: pay button with bunq link`, `fix: …`, `docs: …`, `test: …`, `chore: …`.

## Releases

Semantic versioning. To cut a release:

1. Move the entries under `## [Unreleased]` in `CHANGELOG.md` to a new heading `## [X.Y.Z] - YYYY-MM-DD`.
2. Set the same version in `package.json` (`npm version X.Y.Z --no-git-tag-version`).
3. Merge to `main`, then start the release in one of two ways:
   - On GitHub: Actions > Release > _Run workflow_ on `main`. The workflow creates the tag `vX.Y.Z` from `package.json` itself (and refuses if that tag already exists).
   - Locally: `git tag vX.Y.Z && git push origin vX.Y.Z`.
4. The release workflow checks that the tag matches `package.json`, builds the image `ghcr.io/<owner>/vriendenweekend:X.Y.Z` (plus `latest`) and creates a GitHub release with the changelog section as notes.
5. Deploy as described in [DEPLOYMENT.md](DEPLOYMENT.md).
