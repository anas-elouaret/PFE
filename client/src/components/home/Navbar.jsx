import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";
import { Volume2, VolumeX } from "lucide-react";

const services = [
  { name: "Business Cards", path: "/business-cards" },
  { name: "Flyers", path: "/flyers" },
  { name: "Packaging", path: "/packaging" },
  { name: "Merch", path: "/merch" },
];

const LANGUAGES = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

/* ── SVG icons ───────────────────────────────── */
const Globe = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
const ChevronDown = ({ open }) => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}><path d="m6 9 6 6 6-6"/></svg>;
const UserCircle = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>;
const LogoutIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const SparkleIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>;

export default function Navbar({ isScrolled, onLogout }) {
  const { lang, setLang, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const langRef = useRef(null);
  const authRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = !!onLogout;

  /* Close dropdowns on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (authRef.current && !authRef.current.contains(e.target)) setAuthOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Close mobile menu on navigate */
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const handleLogin = () => { setAuthOpen(false); navigate("/auth?mode=login"); };
  const handleJoin = () => { setAuthOpen(false); navigate("/auth?mode=register"); };
  const handleLogout = () => { setAuthOpen(false); onLogout?.(); };

  const activeLang = LANGUAGES.find(l => l.code === lang);

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-gray-900/95 backdrop-blur-xl border-b border-gray-800 shadow-lg">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4">

        {/* ── Logo ─────────────────── */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center group-hover:bg-[#22c55e] transition-colors duration-300">
            <div className="w-3.5 h-3.5 bg-[#22c55e] group-hover:bg-white rounded-full transition-colors duration-300" />
          </div>
          <span className="text-xl font-black tracking-tight text-white">Growstack</span>
        </Link>

        {/* ── Desktop Navigation ─────────────────── */}
        <nav className="hidden items-center gap-1 lg:flex">
          {/* Home Link */}
          <Link
            to="/"
            className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
              location.pathname === "/" ? "text-[#22c55e] bg-gray-800" : "text-gray-300 hover:text-white hover:bg-gray-800"
            }`}
          >
            {t("home")}
            {location.pathname === "/" && (
              <motion.div
                layoutId="nav-active"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#22c55e] rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </Link>

          {/* Service Links */}
          {services.map((service) => {
            const isActive = location.pathname === service.path;
            return (
              <Link
                key={service.path}
                to={service.path}
                className={`relative px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ${
                  isActive ? "text-[#22c55e] bg-gray-800" : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
              >
                {service.name}
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#22c55e] rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Right Controls ──────────────── */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* Language Switcher */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => { setLangOpen(p => !p); setAuthOpen(false); }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-300"
            >
              <Globe />
              <span className="text-base leading-none">{activeLang.flag}</span>
              <span dir="auto">{activeLang.label}</span>
              <ChevronDown open={langOpen} />
            </button>

            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-xl shadow-black/50 overflow-hidden z-50"
                >
                  <div className="px-4 pt-3 pb-2 border-b border-gray-700">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t("navbar.language")}</p>
                  </div>
                  {LANGUAGES.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors ${
                        lang === l.code ? "bg-[#00AEEF]/20 text-[#00AEEF]" : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      <span className="text-lg">{l.flag}</span>
                      <span className="flex-1 text-start" dir="auto">{l.label}</span>
                      {lang === l.code && <span className="w-2 h-2 bg-[#00AEEF] rounded-full shrink-0" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Auth Area */}
          {isLoggedIn ? (
            <div ref={authRef} className="relative">
              <button
                onClick={() => setAuthOpen(p => !p)}
                className="flex items-center gap-2.5 pl-3 pr-4 py-2 rounded-full border border-gray-700 hover:border-gray-600 transition-all duration-300 group bg-gray-800 hover:bg-gray-700"
              >
                <div className="w-7 h-7 rounded-full bg-[#22c55e] flex items-center justify-center text-black font-black text-xs">
                  U
                </div>
                <span className="text-sm font-semibold text-white">{t("navbar.myAccount")}</span>
                <ChevronDown open={authOpen} />
              </button>

              <AnimatePresence>
                {authOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-gray-900 border border-gray-700 rounded-xl shadow-xl shadow-black/50 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-gray-700">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#22c55e] flex items-center justify-center font-black text-black text-sm">U</div>
                        <div>
                          <p className="text-sm font-black text-white leading-tight">Utilisateur</p>
                          <p className="text-xs text-gray-400 font-medium">Compte actif ✓</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => navigate("/profile")}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                      >
                        <UserCircle /> {t("navbar.myAccount")}
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-900/50 transition-colors mt-1"
                      >
                        <LogoutIcon /> {t("navbar.logout")}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div ref={authRef} className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => { setAuthOpen(p => !p); setLangOpen(false); }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-gray-800 border border-transparent hover:border-gray-700 transition-all duration-300"
                >
                  <UserCircle />
                  {t("navbar.login")}
                  <ChevronDown open={authOpen} />
                </button>

                <AnimatePresence>
                  {authOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50"
                    >
                      <div className="bg-gray-800 p-5 relative overflow-hidden">
                        <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#22c55e]/10 blur-2xl rounded-full" />
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Bienvenue sur</p>
                        <p className="text-xl font-black text-white tracking-tight">Grow<span className="text-[#22c55e]">stack</span></p>
                        <p className="text-xs text-gray-400 font-medium mt-1">La plateforme UGC #1 au Maroc</p>
                      </div>

                      <div className="p-3 space-y-2">
                        <button
                          onClick={handleLogin}
                          className="w-full flex items-center justify-between px-4 py-3.5 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center shadow-sm border border-gray-600">
                              <UserCircle />
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-black text-white">{t("navbar.login")}</p>
                              <p className="text-xs text-gray-400">Accéder à mon compte</p>
                            </div>
                          </div>
                          <span className="text-gray-500 group-hover:text-white transition-colors font-bold">→</span>
                        </button>

                        <button
                          onClick={handleJoin}
                          className="w-full flex items-center justify-between px-4 py-3.5 rounded-lg bg-[#22c55e] hover:bg-[#16a34a] transition-colors group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-sm">
                              <SparkleIcon />
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-black text-black">{t("navbar.join")} — Gratuit</p>
                              <p className="text-xs text-black/70">Créer mon compte</p>
                            </div>
                          </div>
                          <span className="text-black/40 group-hover:text-black transition-colors font-bold">→</span>
                        </button>
                      </div>

                      <div className="px-4 pb-4">
                        <p className="text-xs text-center text-gray-400 font-medium">
                          En continuant, vous acceptez nos <span className="underline cursor-pointer">CGU</span>
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleJoin}
                className="flex items-center gap-2 rounded-full bg-[#22c55e] px-6 py-2.5 text-sm font-black text-black hover:bg-[#16a34a] transition-colors shadow-lg shadow-[#22c55e]/25"
              >
                <SparkleIcon />
                {t("navbar.startProject")}
              </motion.button>
            </div>
          )}
        </div>

        {/* ── Mobile hamburger ─────────────── */}
        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen(p => !p)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gray-800 lg:hidden hover:bg-gray-700 transition-colors"
        >
          <div className="flex flex-col gap-1.5 w-5">
            <div className={`h-0.5 w-full bg-white rounded-full transition-all duration-300 origin-center ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <div className={`h-0.5 w-full bg-white rounded-full transition-all duration-300 ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
            <div className={`h-0.5 w-full bg-white rounded-full transition-all duration-300 origin-center ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {/* ── Mobile Menu ──────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-gray-900 border-t border-gray-800 lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-6">
              {/* Home Link */}
              <Link
                to="/"
                className={`px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                  location.pathname === "/" ? "bg-gray-800 text-[#22c55e]" : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
            {t("home")}
              </Link>

              {/* Service Links */}
              {services.map((service) => (
                <Link
                  key={service.path}
                  to={service.path}
                  className={`px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                    location.pathname === service.path ? "bg-gray-800 text-[#22c55e]" : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {service.name}
                </Link>
              ))}

              <div className="h-px bg-gray-700 my-4" />

              {/* Language pills */}
              <div className="px-2 pb-2">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 px-2">{t("navbar.language")}</p>
                <div className="flex gap-2">
                  {LANGUAGES.map(l => (
                    <button
                      key={l.code}
                      onClick={() => setLang(l.code)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-black transition-all ${
                        lang === l.code ? "bg-[#00AEEF] text-black shadow-lg" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {l.flag} {l.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gray-700 my-4" />

              {/* Auth */}
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold text-red-400 hover:bg-red-900/50 transition-colors"
                >
                  <LogoutIcon /> {t("navbar.logout")}
                </button>
              ) : (
                <div className="space-y-3 px-2">
                  <button
                    onClick={handleLogin}
                    className="w-full flex items-center gap-3 px-5 py-4 rounded-xl bg-gray-800 text-base font-bold text-white hover:bg-gray-700 transition-colors"
                  >
                    <UserCircle /> {t("navbar.login")}
                  </button>
                  <button
                    onClick={handleJoin}
                    className="w-full flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-[#22c55e] text-black font-black text-sm tracking-wide hover:bg-[#16a34a] transition-colors"
                  >
                    <SparkleIcon /> {t("navbar.startProject")} →
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
