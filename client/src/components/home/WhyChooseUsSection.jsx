import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Shield, Zap, Headphones } from "lucide-react";

const FEATURES = [
  { icon: Shield, key: "quality" },
  { icon: Zap, key: "speed" },
  { icon: Headphones, key: "support" },
];

export default function WhyChooseUsSection() {
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
            {t("why_title")}
          </h2>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
            {t("why_subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="border-2 border-black bg-white p-8 transition-all duration-300 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] h-full flex flex-col">
                  <Icon size={40} strokeWidth={1.5} className="text-indigo-600 mb-5" />
                  <h3 className="text-xl font-black text-slate-900 mb-3">
                    {t(`why_feature${i + 1}_title`)}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed flex-1">
                    {t(`why_feature${i + 1}_desc`)}
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
