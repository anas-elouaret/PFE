import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Image, FileText, Palette, FolderArchive } from "lucide-react";

const DELIVERABLES = [
  { icon: Image, key: "logo" },
  { icon: FileText, key: "pdf" },
  { icon: Palette, key: "brand" },
  { icon: FolderArchive, key: "sources" },
];

export default function DeliverablesSection() {
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
            {t("deliverables_title")}
          </h2>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
            {t("deliverables_subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {DELIVERABLES.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="border-2 border-black bg-white p-8 transition-all duration-300 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] h-full flex flex-col items-center text-center">
                  <div className="w-16 h-16 border-2 border-black flex items-center justify-center mb-5 bg-white">
                    <Icon size={32} strokeWidth={1.5} className="text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">
                    {t(`deliverables_${item.key}_title`)}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed flex-1">
                    {t(`deliverables_${item.key}_desc`)}
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
