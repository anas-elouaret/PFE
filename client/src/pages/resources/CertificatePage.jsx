import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft, Printer } from "lucide-react";
import useSeo, { ORIGIN } from "../../hooks/useSeo";
import * as certificateApi from "../../api/certificates";

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

  return (
    <div className="min-h-screen bg-slate-50 py-10 print:bg-white print:py-0">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          @page { size: A4 landscape; margin: 14mm; }
        }
      `}</style>

      <div className="no-print mx-auto mb-6 flex max-w-4xl flex-wrap items-center justify-between gap-4 px-4">
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

      <article className="mx-auto max-w-4xl bg-white px-6 py-12 shadow-sm ring-1 ring-slate-200 sm:px-14 sm:py-16 print:shadow-none print:ring-0">
        <div className="border-[3px] border-slate-900 px-6 py-10 sm:px-12 sm:py-14">
          <header className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-600">
              GROWSTACK
            </p>
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Attestation de réussite
            </h1>
            <p className="mt-2 text-sm text-slate-500">Quiz de fin de guide</p>
          </header>

          <div className="mt-12 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Délivrée à</p>
            <p className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              {certificate.recipientName}
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-xl text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
              Pour avoir réussi le quiz du guide
            </p>
            <p className="mt-3 text-lg font-semibold leading-snug text-slate-900">
              {certificate.guideTitle}
            </p>
            <p className="mt-4 text-base text-slate-600">
              Score obtenu : <span className="font-bold text-slate-900">{certificate.score}%</span>
            </p>
          </div>

          <dl className="mt-14 grid gap-6 border-t border-slate-200 pt-8 text-center sm:grid-cols-3 sm:text-left">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Date
              </dt>
              <dd className="mt-1 text-sm font-semibold text-slate-700">{issued}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Référence
              </dt>
              <dd className="mt-1 font-mono text-sm font-semibold text-slate-700">
                {certificate.reference}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Vérification
              </dt>
              <dd className="mt-1 break-words text-sm font-semibold text-slate-700">
                {ORIGIN.replace("https://", "")}/verifier
              </dd>
            </div>
          </dl>

          <p className="mt-10 border-t border-slate-200 pt-6 text-center text-xs leading-5 text-slate-500">
            GROWSTACK est une agence digitale, pas un organisme de formation accrédité. Cette
            attestation certifie la réussite d'un quiz en ligne publié sur growstack.ma. Elle ne
            constitue pas un diplôme ni une certification professionnelle reconnue.
          </p>
        </div>
      </article>

      <p className="no-print mx-auto mt-6 max-w-4xl px-4 text-center text-sm text-slate-500">
        Toute personne à qui vous montrez cette attestation peut en vérifier la référence sur{" "}
        <Link to="/verifier" className="font-bold text-orange-600 underline">
          growstack.ma/verifier
        </Link>
        .
      </p>
    </div>
  );
}
