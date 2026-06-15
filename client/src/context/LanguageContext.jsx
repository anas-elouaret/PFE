import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const { i18n, t } = useTranslation();
  const [lang, setLangState] = useState(() => localStorage.getItem("app_lang") || i18n.language || "fr");

  useEffect(() => {
    const handleLangChange = (lng) => {
      setLangState(lng);
      localStorage.setItem("app_lang", lng);
      document.documentElement.lang = lng;
      document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
    };
    i18n.on("languageChanged", handleLangChange);
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
    return () => {
      i18n.off("languageChanged", handleLangChange);
    };
  }, [i18n, lang]);

  const setLang = useCallback((lng) => {
    i18n.changeLanguage(lng);
  }, [i18n]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    const { t } = useTranslation();
    return { lang: "fr", setLang: () => {}, t };
  }
  return ctx;
}

function LangWrapper({ children }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}

export default LangWrapper;
