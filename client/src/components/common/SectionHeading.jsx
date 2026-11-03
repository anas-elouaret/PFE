/**
 * Centred section heading.
 *
 * The colours were written for a dark background, but both pages that use
 * this sit on the white public layout — so the title rendered white on white
 * and the À propos page had no visible heading at all. These are the light
 * theme's colours, matching the rest of the public pages.
 */
export default function SectionHeading({ pretitle, title, description }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {pretitle ? (
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-orange-600">
          {pretitle}
        </p>
      ) : null}
      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
