import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { UserCheck, Users, Layers } from "lucide-react";

const pillars = [
  { key: "contact", icon: UserCheck },
  { key: "network", icon: Users },
  { key: "integrated", icon: Layers },
];

export default function TeamSection() {
  const { t } = useTranslation();

  return (
    <section className="px-4 pb-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.32em] text-indigo-600">
            {t("about.teamLabel")}
          </p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {t("about.teamTitle")}
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            {t("about.teamDescription")}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.article
                key={pillar.key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-indigo-200 bg-indigo-50">
                  <Icon size={22} strokeWidth={1.75} className="text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {t(`about.team_${pillar.key}_title`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {t(`about.team_${pillar.key}_desc`)}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
