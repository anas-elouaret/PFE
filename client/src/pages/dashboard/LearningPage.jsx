import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, BookOpen, GraduationCap, RotateCcw } from "lucide-react";
import useSeo from "../../hooks/useSeo";
import * as quizApi from "../../api/quizzes";
import { guides } from "../../data/guidesData";

function scoreTone(score, passed) {
  if (passed) return "text-green-600";
  if (score >= 40) return "text-orange-600";
  return "text-red-600";
}

export default function LearningPage() {
  // A private area: indexed, it would send readers to a sign-in wall from a
  // search result.
  useSeo({ title: "Mon apprentissage", path: "/client/dashboard/apprentissage", noindex: true });

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await quizApi.getMyAttempts());
    } catch (err) {
      setError(err.message || "Vos résultats n'ont pas pu être chargés.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const summary = data?.summary || [];
  const done = new Set(summary.map((s) => s.guideSlug));
  const remaining = guides.filter((g) => !done.has(g.slug));
  const passedCount = summary.filter((s) => s.passed).length;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Mon apprentissage</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Vos scores aux quiz des guides. Chaque tentative est conservée : reprendre un quiz ne
          remplace pas votre meilleur score.
        </p>
      </header>

      {loading ? (
        <div className="mt-8 space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 animate-pulse border-2 border-slate-100 bg-slate-50" />
          ))}
        </div>
      ) : error ? (
        <div className="mt-8 flex items-start gap-3 border-2 border-red-200 bg-red-50 px-5 py-4">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden="true" />
          <p className="flex-1 text-sm text-red-700">{error}</p>
          <button onClick={load} className="shrink-0 text-xs font-bold text-red-700 underline">
            Réessayer
          </button>
        </div>
      ) : (
        <>
          {summary.length > 0 && (
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["Guides tentés", `${summary.length} / ${guides.length}`],
                ["Quiz validés", `${passedCount}`],
                [
                  "Tentatives au total",
                  `${summary.reduce((n, s) => n + s.attempts, 0)}`,
                ],
              ].map(([label, value]) => (
                <div key={label} className="border-2 border-black bg-white px-5 py-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {label}
                  </p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
                </div>
              ))}
            </div>
          )}

          {summary.length === 0 ? (
            <div className="mt-8 border-2 border-slate-200 bg-white px-6 py-16 text-center">
              <GraduationCap className="mx-auto mb-3 h-8 w-8 text-slate-300" aria-hidden="true" />
              <p className="text-sm font-semibold text-slate-700">
                Vous n'avez pas encore passé de quiz.
              </p>
              <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                Chaque guide se termine par cinq questions. Votre score s'enregistre ici
                automatiquement tant que vous êtes connecté.
              </p>
              <Link
                to="/ressources"
                className="mt-6 inline-flex min-h-[44px] items-center gap-2 bg-orange-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-600"
              >
                <BookOpen size={16} aria-hidden="true" />
                Voir les guides
              </Link>
            </div>
          ) : (
            <ul className="mt-8 space-y-4">
              {summary.map((s) => (
                <li
                  key={s.guideSlug}
                  className="flex flex-wrap items-center justify-between gap-4 border-2 border-black bg-white px-5 py-4"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-bold leading-snug text-slate-900">
                      {s.guideTitle || s.guideSlug}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {s.attempts} tentative{s.attempts > 1 ? "s" : ""} · dernière le{" "}
                      <time dateTime={s.lastAttemptAt}>
                        {new Date(s.lastAttemptAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                    </p>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${scoreTone(s.bestScore, s.passed)}`}>
                        {s.bestScore}%
                      </p>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {s.passed ? "Validé" : "Meilleur score"}
                      </p>
                    </div>
                    <Link
                      to={`/ressources/${s.guideSlug}`}
                      className="inline-flex min-h-[44px] items-center gap-2 border-2 border-slate-900 px-4 py-2 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-900 hover:text-white"
                    >
                      <RotateCcw size={14} aria-hidden="true" />
                      Reprendre
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {remaining.length > 0 && summary.length > 0 && (
            <section className="mt-12">
              <h2 className="text-base font-bold uppercase tracking-wider text-slate-900">
                Pas encore passés
              </h2>
              <ul className="mt-5 space-y-3">
                {remaining.map((g) => (
                  <li key={g.slug}>
                    <Link
                      to={`/ressources/${g.slug}`}
                      className="group flex items-center justify-between gap-4 border-2 border-slate-200 bg-white px-5 py-4 transition-colors hover:border-orange-400"
                    >
                      <span className="min-w-0">
                        <span className="block text-xs font-bold uppercase tracking-wider text-orange-600">
                          {g.category}
                        </span>
                        <span className="mt-1 block font-bold leading-snug text-slate-900 group-hover:text-orange-600">
                          {g.title}
                        </span>
                      </span>
                      <span className="shrink-0 text-xs font-bold text-slate-400">
                        {g.readingMinutes} min
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
