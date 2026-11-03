import { guides } from "../data/guidesData";

/**
 * Helpers for reading the guides as an ordered path rather than a pile of
 * articles, and for remembering where a reader stopped.
 *
 * The order is the order of `guides` in the data file: strategy, then price,
 * then channel, then identity, then content, then launch. Reordering that
 * array reorders the path, which is the intent.
 */

/** A stable anchor id for a section heading, for the table of contents. */
export function headingId(heading) {
  return heading
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export const totalGuides = guides.length;

export function guideStep(slug) {
  const index = guides.findIndex((g) => g.slug === slug);
  if (index === -1) return null;
  return {
    index,
    number: index + 1,
    total: guides.length,
    previous: index > 0 ? guides[index - 1] : null,
    next: index < guides.length - 1 ? guides[index + 1] : null,
  };
}

// Where the reader stopped. Per-browser and per-device by nature, so it is a
// convenience only — the scores that matter live on the account. Every access
// is guarded: storage throws in private windows and with site data blocked.
const LAST_READ_KEY = "growstack.lastGuide";

export function rememberLastGuide(slug) {
  try {
    window.localStorage.setItem(LAST_READ_KEY, slug);
  } catch {
    // Not important enough to surface.
  }
}

export function getLastGuide() {
  try {
    const slug = window.localStorage.getItem(LAST_READ_KEY);
    return guides.find((g) => g.slug === slug) || null;
  } catch {
    return null;
  }
}
