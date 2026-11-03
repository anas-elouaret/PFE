import { useTranslation } from "react-i18next";
import { Check, X } from "lucide-react";

const features = [
  "comparison_row_creators",
  "comparison_row_payment",
  "comparison_row_performance",
  "comparison_row_rights",
  "comparison_row_pricing",
  "comparison_row_workflow",
];

const columns = [
  { key: "growstack", labelKey: "comparison_col_growstack", growstack: true },
  { key: "agences", labelKey: "comparison_col_agences", growstack: false },
  { key: "freelances", labelKey: "comparison_col_freelances", growstack: false },
  { key: "influenceurs", labelKey: "comparison_col_influenceurs", growstack: false },
];

const checkValues = {
  growstack: [true, true, true, true, true, true],
  agences: [false, false, false, false, false, false],
  freelances: [false, false, false, false, true, false],
  influenceurs: [false, false, false, false, false, false],
};

export default function ComparisonTable() {
  const { t } = useTranslation();

  return (
    <section className="py-14 sm:py-24 md:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-4">
            {t("comparison_title")}
          </h2>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
            {t("comparison_desc")}
          </p>
        </div>

        {/* Phones: one block per criterion. The wide table needed 640px and
            forced sideways scrolling, which hid the GROWSTACK column. */}
        <div className="space-y-3 sm:hidden">
          {features.map((featureKey, i) => (
            <div key={featureKey} className="border-2 border-black bg-white p-4">
              <p className="mb-3 text-sm font-bold text-slate-900">{t(featureKey)}</p>
              <dl className="grid grid-cols-2 gap-x-3 gap-y-2">
                {columns.map((col) => {
                  const hasCheck = checkValues[col.key][i];
                  return (
                    <div
                      key={col.key}
                      className={`flex items-center justify-between gap-2 px-2.5 py-2 ${
                        col.growstack ? "bg-slate-100" : "bg-slate-50/60"
                      }`}
                    >
                      <dt
                        className={`truncate text-[11px] font-bold uppercase tracking-wide ${
                          col.growstack ? "text-slate-900" : "text-slate-400"
                        }`}
                      >
                        {t(col.labelKey)}
                      </dt>
                      <dd className="shrink-0">
                        {hasCheck ? (
                          <Check size={16} className="text-emerald-600" strokeWidth={3} aria-label="oui" />
                        ) : (
                          <X size={16} className="text-red-500" strokeWidth={3} aria-label="non" />
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </div>
          ))}
        </div>

        <div className="hidden overflow-x-auto sm:block">
          <div className="min-w-[640px] border-2 border-black rounded-none">
            <div className="grid grid-cols-[1.4fr_repeat(4,1fr)] border-b-2 border-black bg-slate-50">
              <div className="p-6 text-xs font-bold uppercase tracking-wider text-slate-500 border-e-2 border-black">
                {t("comparison_col_feature")}
              </div>
              {columns.map((col) => (
                <div
                  key={col.key}
                  className={`p-6 text-xs font-bold uppercase tracking-wider text-center border-e-2 border-black last:border-e-0 ${
                    col.growstack ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {t(col.labelKey)}
                </div>
              ))}
            </div>

            {features.map((featureKey, i) => (
              <div
                key={featureKey}
                className={`grid grid-cols-[1.4fr_repeat(4,1fr)] border-b-2 border-black last:border-b-0 ${
                  i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                }`}
              >
                <div className="p-6 text-sm font-bold text-slate-900 border-e-2 border-black flex items-center">
                  {t(featureKey)}
                </div>
                {columns.map((col) => {
                  const hasCheck = checkValues[col.key][i];
                  return (
                    <div
                      key={col.key}
                      className={`p-6 flex items-center justify-center border-e-2 border-black last:border-e-0 ${
                        col.growstack ? "bg-slate-50" : ""
                      }`}
                    >
                      {hasCheck ? (
                        <Check size={18} className="text-emerald-600 shrink-0" strokeWidth={3} />
                      ) : (
                        <X size={18} className="text-red-500 shrink-0" strokeWidth={3} />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
