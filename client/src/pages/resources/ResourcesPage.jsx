import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check, Clock, GraduationCap, PlayCircle } from "lucide-react";
import useSeo, { useJsonLd, ORIGIN } from "../../hooks/useSeo";
import { guides } from "../../data/guidesData";
import { courses } from "../../data/academyData";
import useLearningProgress from "../../hooks/useLearningProgress";
import { getLastGuide } from "../../utils/learningProgress";

function Status({ entry }) {
  if (entry?.passed) {
    return (
      <span className="inline-flex items-center gap-1 text-green-600">
        <Check size={13} strokeWidth={3} aria-hidden="true" />
        Validé {entry.bestScore}%
      </span>
    );
  }
  if (entry) {
    return (
      <span className="inline-flex items-center gap-1 text-slate-500">
        <GraduationCap size={13} aria-hidden="true" />
        Meilleur {entry.bestScore}%
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-slate-400">
      <GraduationCap size={13} aria-hidden="true" />
      Quiz
    </span>
  );
}

export default function ResourcesPage() {
  useSeo({
    title: "GROWSTACK Academy — formation entrepreneuriat",
    description:
      "Douze cours gratuits pour transformer une idée en entreprise : validation, étude de marché, business model, business plan, finance, marketing, branding, vente, juridique et lancement. Avec exercices, études de cas et quiz.",
    path: "/ressources",
  });

  useJsonLd(
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "GROWSTACK Academy — parcours entrepreneuriat",
      itemListElement: courses.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${ORIGIN}/ressources/cours/${c.slug}`,
        name: c.title,
      })),
    },
    "academy-list"
  );

  const { progress, isAuthenticated } = useLearningProgress();
  const [lastItem] = useState(() => getLastGuide());

  const all = [...courses.map((c) => c.slug), ...guides.map((g) => g.slug)];
  const validated = all.filter((slug) => progress.get(slug)?.passed).length;
  const courseHours = courses.length;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-orange-600">
          GROWSTACK Academy
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-4xl lg:text-5xl">
          De l'idée à l'entreprise
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
          Un parcours gratuit de {courses.length} cours — {courses.length * 3} leçons, des
          exercices, des études de cas et un quiz à la fin de chacun. Suivez-le dans l'ordre, ou
          prenez le cours dont vous avez besoin.
        </p>
      </header>

      {isAuthenticated && (
        <div className="mx-auto mt-10 max-w-3xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-sm font-bold text-slate-900">Votre progression</p>
            <p className="text-sm text-slate-500">
              {validated} sur {all.length} quiz validés
            </p>
          </div>
          <div
            className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-valuenow={validated}
            aria-valuemin={0}
            aria-valuemax={all.length}
            aria-label="Quiz validés"
          >
            <div
              className="h-full rounded-full bg-orange-500 transition-[width] duration-500"
              style={{ width: `${(validated / all.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {lastItem && (
        <div className="mx-auto mt-4 flex max-w-3xl flex-wrap items-center justify-between gap-4 border-2 border-slate-900 bg-white p-5">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-orange-600">
              Reprendre où vous en étiez
            </p>
            <p className="mt-1 font-bold leading-snug text-slate-900">{lastItem.title}</p>
          </div>
          <Link
            to={lastItem.path}
            className="inline-flex min-h-[44px] shrink-0 items-center gap-2 bg-slate-900 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-800"
          >
            <PlayCircle size={16} aria-hidden="true" />
            Continuer
          </Link>
        </div>
      )}

      {/* ─── The course path ─────────────────────────────────────────── */}
      <div className="mt-16">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Le parcours</h2>
          <p className="text-sm text-slate-500">
            {courseHours} cours · à suivre dans l'ordre
          </p>
        </div>

        <ol className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course, i) => (
            <motion.li
              key={course.slug}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.28, delay: Math.min(i, 5) * 0.04 }}
              className="flex h-full flex-col border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold uppercase tracking-wider">
                <span className="bg-slate-900 px-2 py-0.5 text-white">
                  {String(course.number).padStart(2, "0")}
                </span>
                <span className="text-orange-600">{course.level}</span>
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <Clock size={12} aria-hidden="true" />
                  {course.duration}
                </span>
              </div>

              <h3 className="mt-3 text-base font-bold leading-snug text-slate-900">
                <Link to={`/ressources/cours/${course.slug}`} className="hover:text-orange-600">
                  {course.title}
                </Link>
              </h3>

              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{course.objective}</p>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs font-semibold uppercase tracking-wider">
                <Status entry={progress.get(course.slug)} />
                <Link
                  to={`/ressources/cours/${course.slug}`}
                  className="inline-flex min-h-[44px] items-center gap-1.5 font-bold text-slate-900 hover:text-orange-600"
                >
                  Ouvrir
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>

      {/* ─── The short guides ────────────────────────────────────────── */}
      <div className="mt-20">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Guides pratiques</h2>
          <p className="text-sm text-slate-500">
            {guides.length} lectures courtes, indépendantes du parcours
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <article
              key={guide.slug}
              className="flex flex-col border border-slate-200 bg-white p-5 transition-shadow hover:shadow-md"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold uppercase tracking-wider">
                <span className="text-orange-600">{guide.category}</span>
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <Clock size={12} aria-hidden="true" />
                  {guide.readingMinutes} min
                </span>
              </div>

              <h3 className="mt-3 text-base font-bold leading-snug text-slate-900">
                <Link to={`/ressources/${guide.slug}`} className="hover:text-orange-600">
                  {guide.title}
                </Link>
              </h3>

              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{guide.excerpt}</p>

              <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs font-semibold uppercase tracking-wider">
                <Status entry={progress.get(guide.slug)} />
                <Link
                  to={`/ressources/${guide.slug}`}
                  className="inline-flex min-h-[44px] items-center gap-1.5 font-bold text-slate-900 hover:text-orange-600"
                >
                  Lire
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-20 border border-slate-200 bg-slate-900 px-6 py-12 text-center sm:px-12">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">
          Besoin d'un avis sur votre projet ?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300">
          Décrivez-nous où vous en êtes. Nous vous dirons ce qui nous paraît prioritaire, même si
          ce n'est pas une de nos prestations.
        </p>
        <Link
          to="/get-started"
          className="mt-8 inline-flex min-h-[44px] items-center gap-2 bg-orange-500 px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-600"
        >
          Parler de mon projet
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
