import { useRef, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import CartIcon from "../cart/CartIcon";
import {
  Volume2, VolumeX, ArrowRight, User,
  LayoutDashboard, Languages, Menu, X,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";

const INSTAGRAM_URL = "https://www.instagram.com/ste_2m/";

const iconProps = {
  strokeWidth: 2.5,
  strokeLinecap: "square",
  strokeLinejoin: "miter",
};

const tabs = [
  { labelKey: "nav_home", path: "/" },
  { labelKey: "nav_services", path: "/services" },
  { labelKey: "nav_portfolio", path: "/portfolio" },
  { labelKey: "nav_contact", path: "/contact" },
];

const LANGUAGES = [
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

export default function GlowingTabsNavbar() {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { muted, setMuted } = useCart();
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    if (path === "/services") return location.pathname.startsWith("/services");
    return location.pathname.startsWith(path);
  };

  const activeLang = LANGUAGES.find((l) => l.code === i18n.language);

  return (
    <header className="sticky top-0 z-[9999] bg-white border-b-2 border-black">
      <nav>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0 group">
              <div className="w-8 h-8 border-2 border-black bg-black flex items-center justify-center group-hover:bg-white transition-colors duration-200">
                <span className="text-white group-hover:text-black text-xs font-black tracking-tighter transition-colors duration-200">G</span>
              </div>
              <span className="text-base font-black tracking-tighter text-black">
                GROWSTACK
              </span>
            </Link>

            {/* Desktop Tabs */}
            <div className="hidden md:flex items-center gap-1">
              {tabs.map((tab) => {
                const active = isActive(tab.path);
                return (
                  <Link
                    key={tab.path}
                    to={tab.path}
                    className="relative px-4 py-2 text-sm font-bold tracking-wide transition-colors duration-200"
                  >
                    {active && (
                      <motion.div
                        layoutId="glow"
                        className="absolute inset-0 border-2 border-black bg-black/5"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className={`relative z-10 transition-colors duration-200 ${
                      active ? "text-black" : "text-black/50 hover:text-black"
                    }`}>
                      {t(tab.labelKey)}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5">
              {/* Language */}
              <div ref={langRef} className="relative hidden sm:block">
                <button
                  onClick={() => setLangOpen((p) => !p)}
                  className="flex items-center gap-1.5 px-2.5 py-2 text-sm font-bold text-black/60 hover:text-black transition-colors duration-200"
                >
                  <Languages size={16} {...iconProps} />
                  <span className="text-base leading-none">{activeLang?.flag}</span>
                </button>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 4 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 top-full w-40 border-2 border-black bg-white shadow-lg overflow-hidden z-50"
                  >
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { i18n.changeLanguage(l.code); setLangOpen(false); }}
                        className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm font-bold transition-colors ${i18n.language === l.code ? "text-black bg-black/5" : "text-black/60 hover:text-black hover:bg-black/5"}`}
                      >
                        <span className="text-lg">{l.flag}</span>
                        <span className="flex-1 text-start" dir="auto">{l.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Mute */}
              <button
                onClick={() => setMuted(!muted)}
                className="hidden sm:flex p-2 text-black/60 hover:text-black transition-colors duration-200"
                title={muted ? t("nav_unmute") : t("nav_mute")}
              >
                {muted ? <VolumeX size={18} {...iconProps} /> : <Volume2 size={18} {...iconProps} />}
              </button>

              {/* Instagram */}
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

              {/* Cart */}
              <CartIcon />

              {/* Auth */}
              <Link
                to={isAuthenticated ? "/client/dashboard" : "/client/login"}
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold border-2 border-black text-black hover:bg-black hover:text-white transition-colors duration-200"
              >
                {isAuthenticated ? <LayoutDashboard size={16} {...iconProps} /> : <User size={16} {...iconProps} />}
                <span className="hidden lg:inline">{isAuthenticated ? t("nav_dashboard") : t("nav_espace")}</span>
              </Link>

              {/* CTA */}
              <Link
                to="/get-started"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-black hover:bg-white hover:text-black border-2 border-black transition-colors duration-200"
              >
                {t("nav_start")}
                <ArrowRight className="w-3.5 h-3.5" {...iconProps} />
              </Link>

              {/* Mobile Toggle */}
              <button
                onClick={() => setMobileOpen((p) => !p)}
                className="md:hidden relative w-10 h-10 flex items-center justify-center text-black/60 hover:text-black transition-colors duration-200"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                {mobileOpen ? <X size={18} {...iconProps} /> : <Menu size={18} {...iconProps} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="md:hidden border-t-2 border-black bg-white"
          >
            <div className="px-4 py-6 space-y-1 max-w-md mx-auto">
              {tabs.map((tab) => (
                <Link
                  key={tab.path}
                  to={tab.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 text-sm font-bold transition-colors duration-200 ${
                    isActive(tab.path) ? "text-black bg-black/5" : "text-black/60 hover:text-black hover:bg-black/5"
                  }`}
                >
                  {t(tab.labelKey)}
                </Link>
              ))}
            </div>

            <div className="px-4 pb-8 space-y-3 max-w-md mx-auto">
              <Link
                to={isAuthenticated ? "/client/dashboard" : "/client/login"}
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-center gap-2 border-2 border-black px-5 py-3 text-sm font-bold text-black/60 hover:text-black hover:bg-black/5 transition-colors duration-200"
              >
                {isAuthenticated ? <LayoutDashboard size={16} {...iconProps} /> : <User size={16} {...iconProps} />}
                {isAuthenticated ? t("nav_dashboard") : t("nav_espace")}
              </Link>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-center gap-2 border-2 border-black px-5 py-3 text-sm font-bold text-black/60 hover:text-black hover:bg-black/5 transition-colors duration-200"
              >
                <FaInstagram size={16} />
                Instagram @ste_2m
              </a>
            </div>
          </motion.div>
        )}
      </nav>
    </header>
  );
}
