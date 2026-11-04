import { guides } from "../data/guidesData";
import { courses } from "../data/academyData";

/**
 * Helpers for reading the learning material as ordered paths rather than a
 * pile of articles, and for remembering where a reader stopped.
 *
 * There are two tracks: the twelve-course Academy, and the shorter practical
 * guides. Both run on the same quiz and attestation machinery; they differ
 * only in length and in where they live.
 */

/** A stable anchor id for a heading, for the in-page contents list. */
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
export const totalCourses = courses.length;

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

/** `slug` for a guide, `cours/<slug>` for an Academy course. */
export function rememberLastGuide(slug) {
  try {
    window.localStorage.setItem(LAST_READ_KEY, slug);
  } catch {
    /* not important enough to surface */
  }
}

/**
 * The last item opened, as { title, path }, or null. Returns null for a slug
 * that no longer exists, so removing a guide cannot leave a dead card on the
 * hub.
 */
export function getLastGuide() {
  try {
    const stored = window.localStorage.getItem(LAST_READ_KEY);
    if (!stored) return null;
    if (stored.startsWith("cours/")) {
      const course = courses.find((c) => c.slug === stored.slice(6));
      return course
        ? { title: course.title, path: `/ressources/cours/${course.slug}`, kind: "course" }
        : null;
    }
    const guide = guides.find((g) => g.slug === stored);
    return guide
      ? { title: guide.title, path: `/ressources/${guide.slug}`, kind: "guide" }
      : null;
  } catch {
    return null;
  }
}
