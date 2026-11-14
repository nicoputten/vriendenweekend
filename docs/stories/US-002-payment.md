# US-002 Pay the contribution via bunq

**Status:** In progress
**Priority:** Must (deadline 30 November 2026)

As a **participant** I want **to see on the home page how much to pay, by when and what it covers**, so that **I can pay with one tap via bunq**.

## Acceptance criteria

- [x] Home shows the title, dates (13–16 August 2027) and a countdown
- [x] Amount (€250), deadline (Monday 30 November) and what the money covers are on the home page
- [x] The pay button opens the bunq.me link with the fixed amount prefilled (`?amount=`)
- [x] Without a link the button reads "Betaallink volgt binnenkort" and is not clickable
- [x] Works on a 360 px wide screen without horizontal scrolling

## Notes

The link lives in `src/config/site.ts` (`payment.url`). A unit test checks that it is an `https://bunq.me/` link and that its `amount` parameter matches `payment.amountEur`.
