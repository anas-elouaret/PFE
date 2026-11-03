import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, Award, Check, RotateCcw, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import * as quizApi from "../../api/quizzes";

/**
 * The quiz at the end of a guide.
 *
 * Questions come from the server without their answers, and the server grades
 * the submission — the score shown is the score recorded, and neither can be
 * set from the browser. A guest may take the quiz and see the result; saving
 * it needs an account, and the result says plainly which happened.
 */
export default function GuideQuiz({ slug }) {
  const { isAuthenticated } = useAuth();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setQuiz(await quizApi.getQuiz(slug));
    } catch (err) {
      setError(err.message || "Le quiz n'a pas pu être chargé.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  // A different guide means a different quiz: clear anything in progress.
  useEffect(() => {
    setAnswers({});
    setResult(null);
  }, [slug]);

  const choose = (questionId, index) => {
    if (result) return;
    setAnswers((prev) => ({ ...prev, [questionId]: index }));
  };

  const total = quiz?.questions?.length || 0;
  const answeredCount = quiz ? quiz.questions.filter((q) => answers[q.id] !== undefined).length : 0;
  const allAnswered = total > 0 && answeredCount === total;

  const submit = async () => {
    if (!allAnswered || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      setResult(await quizApi.submitQuiz(slug, answers));
    } catch (err) {
      setError(err.message || "La correction n'a pas pu aboutir. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  const retry = () => {
    setAnswers({});
    setResult(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="mt-14 h-48 animate-pulse rounded-2xl border border-slate-200 bg-slate-50" />
    );
  }

  if (error && !quiz) {
    return (
      <div className="mt-14 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
        <p className="flex-1 text-sm text-slate-600">{error}</p>
        <button onClick={load} className="shrink-0 text-xs font-bold text-orange-600 underline">
          Réessayer
        </button>
      </div>
    );
  }

  if (!quiz) return null;

  const resultById = result
    ? Object.fromEntries(result.results.map((r) => [r.id, r]))
    : null;

  return (
    <section className="mt-14 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <header>
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Quiz — {quiz.title}</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {quiz.totalQuestions} questions. Il faut {quiz.passMark}% pour valider.
          {!isAuthenticated && " Connectez-vous avant de répondre pour garder votre score."}
        </p>
      </header>

      {!result && (
        <div
          className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-valuenow={answeredCount}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label="Questions répondues"
        >
          <div
            className="h-full rounded-full bg-orange-500 transition-[width] duration-300"
            style={{ width: `${total ? (answeredCount / total) * 100 : 0}%` }}
          />
        </div>
      )}

      <ol className="mt-8 space-y-8">
        {quiz.questions.map((q, qi) => {
          const r = resultById?.[q.id];
          return (
            <li key={q.id}>
              <fieldset>
                <legend className="text-base font-semibold leading-7 text-slate-900">
                  <span className="text-orange-600">{qi + 1}.</span> {q.question}
                </legend>

                <div className="mt-4 space-y-2">
                  {q.options.map((option, oi) => {
                    const selected = answers[q.id] === oi;
                    const isAnswer = r && oi === r.correct;
                    const wrongPick = r && selected && !r.isCorrect;

                    let tone = "border-slate-200 bg-white hover:border-orange-400";
                    if (r) {
                      if (isAnswer) tone = "border-green-500 bg-green-50";
                      else if (wrongPick) tone = "border-red-400 bg-red-50";
                      else tone = "border-slate-200 bg-white";
                    } else if (selected) {
                      tone = "border-orange-500 bg-orange-50";
                    }

                    return (
                      <label
                        key={option}
                        className={`flex min-h-[44px] cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 text-sm leading-6 transition-colors ${tone} ${
                          r ? "cursor-default" : ""
                        } focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-orange-500`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={oi}
                          checked={selected}
                          disabled={Boolean(result)}
                          onChange={() => choose(q.id, oi)}
                          className="sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                            isAnswer
                              ? "border-green-500 bg-green-500 text-white"
                              : wrongPick
                                ? "border-red-400 bg-red-400 text-white"
                                : selected
                                  ? "border-orange-500 bg-orange-500"
                                  : "border-slate-300"
                          }`}
                        >
                          {isAnswer && <Check size={12} strokeWidth={3} />}
                          {wrongPick && <X size={12} strokeWidth={3} />}
                        </span>
                        <span className="text-slate-700">{option}</span>
                      </label>
                    );
                  })}
                </div>

                {r && (
                  <p className="mt-3 rounded-xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                    <span className={`font-bold ${r.isCorrect ? "text-green-700" : "text-red-600"}`}>
                      {r.isCorrect ? "Correct. " : "Incorrect. "}
                    </span>
                    {r.explanation}
                  </p>
                )}
              </fieldset>
            </li>
          );
        })}
      </ol>

      {error && quiz && (
        <p className="mt-6 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}

      {!result ? (
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={submit}
            disabled={!allAnswered || submitting}
            className="inline-flex min-h-[44px] items-center rounded-full bg-orange-500 px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          >
            {submitting ? "Correction…" : "Voir mon score"}
          </button>
          {!allAnswered && (
            <p className="text-sm text-slate-500">
              {answeredCount} / {total} questions répondues
            </p>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6"
        >
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span
              className={`text-4xl font-bold ${
                result.passed ? "text-green-600" : "text-orange-600"
              }`}
            >
              {result.score}%
            </span>
            <span className="text-sm font-medium text-slate-600">
              {result.correctCount} bonnes réponses sur {result.totalQuestions}
            </span>
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {result.passed
              ? "Quiz validé. Les explications ci-dessus reprennent chaque point."
              : `Il faut ${result.passMark}% pour valider. Relisez les points manqués ci-dessus, puis reprenez le quiz.`}
          </p>

          {result.certificateReference && (
            <Link
              to={`/client/attestation/${result.certificateReference}`}
              className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            >
              <Award size={16} aria-hidden="true" />
              Voir mon attestation
            </Link>
          )}

          <p className="mt-4 text-sm leading-6 text-slate-600">
            {result.saved ? (
              <>
                Résultat enregistré dans votre espace.{" "}
                <Link
                  to="/client/dashboard/apprentissage"
                  className="font-bold text-orange-600 underline"
                >
                  Voir mes résultats
                </Link>
              </>
            ) : isAuthenticated ? (
              "Votre résultat n'a pas pu être enregistré. Reprenez le quiz plus tard pour le garder dans votre espace."
            ) : (
              <>
                Ce score n'est pas enregistré : il faut un compte pour le garder.{" "}
                <Link to="/client/login" className="font-bold text-orange-600 underline">
                  Se connecter
                </Link>
              </>
            )}
          </p>

          <button
            type="button"
            onClick={retry}
            className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-full border-2 border-slate-900 px-6 py-2.5 text-sm font-bold text-slate-900 transition-colors hover:bg-slate-900 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          >
            <RotateCcw size={15} aria-hidden="true" />
            Refaire le quiz
          </button>
        </motion.div>
      )}
    </section>
  );
}
