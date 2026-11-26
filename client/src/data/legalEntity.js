/**
 * The single place the business's own details live.
 *
 * Everything here is either already published on this site (the contact page)
 * or stated by the founder. Fields that could not be verified are left empty
 * on purpose, and every page that reads this file omits an empty field rather
 * than printing a placeholder: a legal notice carrying an invented or stale
 * registration number is worse than one that is short.
 *
 * To complete the legal notice, fill `registration` below with the current
 * values from the business's own papers. Nothing else needs changing.
 */
export const entity = {
  // --- verified: published on /contact ---
  tradingName: "GROWSTACK",
  founder: "Anas Elouaret",
  email: "growstackagency@gmail.com",
  phone: "+212 631-711680",
  whatsapp: "+212631711680",
  city: "Casablanca",
  country: "Maroc",
  countryCode: "MA",
  instagram: "@ste_2m",
  instagramUrl: "https://www.instagram.com/ste_2m/",
  site: "https://growstack.ma",

  // Who answers for what is published here.
  publicationDirector: "Anas Elouaret",

  // --- verified: the site runs on Vercel ---
  host: {
    name: "Vercel Inc.",
    address: "440 N Barranca Ave #4133, Covina, CA 91723, United States",
    site: "https://vercel.com",
  },

  // --- NOT verified: fill from the business's own papers ---
  // legalForm:  e.g. "Auto-entrepreneur" / "SARL AU"
  // rc:         Registre de commerce number + the court that issued it
  // ice:        Identifiant Commun de l'Entreprise (15 digits)
  // taxId:      Identifiant fiscal
  // tp:         Taxe professionnelle
  // address:    full street address, if you want it published
  registration: {
    legalForm: "",
    rc: "",
    ice: "",
    taxId: "",
    tp: "",
    address: "",
  },
};

/** The registration rows that are actually filled in, in display order. */
export function registrationRows(labels) {
  const order = ["legalForm", "rc", "ice", "taxId", "tp", "address"];
  return order
    .filter((k) => entity.registration[k])
    .map((k) => ({ key: k, label: labels[k], value: entity.registration[k] }));
}

/** True while the business's registration details have not been supplied. */
export const registrationIncomplete = Object.values(entity.registration).every((v) => !v);

export default entity;
