import { Link, useParams, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, ArrowRight, Clock, Check, ListTree } from "lucide-react";
import useSeo, { useJsonLd, ORIGIN } from "../../hooks/useSeo";
import { getGuide } from "../../data/guidesData";
import GuideQuiz from "../../components/resources/GuideQuiz";
import ReadingProgress from "../../components/resources/ReadingProgress";
import { guideStep, headingId, rememberLastGuide } from "../../utils/learningProgress";

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

  const step = guideStep(guide.slug);

  // So the hub can offer to pick up where the reader stopped.
  useEffect(() => {
    rememberLastGuide(guide.slug);
  }, [guide.slug]);

  return (
    <article className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
      <ReadingProgress />
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

        {step && (
          <p className="mt-4 inline-flex items-center gap-2 bg-slate-900 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
            Étape {step.number} sur {step.total}
          </p>
        )}

        <h1 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
          {guide.title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-slate-600">{guide.excerpt}</p>
      </header>

      {guide.sections.length > 2 && (
        <nav
          aria-label="Sommaire du guide"
          className="mt-10 border-s-2 border-orange-500 bg-slate-50 py-5 ps-5 pe-4"
        >
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-500">
            <ListTree size={13} aria-hidden="true" />
            Dans ce guide
          </p>
          <ol className="mt-3 space-y-1.5">
            {guide.sections.map((section, i) => (
              <li key={section.heading} className="flex gap-2.5 text-sm leading-6">
                <span className="shrink-0 font-mono text-xs text-slate-400">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <a
                  href={`#${headingId(section.heading)}`}
                  className="text-slate-600 underline-offset-2 hover:text-orange-600 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
                >
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="mt-12 space-y-10">
        {guide.sections.map((section) => (
          <section key={section.heading}>
            <h2
              id={headingId(section.heading)}
              className="scroll-mt-24 text-xl font-bold leading-snug text-slate-900 sm:text-2xl"
            >
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

      <GuideQuiz slug={guide.slug} />

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

      {step && (step.previous || step.next) && (
        <nav
          aria-label="Navigation dans le parcours"
          className="mt-16 grid gap-4 border-t border-slate-200 pt-10 sm:grid-cols-2"
        >
          {step.previous ? (
            <Link
              to={`/ressources/${step.previous.slug}`}
              className="group flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-orange-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            >
              <ArrowLeft
                size={18}
                className="mt-1 shrink-0 text-slate-400 group-hover:text-orange-600"
                aria-hidden="true"
              />
              <span className="min-w-0">
                <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Étape {step.number - 1} · Précédent
                </span>
                <span className="mt-1 block font-bold leading-snug text-slate-900 group-hover:text-orange-600">
                  {step.previous.title}
                </span>
              </span>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}

          {step.next && (
            <Link
              to={`/ressources/${step.next.slug}`}
              className="group flex items-start justify-between gap-3 rounded-2xl border-2 border-slate-900 bg-white p-5 text-end transition-colors hover:border-orange-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 sm:flex-row-reverse sm:text-start"
            >
              <ArrowRight
                size={18}
                className="mt-1 shrink-0 text-slate-400 group-hover:text-orange-600"
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold uppercase tracking-wider text-orange-600">
                  Étape {step.number + 1} · Suivant
                </span>
                <span className="mt-1 block font-bold leading-snug text-slate-900 group-hover:text-orange-600">
                  {step.next.title}
                </span>
              </span>
            </Link>
          )}
        </nav>
      )}

      {step && !step.next && (
        <section className="mt-16 border-t border-slate-200 pt-10 text-center">
          <p className="text-base leading-7 text-slate-600">
            Vous êtes au bout du parcours. Vos scores et vos attestations sont rassemblés dans
            votre espace.
          </p>
          <Link
            to="/client/dashboard/apprentissage"
            className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-full border-2 border-slate-900 px-6 py-3 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-900 hover:text-white"
          >
            Voir ma progression
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </section>
      )}

    </article>
  );
}
