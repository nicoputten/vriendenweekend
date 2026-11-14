export interface Progress {
  done: number;
  total: number;
  /** Whole percentage, 0–100. */
  percent: number;
}

/** How many of the known items are ticked. Unknown ids are ignored. */
export function progress(
  checked: ReadonlySet<string>,
  ids: readonly string[],
): Progress {
  const total = ids.length;
  const done = ids.filter((id) => checked.has(id)).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  return { done, total, percent };
}

/**
 * Reads ticked ids from a stored value. Anything unexpected (missing,
 * broken JSON, wrong shape, items that no longer exist) is dropped, so a
 * changed list or a tampered value never breaks the page.
 */
export function parseChecked(
  raw: string | null,
  ids: readonly string[],
): Set<string> {
  if (!raw) return new Set();
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return new Set();
  }
  if (!Array.isArray(value)) return new Set();
  const known = new Set(ids);
  return new Set(
    value.filter((id): id is string => typeof id === "string" && known.has(id)),
  );
}

/** Stores ticked ids in list order, so the value is stable. */
export function serializeChecked(
  checked: ReadonlySet<string>,
  ids: readonly string[],
): string {
  return JSON.stringify(ids.filter((id) => checked.has(id)));
}
