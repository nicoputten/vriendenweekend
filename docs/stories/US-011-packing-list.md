# US-011 "Paklijst" page

**Status:** Done
**Priority:** Could

As a **participant** I want **a packing list**, so that **I don't forget anything**.

## Acceptance criteria

- [x] List per category (important, sleeping, clothing, for the group), following the approved design
- [x] Items can be ticked off on a phone and are remembered in the browser (`localStorage`, nothing is sent to a server)
- [x] Progress card shows how many items are packed, with a progress bar
- [x] Tapping the text of an item ticks it too (whole row is the touch target); ticked items are struck through
- [x] The list itself lives in `src/config/site.ts` (`packingList`), each item with a stable id
- [x] A broken or outdated stored value is ignored; items that were removed from the list are dropped
- [x] Desktop: categories in two columns, progress bar in one row

## Notes

Ticks are stored under a key that contains the year, so a new edition starts with an empty list. Never rename an item id, or people lose that tick. Without JavaScript the boxes can still be ticked, but are not remembered.
