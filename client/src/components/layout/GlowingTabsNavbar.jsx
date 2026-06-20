import { useRef, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import CartIcon from "../cart/CartIcon";
import {
  Volume2, VolumeX, ArrowRight, User,
  LayoutDashboard, Languages, Menu, X, Bot,
  ChevronDown, LogOut,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import AIChatModal from "./AIChatModal";

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
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const langRef = useRef(null);
  const profileRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
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
    <>
    <header className="sticky top-0 z-[9999] bg-white border-b border-slate-200">
      <nav>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0 group">
              <div className="w-8 h-8 border-2 border-slate-200 bg-white flex items-center justify-center group-hover:bg-slate-50 transition-colors duration-200">
                <span className="text-slate-900 text-xs font-black tracking-tighter">G</span>
              </div>
              <span className="text-base font-black tracking-tighter text-slate-900">
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
                        className="absolute inset-0 border-2 border-slate-200 bg-slate-100"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className={`relative z-10 transition-colors duration-200 ${
                      active ? "text-slate-900" : "text-slate-500 hover:text-slate-900"
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
                  className="flex items-center gap-1.5 px-2.5 py-2 text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors duration-200"
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
                    className="absolute right-0 top-full w-40 border-2 border-slate-200 bg-white overflow-hidden z-50"
                  >
                    {LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => { i18n.changeLanguage(l.code); setLangOpen(false); }}
                        className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm font-bold transition-colors ${i18n.language === l.code ? "text-slate-900 bg-slate-100" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"}`}
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
                className="hidden sm:flex p-2 text-slate-600 hover:text-slate-900 transition-colors duration-200"
                title={muted ? t("nav_unmute") : t("nav_mute")}
              >
                {muted ? <VolumeX size={18} {...iconProps} /> : <Volume2 size={18} {...iconProps} />}
              </button>

              {/* Instagram */}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center justify-center w-8 h-8 border-2 border-slate-200 bg-white text-slate-600 hover:text-orange-500 transition-colors duration-200"
                title="Instagram @ste_2m"
              >
                <FaInstagram size={14} />
              </a>

              {/* AI Consultant */}
              <button
                onClick={() => setAiOpen(true)}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 border-2 border-orange-500 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors duration-200"
              >
                <Bot size={14} strokeWidth={2.5} />
                {t("navbar.ai_consultant")}
              </button>

              {/* Cart */}
              <CartIcon />

              {/* Auth */}
              {isAuthenticated ? (
                <div ref={profileRef} className="relative hidden sm:block">
                  <button
                    onClick={() => setProfileOpen((p) => !p)}
                    className="flex items-center gap-2 px-3 py-2 border-2 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-200"
                  >
                    <div className="w-7 h-7 flex items-center justify-center bg-orange-500 text-white text-xs font-bold uppercase">
                      {(user?.name || user?.email || "U")[0]}
                    </div>
                    <span className="text-sm font-bold max-w-[100px] truncate hidden lg:inline">
                      {user?.name || user?.email || t("nav_profile")}
                    </span>
                    <ChevronDown size={14} {...iconProps} className={`transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                  </button>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 4 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 top-full w-52 border-2 border-slate-200 bg-white overflow-hidden z-50"
                    >
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-900 truncate">{user?.name || t("nav_profile")}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      </div>
                      <Link
                        to="/client/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                      >
                        <LayoutDashboard size={16} {...iconProps} />
                        {t("nav_dashboard")}
                      </Link>
                      <button
                        onClick={() => { setProfileOpen(false); logout(); }}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={16} {...iconProps} />
                        {t("nav_logout")}
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <Link
                  to="/client/login"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors duration-200"
                >
                  <User size={16} {...iconProps} />
                  <span className="hidden lg:inline">{t("nav_espace")}</span>
                </Link>
              )}

              {/* CTA */}
              <Link
                to="/get-started"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-orange-500 border-2 border-orange-500 hover:bg-orange-600 transition-colors duration-200"
              >
                {t("nav_start")}
                <ArrowRight className="w-3.5 h-3.5" {...iconProps} />
              </Link>

              {/* Mobile Toggle */}
              <button
                onClick={() => setMobileOpen((p) => !p)}
                className="md:hidden relative w-10 h-10 flex items-center justify-center text-slate-700 hover:text-slate-900 transition-colors duration-200"
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
            className="md:hidden border-t-2 border-slate-200 bg-white"
          >
            <div className="px-4 py-6 space-y-1 max-w-md mx-auto">
              {tabs.map((tab) => (
                <Link
                  key={tab.path}
                  to={tab.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-3 text-sm font-bold transition-colors duration-200 ${
                    isActive(tab.path) ? "text-slate-900 bg-slate-100" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {t(tab.labelKey)}
                </Link>
              ))}
            </div>

            <div className="px-4 pb-8 space-y-3 max-w-md mx-auto">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { i18n.changeLanguage(i18n.language === "fr" ? "en" : "fr"); setMobileOpen(false); }}
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-200"
                >
                  <Languages size={16} {...iconProps} />
                  {i18n.language === "fr" ? "EN" : "FR"}
                </button>
                <button
                  onClick={() => setMuted(!muted)}
                  className="flex-1 flex items-center justify-center gap-2 border-2 border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-200"
                >
                  {muted ? <VolumeX size={16} {...iconProps} /> : <Volume2 size={16} {...iconProps} />}
                  {muted ? t("nav_unmute") : t("nav_mute")}
                </button>
              </div>
              <button
                onClick={() => { setAiOpen(true); setMobileOpen(false); }}
                className="w-full flex items-center justify-center gap-2 border-2 border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-200"
              >
                <Bot size={16} strokeWidth={2.5} />
                {t("navbar.ai_consultant")}
              </button>
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 border-2 border-slate-200 bg-slate-50 mb-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-orange-500 text-white text-sm font-bold uppercase">
                      {(user?.name || user?.email || "U")[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{user?.name || t("nav_profile")}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/client/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="w-full flex items-center justify-center gap-2 border-2 border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-200"
                  >
                    <LayoutDashboard size={16} {...iconProps} />
                    {t("nav_dashboard")}
                  </Link>
                  <button
                    onClick={() => { setMobileOpen(false); logout(); }}
                    className="w-full flex items-center justify-center gap-2 border-2 border-slate-200 px-5 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors duration-200"
                  >
                    <LogOut size={16} {...iconProps} />
                    {t("nav_logout")}
                  </button>
                </>
              ) : (
                <Link
                  to="/client/login"
                  onClick={() => setMobileOpen(false)}
                  className="w-full flex items-center justify-center gap-2 border-2 border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-200"
                >
                  <User size={16} {...iconProps} />
                  {t("nav_espace")}
                </Link>
              )}
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-center gap-2 border-2 border-slate-200 px-5 py-3 text-sm font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors duration-200"
              >
                <FaInstagram size={16} />
                Instagram @ste_2m
              </a>
            </div>
          </motion.div>
        )}
      </nav>
    </header>

    <AIChatModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </>
  );
}
