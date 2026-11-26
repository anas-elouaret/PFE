import fr from "./fr";
import en from "./en";
import ar from "./ar";

const DOCS = { fr, en, ar };

/** Every legal document, with the route each one is served at. */
export const LEGAL_SLUGS = [
  "confidentialite",
  "cookies",
  "conditions",
  "remboursement",
  "mentions-legales",
];

/** Labels for the registration rows, per language. */
export const REGISTRATION_LABELS = {
  fr: {
    legalForm: "Forme juridique",
    rc: "Registre de commerce",
    ice: "ICE",
    taxId: "Identifiant fiscal",
    tp: "Taxe professionnelle",
    address: "Adresse",
  },
  en: {
    legalForm: "Legal form",
    rc: "Trade register",
    ice: "ICE",
    taxId: "Tax ID",
    tp: "Business tax",
    address: "Address",
  },
  ar: {
    legalForm: "الشكل القانوني",
    rc: "السجل التجاري",
    ice: "المعرف الموحد للمقاولة",
    taxId: "المعرف الضريبي",
    tp: "الضريبة المهنية",
    address: "العنوان",
  },
};

/**
 * One document, in the closest language we have.
 *
 * French is the fallback because it is the site's primary language and the
 * version the documents were drafted in.
 */
export function getLegalDoc(slug, language = "fr") {
  const lang = String(language).split("-")[0];
  const pack = DOCS[lang] || DOCS.fr;
  return pack[slug] || DOCS.fr[slug] || null;
}

export default DOCS;
