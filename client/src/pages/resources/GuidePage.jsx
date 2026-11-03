import { Link, useParams, Navigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, Check } from "lucide-react";
import useSeo, { useJsonLd, ORIGIN } from "../../hooks/useSeo";
import { getGuide, guides } from "../../data/guidesData";

export default function GuidePage() {
  const { slug } = useParams();
  const guide = getGuide(slug);

  // An unknown slug is a 404, not an empty article page: a thin page that
  // answers 200 gets indexed and competes with the real ones.
  if (!guide) return <Navigate to="/404" replace />;

  return <GuideView guide={guide} />;
}

function GuideView({ guide }) {
  useSeo({
    title: guide.title,
    description: guide.excerpt,
    path: `/ressources/${guide.slug}`,
  });

  useJsonLd(
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: guide.title,
      description: guide.excerpt,
      datePublished: guide.updated,
      dateModified: guide.updated,
      inLanguage: "fr",
      author: { "@type": "Organization", name: "GROWSTACK", url: ORIGIN },
      publisher: {
        "@type": "Organization",
        name: "GROWSTACK",
        logo: { "@type": "ImageObject", url: `${ORIGIN}/logo.png` },
      },
      mainEntityOfPage: `${ORIGIN}/ressources/${guide.slug}`,
    },
    `guide-${guide.slug}`
  );

  const others = guides.filter((g) => g.slug !== guide.slug).slice(0, 3);

  return (
    <article className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
      <Link
        to="/ressources"
        className="inline-flex min-h-[44px] items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Toutes les ressources
      </Link>

      <header className="mt-6">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider">
          <span className="text-orange-600">{guide.category}</span>
          <span className="inline-flex items-center gap-1 text-slate-400">
            <Clock size={12} aria-hidden="true" />
            {guide.readingMinutes} min de lecture
          </span>
          <span className="text-slate-400">
            Mis à jour le{" "}
            <time dateTime={guide.updated}>
              {new Date(guide.updated).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          </span>
        </div>

        <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
          {guide.title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">{guide.excerpt}</p>
      </header>

      <div className="mt-12 space-y-10">
        {guide.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-xl font-bold leading-snug text-slate-900 sm:text-2xl">
              {section.heading}
            </h2>

            {section.paragraphs?.map((p) => (
              <p key={p} className="mt-4 text-base leading-7 text-slate-600">
                {p}
              </p>
            ))}

            {section.bullets && (
              <ul className="mt-5 space-y-3">
                {section.bullets.map((b) => (
                  <li key={b} className="flex gap-3 text-base leading-7 text-slate-600">
                    <span
                      className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500"
                      aria-hidden="true"
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}

            {section.paragraphsAfter?.map((p) => (
              <p key={p} className="mt-5 text-base leading-7 text-slate-600">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>

      {guide.takeaways?.length > 0 && (
        <aside className="mt-14 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
          <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
            Ce qu'il faut retenir
          </h2>
          <ul className="mt-5 space-y-3">
            {guide.takeaways.map((item) => (
              <li key={item} className="flex gap-3 text-base leading-7 text-slate-700">
                <Check
                  size={18}
                  className="mt-1 shrink-0 text-orange-500"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </aside>
      )}

      <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <h2 className="text-lg font-bold text-slate-900">Vous voulez appliquer ça à votre marque ?</h2>
        <p className="mt-3 text-base leading-7 text-slate-600">
          Décrivez-nous votre projet. Nous vous dirons ce qui nous paraît prioritaire pour vous,
          même si ce n'est pas une de nos prestations.
        </p>
        <Link
          to="/get-started"
          className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
        >
          Parler de mon projet
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>

      {others.length > 0 && (
        <section className="mt-16 border-t border-slate-200 pt-10">
          <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
            À lire ensuite
          </h2>
          <ul className="mt-6 space-y-4">
            {others.map((g) => (
              <li key={g.slug}>
                <Link
                  to={`/ressources/${g.slug}`}
                  className="group flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-orange-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                >
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-orange-600">
                      {g.category}
                    </span>
                    <span className="mt-1 block font-bold leading-snug text-slate-900 group-hover:text-orange-600">
                      {g.title}
                    </span>
                  </span>
                  <ArrowRight
                    size={18}
                    className="mt-1 shrink-0 text-slate-400 group-hover:text-orange-600"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
