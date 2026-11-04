import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, Printer } from "lucide-react";
import useSeo, { ORIGIN } from "../../hooks/useSeo";
import * as certificateApi from "../../api/certificates";
import { getGuide } from "../../data/guidesData";
import { getCourse } from "../../data/academyData";
import QrCode from "../../components/resources/QrCode";

const SIGNATORY = { name: "Anas Elouaret", title: "Fondateur, GROWSTACK" };

/** Ornamental corner rule. Four of these frame the document. */
function Corner({ className }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={`absolute h-7 w-7 text-orange-500 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      aria-hidden="true"
    >
      <path d="M2 14V2h12" />
    </svg>
  );
}

/**
 * The printable attestation.
 *
 * Served outside the dashboard layout so printing produces the certificate
 * and nothing else. It states what it is — an attestation of a quiz result
 * from an agency, not a qualification from an accredited body — because a
 * document that looks like a diploma will be read as one.
 */
export default function CertificatePage() {
  const { reference } = useParams();
  useSeo({ title: "Attestation", path: `/client/attestation/${reference}`, noindex: true });

  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setCertificate(await certificateApi.getMyCertificate(reference));
    } catch (err) {
      setError(err.message || "Cette attestation n'a pas pu être chargée.");
    } finally {
      setLoading(false);
    }
  }, [reference]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-slate-50" />
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden="true" />
          <p className="flex-1 text-sm text-red-700">
            {error || "Cette attestation n'existe pas."}
          </p>
        </div>
        <Link
          to="/client/dashboard/apprentissage"
          className="mt-6 inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-slate-600 hover:text-orange-600"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Mon apprentissage
        </Link>
      </div>
    );
  }

  const issued = new Date(certificate.issuedAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // What the quiz actually assessed, taken from the guide itself rather than
  // invented for the page: a certificate that only carries a score says
  // nothing about what was learned.
  // A certificate can be for a short guide or for an Academy course; both
  // carry their own outline, and the one that matches supplies it.
  const guide = getGuide(certificate.guideSlug);
  const course = guide ? null : getCourse(certificate.guideSlug);
  const competencies = guide?.takeaways?.slice(0, 4) || (course ? [course.objective] : []);
  const verifyUrl = `${ORIGIN}/verifier/${certificate.reference}`;
  const verifyLabel = verifyUrl.replace("https://", "");
  const programme =
    guide?.sections?.map((section) => section.heading) ||
    course?.lessons?.map((lesson) => lesson.title) ||
    [];

  return (
    <div className="min-h-screen bg-slate-100 py-10 print:bg-white print:py-0">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          @page { size: A4 landscape; margin: 10mm; }
          .sheet { box-shadow: none !important; }
        }
      `}</style>

      <div className="no-print mx-auto mb-6 flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4">
        <Link
          to="/client/dashboard/apprentissage"
          className="inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-slate-600 transition-colors hover:text-orange-600"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Mon apprentissage
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-600"
        >
          <Printer size={16} aria-hidden="true" />
          Imprimer / enregistrer en PDF
        </button>
      </div>

      <article className="sheet mx-auto max-w-5xl bg-white p-3 shadow-xl sm:p-4">
        <div className="relative border-[3px] border-slate-900 px-6 py-8 sm:px-12 sm:py-10">
          <Corner className="start-2 top-2" />
          <Corner className="end-2 top-2 rotate-90" />
          <Corner className="bottom-2 end-2 rotate-180" />
          <Corner className="bottom-2 start-2 -rotate-90" />


          <div className="relative">
            <header className="text-center">
              <img
                src="/logo.png"
                alt="GROWSTACK"
                className="mx-auto h-14 w-auto"
                width="192"
                height="64"
              />
              <p className="mt-3 text-[11px] font-bold uppercase tracking-[0.42em] text-slate-900">
                GROWSTACK
              </p>
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
                Agence digitale · Maroc
              </p>

              <div className="mx-auto mt-6 flex max-w-md items-center gap-4">
                <span className="h-px flex-1 bg-slate-200" />
                <span className="h-1.5 w-1.5 rotate-45 bg-orange-500" aria-hidden="true" />
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              <h1 className="mt-6 text-2xl font-bold uppercase tracking-[0.12em] text-slate-900 sm:text-3xl">
                Attestation de réussite
              </h1>
              <p className="mt-2 text-sm text-slate-500">Quiz de fin de guide</p>
            </header>

            <div className="mt-7 text-center">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">Délivrée à</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {certificate.recipientName}
              </p>
              <div className="mx-auto mt-3 h-px w-56 bg-slate-900" />
            </div>

            <div className="mx-auto mt-6 max-w-2xl text-center">
              <p className="text-[11px] uppercase tracking-[0.22em] text-slate-400">
                Pour avoir réussi le quiz du guide
              </p>
              <p className="mt-2 text-lg font-semibold leading-snug text-slate-900">
                {certificate.guideTitle}
              </p>
            </div>

            <div className="mt-8 grid gap-8 sm:grid-cols-[1fr_auto]">
              <div className="space-y-6">
                {programme.length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      Ce que couvre ce guide
                    </p>
                    <ul className="mt-3 grid gap-x-7 gap-y-1.5 sm:grid-cols-2">
                      {programme.map((heading) => (
                        <li
                          key={heading}
                          className="flex gap-2 text-[12px] leading-5 text-slate-600"
                        >
                          <span
                            className="mt-1.5 h-1 w-1 shrink-0 rotate-45 bg-slate-300"
                            aria-hidden="true"
                          />
                          <span>{heading}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {competencies.length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                      Notions validées par le quiz
                    </p>
                    <ul className="mt-3 space-y-1.5">
                      {competencies.map((item) => (
                        <li
                          key={item}
                          className="flex gap-2.5 text-[12.5px] leading-5 text-slate-700"
                        >
                          <span
                            className="mt-1.5 h-1 w-1 shrink-0 rotate-45 bg-orange-500"
                            aria-hidden="true"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex shrink-0 flex-col items-center gap-5">
                {/* Score seal */}
                <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full border-[3px] border-slate-900 bg-white text-center">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Score
                  </span>
                  <span className="text-4xl font-bold leading-none text-slate-900">
                    {certificate.score}
                    <span className="text-xl">%</span>
                  </span>
                  <span className="mt-1 h-px w-12 bg-orange-500" aria-hidden="true" />
                  <span className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Validé
                  </span>
                </div>

                <div className="text-center">
                  <div className="border border-slate-200 p-1.5">
                    <QrCode
                      value={verifyUrl}
                      size={132}
                      label={`Vérifier l'attestation ${certificate.reference}`}
                    />
                  </div>
                  <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Scanner pour vérifier
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 grid items-end gap-8 border-t border-slate-200 pt-7 sm:grid-cols-3">
              <div>
                <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Date de délivrance
                </dt>
                <dd className="mt-1 text-sm font-semibold text-slate-800">{issued}</dd>
              </div>

              <div className="text-center">
                <div className="mx-auto h-10 border-b border-slate-400 sm:w-48" />
                <p className="mt-2 text-sm font-semibold text-slate-800">{SIGNATORY.name}</p>
                <p className="text-[11px] text-slate-500">{SIGNATORY.title}</p>
              </div>

              <div className="sm:text-end">
                <dt className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">
                  Référence
                </dt>
                <dd className="mt-1 font-mono text-sm font-semibold text-slate-800">
                  {certificate.reference}
                </dd>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-5">
              <p className="text-center text-[11px] font-medium text-slate-600">
                Vérifiable sur <span className="font-mono text-slate-800">{verifyLabel}</span>
              </p>
              <p className="mt-3 text-center text-[10px] leading-5 text-slate-500">
                GROWSTACK est une agence digitale, pas un organisme de formation accrédité. Cette
                attestation certifie la réussite d'un quiz en ligne publié sur growstack.ma. Elle
                ne constitue pas un diplôme ni une certification professionnelle reconnue.
              </p>
            </div>
          </div>
        </div>
      </article>

      <p className="no-print mx-auto mt-6 max-w-5xl px-4 text-center text-sm text-slate-500">
        Toute personne à qui vous montrez cette attestation peut en vérifier la référence sur{" "}
        <Link to="/verifier" className="font-bold text-orange-600 underline">
          growstack.ma/verifier
        </Link>
        .
      </p>
    </div>
  );
}
