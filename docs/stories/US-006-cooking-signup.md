# US-006 Sign up to cook an evening

**Status:** Later
**Priority:** Should
**Depends on:** US-004 (to know who signs up)

As a **participant** I want **to sign up to cook on a given evening**, so that **we don't have to sort out who cooks on the day itself**.

## Acceptance criteria

- [ ] Per evening (Friday, Saturday, Sunday) I see who cooks and how many spots are left
- [ ] I can sign up and withdraw again
- [ ] Optional: what's on the menu

## Technical direction

Small API container with SQLite on a TrueNAS dataset, behind the same login as US-004.
