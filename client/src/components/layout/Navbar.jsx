import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import CartIcon from "../cart/CartIcon";
import {
  Volume2, VolumeX, ArrowRight, User,
  LayoutDashboard, Menu, X, Mail, LayoutGrid, Languages,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";

const INSTAGRAM_URL = "https://www.instagram.com/ste_2m/";

const iconProps = {
  strokeWidth: 2.5,
  strokeLinecap: "square",
  strokeLinejoin: "miter",
};

const LANGUAGES = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

export default function Navbar() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { muted, setMuted, setFlyTargetRect, actionTargetPulse, setActionTargetPulse, getCartQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);
  const actionButtonRef = useRef(null);
  const lang = i18n.language;

  const tabs = [
    { label: t("nav_home"), path: "/" },
    { label: t("nav_services"), path: "/services" },
    { label: t("nav_portfolio"), path: "/portfolio" },
    { label: t("nav_contact"), path: "/contact" },
  ];

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    const updateTargetRect = () => {
      const target = document.querySelector('[data-fly-target="start-project"]:not([hidden])') || actionButtonRef.current;
      if (target && typeof target.getBoundingClientRect === "function") {
        setFlyTargetRect(target.getBoundingClientRect());
      }
    };
    updateTargetRect();
    window.addEventListener("resize", updateTargetRect);
    window.addEventListener("scroll", updateTargetRect, { passive: true });
    return () => {
      window.removeEventListener("resize", updateTargetRect);
      window.removeEventListener("scroll", updateTargetRect);
    };
  }, [mobileOpen, setFlyTargetRect]);

  useEffect(() => {
    if (!actionTargetPulse) return;
    const timer = window.setTimeout(() => setActionTargetPulse(false), 550);
    return () => window.clearTimeout(timer);
  }, [actionTargetPulse, setActionTargetPulse]);

  const isActive = useCallback((path) => {
    if (path === "/") return location.pathname === "/";
    if (path === "/services") return location.pathname === "/services";
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  const activeLang = LANGUAGES.find(l => l.code === lang);

  return (
    <header className="fixed top-0 left-0 w-full z-[9999] bg-white border-b-2 border-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 border-2 border-black bg-black flex items-center justify-center">
              <LayoutGrid size={14} className="text-white" {...iconProps} />
            </div>
            <span className="text-lg font-black tracking-tighter text-black">
              GROWSTACK
            </span>
          </Link>

          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center gap-0.5">
              {tabs.map((tab) => {
                const active = isActive(tab.path);
                return (
                  <Link
                    key={tab.path}
                    to={tab.path}
                    className={`px-4 py-2 text-sm font-bold tracking-wide transition-colors duration-200 ${
                      active
                        ? "text-black"
                        : "text-black/50 hover:text-black"
                    }`}
                  >
                    {tab.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div ref={langRef} className="relative hidden sm:block">
              <button
                onClick={() => setLangOpen(p => !p)}
                className="flex items-center gap-1.5 px-2.5 py-2 text-sm font-bold text-black/60 hover:text-black transition-colors duration-200"
              >
                <Languages size={16} {...iconProps} />
                <span className="text-base leading-none">{activeLang?.flag}</span>
                <svg className={`w-3 h-3 transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 6, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 top-full w-40 border-2 border-black bg-white shadow-lg overflow-hidden z-50"
                  >
                    {LANGUAGES.map(l => (
                      <button
                        key={l.code}
                        onClick={() => { i18n.changeLanguage(l.code); setLangOpen(false); }}
                        className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm font-bold transition-colors ${lang === l.code ? "text-black bg-black/5" : "text-black/60 hover:text-black hover:bg-black/5"}`}
                      >
                        <span className="text-lg">{l.flag}</span>
                        <span className="flex-1 text-start" dir="auto">{l.label}</span>
                        {lang === l.code && <span className="w-1.5 h-1.5 bg-black" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setMuted(!muted)}
              className="hidden sm:flex p-2 text-black/60 hover:text-black transition-colors duration-200"
              title={muted ? t("nav_unmute") : t("nav_mute")}
            >
              {muted ? <VolumeX size={18} {...iconProps} /> : <Volume2 size={18} {...iconProps} />}
            </button>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center justify-center w-5 h-5 rounded-none z-10 opacity-100 hover:bg-slate-100 transition-colors duration-200"
              title="Instagram @ste_2m"
              style={{
                background: "linear-gradient(135deg, #5851DB 0%, #C13584 40%, #F77737 70%, #FCAF45 100%)",
              }}
            >
              <FaInstagram size={14} className="text-white" />
            </a>

            <CartIcon />

            <Link
              to={isAuthenticated ? "/client/dashboard" : "/client/login"}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold border-2 border-black text-black hover:bg-black hover:text-white transition-colors duration-200"
            >
              {isAuthenticated ? <LayoutDashboard size={16} {...iconProps} /> : <User size={16} {...iconProps} />}
              <span className="hidden lg:inline">{isAuthenticated ? t("nav_dashboard") : t("nav_espace")}</span>
            </Link>

            <motion.div className="relative hidden sm:inline-flex">
              <Link
                ref={actionButtonRef}
                to="/get-started"
                data-fly-target="start-project"
                className="inline-flex items-center gap-2 border-2 border-black bg-black px-5 py-2 text-sm font-bold text-white hover:bg-white hover:text-black transition-colors duration-200 active:scale-[0.97]"
              >
                {t("nav_start")}
                <ArrowRight className="w-3.5 h-3.5" {...iconProps} />
              </Link>

              {actionTargetPulse && (
                <motion.span
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.3 }}
                  className="absolute -bottom-9 left-1/2 -translate-x-1/2 border-2 border-black bg-black text-white px-3 py-1 text-xs font-bold shadow-lg z-50 whitespace-nowrap"
                >
                  +{getCartQuantity()} selected
                </motion.span>
              )}
            </motion.div>

            <button
              onClick={() => setMobileOpen(p => !p)}
              className="md:hidden relative w-10 h-10 flex items-center justify-center text-black/60 hover:text-black transition-colors duration-200"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={18} {...iconProps} /> : <Menu size={18} {...iconProps} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t-2 border-black bg-white"
          >
            <div className="px-4 py-6 space-y-1 max-w-md mx-auto">
              {tabs.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.2 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 text-sm font-bold transition-colors duration-200 ${
                      isActive(link.path) ? "text-black bg-black/5" : "text-black/60 hover:text-black hover:bg-black/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.25 }}
              className="px-4 pb-8 space-y-3 max-w-md mx-auto"
            >
              <Link
                to="/get-started"
                data-fly-target="start-project"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-center gap-2 border-2 border-black bg-black px-5 py-3.5 text-sm font-bold text-white hover:bg-white hover:text-black transition-colors duration-200"
              >
                {t("nav_start")}
                <ArrowRight className="w-4 h-4" {...iconProps} />
              </Link>
              <Link
                to={isAuthenticated ? "/client/dashboard" : "/client/login"}
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-center gap-2 border-2 border-black px-5 py-3.5 text-sm font-bold text-black/60 hover:text-black hover:bg-black/5 transition-colors duration-200"
              >
                {isAuthenticated ? <LayoutDashboard size={16} {...iconProps} /> : <User size={16} {...iconProps} />}
                {isAuthenticated ? t("nav_dashboard") : t("nav_espace")}
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="w-full flex flex-col items-center justify-center gap-1 border-2 border-black px-5 py-3 text-sm font-bold text-black/60 hover:text-black hover:bg-black/5 transition-colors duration-200"
              >
                <span className="flex items-center gap-2">
                  <Mail size={16} {...iconProps} />
                  {t("nav_contact")}
                </span>
                <span className="text-[9px] font-black uppercase tracking-wider text-black/60">
                  Disponible 24/24h 7/7j
                </span>
              </Link>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-center gap-2 border-2 border-black px-5 py-3.5 text-sm font-bold text-black/60 hover:text-black hover:bg-black/5 transition-colors duration-200"
              >
                <FaInstagram size={16} />
                Instagram @ste_2m
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
