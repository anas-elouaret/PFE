import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import CommunityFeed from "../../components/community/CommunityFeed";
import HallOfFameSection from "../../components/community/HallOfFameSection";

export default function CommunityFeedPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <section className="relative pt-16 pb-10 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] border border-slate-200 bg-slate-50 text-orange-600">
              {t("community.badge")}
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {t("community.title")}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
              {t("community.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Hall of Fame */}
      <section className="mx-auto max-w-2xl px-4 sm:px-6 py-8 pb-6">
        <HallOfFameSection />
      </section>

      {/* Feed */}
      <section className="mx-auto max-w-2xl px-4 sm:px-6 pb-28">
        <CommunityFeed />
      </section>
    </div>
  );
}
