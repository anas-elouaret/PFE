export default function SectionHeading({ pretitle, title, description }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs uppercase tracking-[0.32em] text-indigo-300/80">{pretitle}</p>
      <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-sm leading-7 text-white/70 sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
