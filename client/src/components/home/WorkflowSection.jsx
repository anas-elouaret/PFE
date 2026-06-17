import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { FileText, TrendingUp, Sparkles, Rocket } from "lucide-react";

const STEPS = [
  { icon: FileText, key: "brief" },
  { icon: TrendingUp, key: "strategy" },
  { icon: Sparkles, key: "create" },
  { icon: Rocket, key: "launch" },
];

export default function WorkflowSection() {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
            {t("workflow_title")}
          </h2>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
            {t("workflow_subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="relative border-2 border-black bg-white p-8 transition-all duration-300 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <span className="absolute -top-3 -left-3 w-8 h-8 border-2 border-black bg-white flex items-center justify-center text-sm font-black text-slate-900">
                    {i + 1}
                  </span>
                  <Icon size={36} strokeWidth={1.5} className="text-indigo-600 mb-5" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {t(`workflow_step${i + 1}_title`)}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {t(`workflow_step${i + 1}_desc`)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
