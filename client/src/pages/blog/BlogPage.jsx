import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";

const SearchIcon = ({ size = 28, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
  </svg>
);

export default function BlogPage() {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");

  return (
    <div className="pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div animate={{ x: [0, -50, 0], y: [0, 50, 0], rotate: [0, 10, 0] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-0 -z-10 w-[500px] h-[500px] bg-indigo-100/30 blur-[130px] rounded-full -translate-x-1/2" />

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center">
        <div className="inline-flex items-center gap-2 border border-indigo-200 bg-indigo-50 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-8">
          <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span> {t.blogBadge || "Blog"}
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter leading-[0.9]">
          {t.blogTitle1 || "Notre"} <span className="text-indigo-600">Blog</span>
        </h1>
        <p className="mt-6 text-slate-500 font-medium max-w-2xl mx-auto text-lg leading-relaxed">{t.blogSub || "Articles, conseils et ressources pour votre stratégie digitale."}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
        className="mt-16 max-w-3xl mx-auto relative group">
        <div className="absolute inset-0 bg-indigo-50/50 blur-3xl rounded-[3rem] opacity-0 group-focus-within:opacity-100 transition-opacity" />
        <SearchIcon className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={28} />
        <input type="text" value={query} onChange={e => setQuery(e.target.value)}
          placeholder={t.blogSearchPh || "Rechercher un article..."}
          className="relative w-full bg-white border border-slate-200 rounded-[3rem] py-6 pl-20 pr-10 text-lg font-medium text-slate-900 shadow-sm focus:ring-0 focus:border-indigo-400 outline-none transition-all" />
        <AnimatePresence>
          {query && (
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setQuery("")}
              className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-2xl font-black">
              ×
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
        className="mt-20 border border-slate-200 bg-white rounded-[3rem] p-20 text-center shadow-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-200 to-transparent" />
        <div className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
          <SearchIcon size={36} className="text-slate-400" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">{t.blogEmptyTitle || "Aucun article pour le moment"}</h2>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">{t.blogEmptySub || "Nos articles seront publiés prochainement. Revenez bientôt !"}</p>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setQuery("")}
          className="bg-indigo-600 text-white font-bold px-8 py-4 rounded-full tracking-widest uppercase text-sm shadow-md shadow-indigo-200">
          {t.blogReset || "Réinitialiser"}
        </motion.button>
      </motion.div>
    </div>
  );
}
