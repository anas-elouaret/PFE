import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const navKeys = [
  { key: "home",    path: "/" },
  { key: "catalog", path: "/catalog" },
  { key: "contact", path: "/contact" },
  { key: "blog",    path: "/blog" },
];

const socialLinks = [
  { label: "Instagram", href: "#", icon: "M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3zm4.5 4.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zm5.1-.6h.01" },
  { label: "LinkedIn",  href: "#", icon: "M7 8.7V19M7 5.3a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6zM12 19v-5.3c0-1.5.8-2.7 2.4-2.7 1.4 0 2.1 1 2.1 2.7V19" },
  { label: "TikTok",   href: "#", icon: "M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" },
];

export default function FooterSection() {
  const { t } = useLanguage();

  return (
    <footer className="relative bg-black text-white overflow-hidden">
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-[#d1ff00]/5 blur-[100px] rounded-full" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-20 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr_1fr] gap-16 border-b border-white/5">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-[#d1ff00] rounded-xl flex items-center justify-center">
                <div className="w-3 h-3 bg-black rounded-full"></div>
              </div>
              <span className="text-2xl font-black tracking-tight">Growstack</span>
            </div>
            <p className="text-gray-500 font-medium leading-relaxed max-w-xs mb-10">{t.footerTagline}</p>
            <div className="flex items-center gap-3">
              {socialLinks.map(s => (
                <motion.a key={s.label} href={s.href} whileHover={{ scale: 1.1, backgroundColor: "#d1ff00" }}
                  aria-label={s.label}
                  className="w-11 h-11 bg-white/5 border border-white/10 text-gray-400 hover:text-black rounded-full flex items-center justify-center transition-colors duration-300">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d={s.icon} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-600 mb-8">{t.footerNav}</h4>
            <nav>
              <ul className="space-y-4">
                {navKeys.map(item => (
                  <li key={item.key}>
                    <Link to={item.path} className="text-gray-400 font-bold hover:text-[#d1ff00] transition-colors text-sm flex items-center gap-2 group">
                      <span className="w-0 group-hover:w-4 h-0.5 bg-[#d1ff00] transition-all duration-300"></span>
                      {t[item.key]}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-600 mb-8">{t.footerContact}</h4>
            <div className="space-y-4">
              <p className="text-gray-400 font-bold text-sm">contact@growstack.com</p>
              <p className="text-gray-400 font-bold text-sm">+212 663-460466</p>
              <p className="text-gray-400 font-bold text-sm">Casablanca, Morocco</p>
            </div>
            <motion.a href="/contact" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              className="mt-10 inline-flex items-center gap-3 bg-[#d1ff00] text-black font-black px-8 py-4 rounded-[2rem] text-xs uppercase tracking-widest shadow-xl shadow-[#d1ff00]/20">
              {t.footerStart}
            </motion.a>
          </div>
        </div>

        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 font-bold text-xs tracking-widest uppercase">{t.footerCopy}</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-600 font-bold text-xs hover:text-gray-400 transition-colors uppercase tracking-widest">{t.footerPrivacy}</a>
            <a href="#" className="text-gray-600 font-bold text-xs hover:text-gray-400 transition-colors uppercase tracking-widest">{t.footerTerms}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
