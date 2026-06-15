import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import SectionHeading from "../components/common/SectionHeading";
import StatsSection from "../components/about/StatsSection";
import TeamSection from "../components/about/TeamSection";

export default function AboutPage() {
  const { t } = useTranslation();
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <SectionHeading
          pretitle={t("about.pretitle")}
          title={t("about.title1")}
          description={t("about.description1")}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto mt-16 max-w-5xl rounded-2xl sm:rounded-[2rem] border border-slate-200 bg-white p-6 sm:p-10 shadow-md"
        >
          <div className="grid gap-10 lg:grid-cols-[0.9fr_0.7fr] lg:items-start">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.28em] text-indigo-600/80">{t("about.storyLabel")}</p>
              <p className="text-lg leading-8 text-slate-600">
                {t("about.story1")}
              </p>
              <p className="text-lg leading-8 text-slate-600">
                {t("about.story2")}
              </p>
            </div>
            <div className="space-y-6 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <p className="text-sm uppercase tracking-[0.28em] text-indigo-600/80">{t("about.approachLabel")}</p>
              <ul className="space-y-4 text-slate-600">
                <li>{t("about.approach1")}</li>
                <li>{t("about.approach2")}</li>
                <li>{t("about.approach3")}</li>
                <li>{t("about.approach4")}</li>
              </ul>
            </div>
          </div>
        </motion.div>

        <StatsSection />
        <TeamSection />
      </section>
    </>
  );
}
