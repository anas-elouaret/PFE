import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, Clock, GraduationCap, Info, PlayCircle } from "lucide-react";
import SectionHeading from "../../components/common/SectionHeading";
import useSeo, { useJsonLd, ORIGIN } from "../../hooks/useSeo";
import { guides, guideCategories } from "../../data/guidesData";
import { externalResources } from "../../data/externalResourcesData";
import useLearningProgress from "../../hooks/useLearningProgress";
import { getLastGuide } from "../../utils/learningProgress";

const ALL = "Tous";

export default function ResourcesPage() {
  useSeo({
    title: "Ressources — guides pour entrepreneurs",
    description:
      "Guides GROWSTACK sur le lancement de marque, le prix, l'identité visuelle, le contenu et les réseaux sociaux, et une sélection de plateformes de formation pour entrepreneurs.",
    path: "/ressources",
  });

  // An ItemList of the guides, so search engines can see the collection
  // rather than one page of links. Each entry points at its own article page.
  useJsonLd(
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Guides GROWSTACK pour entrepreneurs",
      itemListElement: guides.map((g, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${ORIGIN}/ressources/${g.slug}`,
        name: g.title,
      })),
    },
    "resources-list"
  );

  const { progress, isAuthenticated } = useLearningProgress();
  const [lastGuide] = useState(() => getLastGuide());
  const validatedCount = guides.filter((g) => progress.get(g.slug)?.passed).length;
  const totalMinutes = guides.reduce((n, g) => n + g.readingMinutes, 0);

  const [category, setCategory] = useState(ALL);
  const filtered = useMemo(
    () => (category === ALL ? guides : guides.filter((g) => g.category === category)),
    [category]
  );

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <SectionHeading
        pretitle="Ressources"
        title="Apprendre à faire grandir sa marque"
        description="Des guides écrits par l'équipe GROWSTACK sur ce que nous pratiquons au quotidien, chacun suivi d'un quiz de cinq questions. Connectez-vous pour garder vos scores, et retrouvez-les dans votre espace."
      />

      <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-slate-500">
        {guides.length} guides · environ {totalMinutes} min de lecture · {guides.length * 5} questions
        · à suivre dans l'ordre ou séparément
      </p>

      {isAuthenticated && (
        <div className="mx-auto mt-8 max-w-3xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-bold text-slate-900">Votre parcours</p>
            <p className="text-sm text-slate-500">
              {validatedCount} sur {guides.length} quiz validés
            </p>
          </div>
          <div
            className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-valuenow={validatedCount}
            aria-valuemin={0}
            aria-valuemax={guides.length}
            aria-label="Quiz validés"
          >
            <div
              className="h-full rounded-full bg-orange-500 transition-[width] duration-500"
              style={{ width: `${(validatedCount / guides.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {lastGuide && (
        <div className="mx-auto mt-4 flex max-w-3xl flex-wrap items-center justify-between gap-4 border-2 border-slate-900 bg-white p-5">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
              Reprendre où vous en étiez
            </p>
            <p className="mt-1 font-bold leading-snug text-slate-900">{lastGuide.title}</p>
          </div>
          <Link
            to={`/ressources/${lastGuide.slug}`}
            className="inline-flex min-h-[44px] shrink-0 items-center gap-2 bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-800"
          >
            <PlayCircle size={16} aria-hidden="true" />
            Continuer
          </Link>
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-2">
        {[ALL, ...guideCategories].map((c) => {
          const active = c === category;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              aria-pressed={active}
              className={`min-h-[44px] rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 ${
                active
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-orange-400 hover:text-orange-600"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((guide, i) => (
          <motion.article
            key={guide.slug}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: Math.min(i, 5) * 0.05 }}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold uppercase tracking-wider">
              <span className="bg-slate-900 px-2 py-0.5 text-white">
                {String(guides.indexOf(guide) + 1).padStart(2, "0")}
              </span>
              <span className="text-orange-600">{guide.category}</span>
              <span className="inline-flex items-center gap-1 text-slate-400">
                <Clock size={12} aria-hidden="true" />
                {guide.readingMinutes} min
              </span>
              {progress.get(guide.slug)?.passed ? (
                <span className="inline-flex items-center gap-1 text-green-600">
                  <Check size={13} strokeWidth={3} aria-hidden="true" />
                  Validé {progress.get(guide.slug).bestScore}%
                </span>
              ) : progress.has(guide.slug) ? (
                <span className="inline-flex items-center gap-1 text-slate-500">
                  <GraduationCap size={13} aria-hidden="true" />
                  Meilleur {progress.get(guide.slug).bestScore}%
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <GraduationCap size={13} aria-hidden="true" />
                  Quiz
                </span>
              )}
            </div>

            <h3 className="mt-4 text-lg font-bold leading-snug text-slate-900">
              <Link
                to={`/ressources/${guide.slug}`}
                className="rounded transition-colors hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
              >
                {guide.title}
              </Link>
            </h3>

            <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{guide.excerpt}</p>

            <Link
              to={`/ressources/${guide.slug}`}
              className="mt-5 inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-slate-900 transition-colors hover:text-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            >
              Lire le guide
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </motion.article>
        ))}
      </div>

      <div className="mt-20 border-t border-slate-200 pt-16">
        <SectionHeading
          pretitle="Aller plus loin"
          title="Plateformes et institutions à connaître"
          description="Ces ressources appartiennent à leurs organisations respectives. Nous les sélectionnons, nous n'en hébergeons pas le contenu : leurs programmes et leurs conditions peuvent changer."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {externalResources.map((r) => (
            <a
              key={r.url}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors hover:border-orange-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-orange-600">
                    {r.name}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-slate-500">{r.organisation}</p>
                </div>
                <ArrowUpRight
                  size={18}
                  className="mt-1 shrink-0 text-slate-400 group-hover:text-orange-600"
                  aria-hidden="true"
                />
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">{r.description}</p>

              <dl className="mt-5 flex flex-wrap gap-2 text-xs">
                {[
                  ["Accès", r.access],
                  ["Langue", r.language],
                  ["Portée", r.scope],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1"
                  >
                    <dt className="sr-only">{label}</dt>
                    <dd className="font-medium text-slate-600">{value}</dd>
                  </div>
                ))}
              </dl>
            </a>
          ))}
        </div>

        <p className="mt-8 flex items-start gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-6 text-slate-600">
          <Info size={16} className="mt-1 shrink-0 text-slate-400" aria-hidden="true" />
          <span>
            GROWSTACK n'est affiliée à aucune de ces organisations et ne perçoit rien sur ces
            liens. Vérifiez toujours les conditions d'accès sur le site concerné avant de vous
            engager.
          </span>
        </p>
      </div>

      <div className="mt-20 rounded-2xl border border-slate-200 bg-slate-900 px-6 py-12 text-center sm:px-12">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Besoin d'un avis sur votre projet ?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300">
          Décrivez-nous où vous en êtes. Nous vous dirons ce qui nous paraît prioritaire, même si
          ce n'est pas une de nos prestations.
        </p>
        <Link
          to="/get-started"
          className="mt-8 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-orange-500 px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Parler de mon projet
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
