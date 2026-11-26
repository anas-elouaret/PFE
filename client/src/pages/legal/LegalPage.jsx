import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";
import useSeo from "../../hooks/useSeo";
import { getLegalDoc, LEGAL_SLUGS, REGISTRATION_LABELS } from "../../data/legal";
import { registrationRows, registrationIncomplete } from "../../data/legalEntity";

/**
 * One page for all five legal documents.
 *
 * They share a shape — a dated heading, prose, lists, and occasionally a
 * table of what is stored — so they share a renderer. The content lives in
 * data/legal/<lang>.js, which keeps the three languages beside each other
 * and makes a missing translation obvious.
 */
export default function LegalPage({ slug }) {
  const params = useParams();
  const resolved = slug || params.slug;
  const { t, i18n } = useTranslation();
  const lang = String(i18n.language || "fr").split("-")[0];
  const doc = getLegalDoc(resolved, lang);

  useSeo({
    title: doc?.title,
    description: doc?.intro,
    path: `/${resolved}`,
  });

  if (!doc) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-slate-600">{t("legal_not_found", "Document introuvable.")}</p>
      </div>
    );
  }

  const labels = REGISTRATION_LABELS[lang] || REGISTRATION_LABELS.fr;

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <Link
          to="/"
          className="inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-slate-600 transition-colors hover:text-orange-600"
        >
          <ArrowLeft size={16} aria-hidden="true" className="rtl:rotate-180" />
          {t("nav_home", "Accueil")}
        </Link>

        <header className="mt-6 border-b-2 border-black pb-8">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {doc.title}
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">{doc.intro}</p>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">
            {t("legal_updated", "Dernière mise à jour")} : {doc.updated}
          </p>
        </header>

        <div className="mt-10 space-y-10">
          {doc.sections.map((section) => (
            <section key={section.h}>
              <h2 className="text-lg font-black text-slate-900 sm:text-xl">{section.h}</h2>

              {section.p?.map((para) => (
                <p key={para.slice(0, 40)} className="mt-3 text-[15px] leading-7 text-slate-700">
                  {para}
                </p>
              ))}

              {section.ul && (
                <ul className="mt-4 space-y-2.5">
                  {section.ul.map((item) => (
                    <li key={item.slice(0, 40)} className="flex gap-3 text-[15px] leading-7 text-slate-700">
                      <span
                        className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-orange-500"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.rows && (
                <dl className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
                  {section.rows.map(([label, value]) => (
                    <div key={label} className="grid gap-1 py-3 sm:grid-cols-[14rem_1fr] sm:gap-4">
                      <dt className="text-sm font-bold text-slate-500">{label}</dt>
                      <dd className="text-[15px] text-slate-900">{value}</dd>
                    </div>
                  ))}
                  {section.registration &&
                    registrationRows(labels).map((row) => (
                      <div key={row.key} className="grid gap-1 py-3 sm:grid-cols-[14rem_1fr] sm:gap-4">
                        <dt className="text-sm font-bold text-slate-500">{row.label}</dt>
                        <dd className="text-[15px] text-slate-900">{row.value}</dd>
                      </div>
                    ))}
                </dl>
              )}

              {/* Shown only while the registration details are missing, so the
                  page never prints an invented or stale number — and so the
                  gap is visible to whoever has to fill it. */}
              {section.registration && registrationIncomplete && (
                <div className="mt-4 flex items-start gap-3 border-2 border-orange-500 bg-orange-50 px-4 py-3">
                  <AlertCircle
                    className="mt-0.5 h-4 w-4 shrink-0 text-orange-700"
                    aria-hidden="true"
                  />
                  <p className="text-sm leading-6 text-orange-900">
                    {t(
                      "legal_registration_pending",
                      "Les informations d'immatriculation (forme juridique, RC, ICE) seront publiées ici dès leur confirmation."
                    )}
                  </p>
                </div>
              )}

              {section.table && (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full min-w-[32rem] border-collapse text-start text-sm">
                    <thead>
                      <tr className="border-b-2 border-black">
                        {section.table.head.map((cell) => (
                          <th
                            key={cell}
                            scope="col"
                            className="py-2.5 pe-4 text-start font-black text-slate-900"
                          >
                            {cell}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row) => (
                        <tr key={row[0]} className="border-b border-slate-200 align-top">
                          {row.map((cell, i) => (
                            <td
                              key={cell}
                              className={`py-3 pe-4 leading-6 ${
                                i === 0 ? "font-mono text-[13px] text-slate-900" : "text-slate-700"
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          ))}
        </div>

        <nav className="mt-14 border-t-2 border-black pt-8">
          <p className="text-xs font-black uppercase tracking-wider text-slate-500">
            {t("legal_other_docs", "Les autres documents")}
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL_SLUGS.filter((s) => s !== resolved).map((s) => {
              const other = getLegalDoc(s, lang);
              return (
                <li key={s}>
                  <Link
                    to={`/${s}`}
                    className="inline-flex min-h-[44px] items-center text-sm font-bold text-slate-900 underline decoration-orange-500 decoration-2 underline-offset-4 hover:text-orange-700"
                  >
                    {other?.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
