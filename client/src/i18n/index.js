import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/translation.json";
import fr from "./locales/fr/translation.json";
import ar from "./locales/ar/translation.json";

// Languages that read right to left. The document direction is set from this,
// which is what makes the whole layout mirror: the components use logical
// Tailwind utilities (ms/me/ps/pe/start/end), so they follow the direction
// rather than being hard-wired to the left.
export const RTL_LANGUAGES = ["ar"];

export function isRtl(language) {
  return RTL_LANGUAGES.includes(String(language || "").split("-")[0]);
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      ar: { translation: ar },
    },
    // Arabic covers the public site; anything not translated yet, such as the
    // admin area, falls back to French rather than showing a bare key.
    fallbackLng: "fr",
    supportedLngs: ["fr", "en", "ar"],
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "app_lang",
    },
  });

function applyDocumentLanguage(lng) {
  const root = document.documentElement;
  root.lang = lng;
  root.dir = isRtl(lng) ? "rtl" : "ltr";
}

applyDocumentLanguage(i18n.language || "fr");
i18n.on("languageChanged", applyDocumentLanguage);

export default i18n;
