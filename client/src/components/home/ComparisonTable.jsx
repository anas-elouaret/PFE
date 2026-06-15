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
    <section className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
            {t("comparison_title")}
          </h2>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
            {t("comparison_desc")}
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[640px] border-2 border-black rounded-none">
            <div className="grid grid-cols-[1.4fr_repeat(4,1fr)] border-b-2 border-black bg-slate-50">
              <div className="p-6 text-xs font-bold uppercase tracking-wider text-slate-500 border-r-2 border-black">
                {t("comparison_col_feature")}
              </div>
              {columns.map((col) => (
                <div
                  key={col.key}
                  className={`p-6 text-xs font-bold uppercase tracking-wider text-center border-r-2 border-black last:border-r-0 ${
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
                <div className="p-6 text-sm font-bold text-slate-900 border-r-2 border-black flex items-center">
                  {t(featureKey)}
                </div>
                {columns.map((col) => {
                  const hasCheck = checkValues[col.key][i];
                  return (
                    <div
                      key={col.key}
                      className={`p-6 flex items-center justify-center border-r-2 border-black last:border-r-0 ${
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
