import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BadgeCheck, Search, ShieldAlert } from "lucide-react";
import useSeo from "../../hooks/useSeo";
import * as certificateApi from "../../api/certificates";

/**
 * Public verification of an attestation reference.
 *
 * Anyone a holder shows a certificate to can check it here. The answer is
 * deliberately narrow — holder, guide, date, score — so a reference someone
 * published on a profile cannot be turned into a way of reaching them.
 */
export default function VerifyCertificatePage() {
  const { reference: routeReference } = useParams();
  const navigate = useNavigate();

  useSeo({
    title: "Vérifier une attestation",
    description:
      "Vérifiez la référence d'une attestation de réussite délivrée par GROWSTACK à l'issue d'un quiz de guide.",
    path: "/verifier",
  });

  const [input, setInput] = useState(routeReference || "");
  const [state, setState] = useState({ status: "idle", data: null, message: null });

  const check = useCallback(async (ref) => {
    const value = (ref || "").trim();
    if (!value) return;
    setState({ status: "loading", data: null, message: null });
    try {
      const data = await certificateApi.verifyCertificate(value);
      setState({ status: "valid", data: data.certificate, message: null });
    } catch (err) {
      setState({
        status: "invalid",
        data: null,
        message:
          err.response?.data?.message ||
          err.message ||
          "Aucune attestation ne correspond à cette référence.",
      });
    }
  }, []);

  useEffect(() => {
    if (routeReference) {
      setInput(routeReference);
      check(routeReference);
    }
  }, [routeReference, check]);

  const onSubmit = (e) => {
    e.preventDefault();
    const value = input.trim().toUpperCase();
    if (!value) return;
    // Put the reference in the URL so a checked result can be linked to.
    navigate(`/verifier/${encodeURIComponent(value)}`);
    if (value === routeReference) check(value);
  };

  return (
    <section className="mx-auto max-w-2xl px-4 pb-24 pt-4 sm:px-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Vérifier une attestation
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600">
          Saisissez la référence imprimée sur l'attestation pour confirmer qu'elle a bien été
          délivrée par GROWSTACK.
        </p>
      </header>

      <form onSubmit={onSubmit} className="mt-10">
        <label htmlFor="reference" className="block text-sm font-bold text-slate-900">
          Référence de l'attestation
        </label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input
            id="reference"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.toUpperCase())}
            placeholder="GS-2026-XXXX-XXXX"
            autoComplete="off"
            spellCheck="false"
            className="min-h-[44px] flex-1 rounded-xl border-2 border-slate-200 px-4 py-3 font-mono text-sm uppercase text-slate-900 placeholder:font-sans placeholder:normal-case placeholder:text-slate-400 focus:border-orange-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || state.status === "loading"}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Search size={16} aria-hidden="true" />
            {state.status === "loading" ? "Vérification…" : "Vérifier"}
          </button>
        </div>
      </form>

      <div aria-live="polite">
        {state.status === "valid" && state.data && (
          <div className="mt-8 rounded-2xl border-2 border-green-500 bg-green-50 p-6 sm:p-8">
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-green-700">
              <BadgeCheck size={18} aria-hidden="true" />
              Attestation authentique
            </p>

            <dl className="mt-6 space-y-4">
              {[
                ["Délivrée à", state.data.recipientName],
                ["Guide", state.data.guideTitle],
                ["Score", `${state.data.score}%`],
                [
                  "Date",
                  new Date(state.data.issuedAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }),
                ],
                ["Référence", state.data.reference],
              ].map(([label, value]) => (
                <div key={label} className="sm:flex sm:gap-4">
                  <dt className="text-xs font-bold uppercase tracking-wider text-green-800/70 sm:w-32 sm:shrink-0 sm:pt-0.5">
                    {label}
                  </dt>
                  <dd
                    className={`text-sm font-semibold text-slate-900 ${
                      label === "Référence" ? "font-mono" : ""
                    }`}
                  >
                    {value}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 border-t border-green-200 pt-5 text-xs leading-5 text-slate-600">
              GROWSTACK est une agence digitale, pas un organisme de formation accrédité. Cette
              attestation confirme la réussite d'un quiz en ligne et ne constitue ni un diplôme ni
              une certification professionnelle reconnue.
            </p>
          </div>
        )}

        {state.status === "invalid" && (
          <div className="mt-8 flex items-start gap-3 rounded-2xl border-2 border-red-200 bg-red-50 px-5 py-4">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden="true" />
            <p className="flex-1 text-sm text-red-700">{state.message}</p>
          </div>
        )}
      </div>
    </section>
  );
}
