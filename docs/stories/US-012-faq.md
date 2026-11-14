# US-012 "Veelgestelde vragen" page

**Status:** Done
**Priority:** Should

As a **participant** I want **answers to the questions that come up every year**, so that **not everything has to be asked in the group chat**.

## Acceptance criteria

- [x] Questions about carpooling, room allocation, house rules, what the money covers and what happens to leftovers (kept for next year)
- [x] Expandable questions that work without JavaScript (`<details>`/`<summary>`)
- [x] Questions grouped by topic, as in the approved design (mobile and desktop)
- [x] Answers that depend on the booked house show a "Binnenkort" label
- [x] Amount, deadline and house name come from `src/config/site.ts`; the questions live in `src/config/faq.ts`
- [x] Every question has its own anchor (`/faq#carpoolen`) that opens it, so it can be shared in the group chat
- [x] No participant names on the page
