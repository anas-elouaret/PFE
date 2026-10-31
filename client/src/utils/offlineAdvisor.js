/**
 * The answer a visitor gets when the live AI advisor cannot be reached.
 *
 * Every price here is read from the service catalogue at runtime, never typed
 * out by hand. A hand-written copy of the catalogue is a copy that silently
 * goes stale, and a chatbot quoting a price the site no longer charges is
 * worse than a chatbot that says nothing.
 *
 * The catalogue is pulled in with a dynamic import so it stays out of the
 * first page load: this file is reached only when the advisor is down.
 */

const CATEGORY_ROUTES = {
  "graphic-design": "/services",
  "social-media": "/services/social-media",
  "marketing-strategy": "/services/marketing-strategy",
  ugc: "/services/ugc",
  photography: "/services/photography",
  "web-development": "/services",
};

const CATEGORY_LABELS = {
  fr: {
    "graphic-design": "Design graphique",
    "social-media": "Gestion des réseaux sociaux",
    "marketing-strategy": "Stratégie marketing",
    ugc: "Contenu UGC",
    photography: "Photographie",
    "web-development": "Développement web",
  },
  ar: {
    "graphic-design": "التصميم الجرافيكي",
    "social-media": "تسيير مواقع التواصل",
    "marketing-strategy": "استراتيجية التسويق",
    ugc: "محتوى UGC",
    photography: "التصوير",
    "web-development": "تطوير المواقع",
  },
};

// The catalogue is written in English; visitors write French, darija or Arabic.
// These are the words they actually use, mapped onto a category.
const INTENTS = [
  {
    category: "photography",
    words: ["photo", "photographie", "photographe", "shooting", "seance photo", "séance photo", "cliche", "image produit", "تصوير", "صور", "تصويرة", "فوطو"],
  },
  {
    category: "social-media",
    words: ["instagram", "insta", "tiktok", "facebook", "linkedin", "reseaux", "réseaux", "reseaux sociaux", "community", "page", "abonnes", "abonnés", "publication", "انستغرام", "تيكتوك", "فيسبوك", "سوشيال", "صفحة", "منشورات"],
  },
  {
    category: "graphic-design",
    words: ["logo", "identite", "identité", "charte", "design", "graphisme", "affiche", "packaging", "visuel", "maquette", "شعار", "تصميم", "هوية", "لوغو", "ديزاين"],
  },
  {
    category: "web-development",
    words: ["site", "site web", "website", "application", "app", "developpement", "développement", "landing", "boutique", "ecommerce", "e-commerce", "dashboard", "موقع", "تطبيق", "متجر"],
  },
  {
    category: "ugc",
    words: ["ugc", "video", "vidéo", "reel", "reels", "short", "avis produit", "unboxing", "temoignage", "témoignage", "createur", "créateur", "فيديو", "فيديوهات", "ريلز"],
  },
  {
    category: "marketing-strategy",
    words: ["strategie", "stratégie", "marketing", "positionnement", "lancement", "croissance", "growth", "audit", "etude", "étude", "cible", "استراتيجية", "تسويق", "إطلاق", "دراسة"],
  },
];

const PRINTING_WORDS = ["impression", "imprimer", "print", "flyer", "flyers", "carte de visite", "cartes de visite", "brochure", "affiche imprimee", "merch", "طباعة", "فلاير", "كارت"];
const PRICE_WORDS = ["prix", "tarif", "tarifs", "combien", "cout", "coût", "budget", "devis", "cher", "ثمن", "تمن", "شحال", "بشحال", "الثمن", "ميزانية"];
const CONTACT_WORDS = ["contact", "contacter", "appeler", "telephone", "téléphone", "whatsapp", "email", "mail", "joindre", "parler", "rendez-vous", "تواصل", "نتواصل", "هاتف", "تيليفون", "واتساب", "ايميل"];
const ORDER_WORDS = ["commander", "commande", "acheter", "demarrer", "démarrer", "projet", "lancer", "طلب", "نطلب", "مشروع", "نبدا"];
const GREETING_WORDS = ["bonjour", "salut", "bonsoir", "hello", "hi", "coucou", "سلام", "السلام", "اهلا", "أهلا", "مرحبا", "صباح", "مساء", "لاباس"];

const CONTACT = {
  email: "growstackagency@gmail.com",
  phone: "+212 631-711680",
  instagram: "@ste_2m",
};

let catalogue = null;

async function loadCatalogue() {
  if (catalogue) return catalogue;
  const { categoryGroups } = await import("../data/servicesHubData");
  catalogue = categoryGroups;
  return catalogue;
}

/** Arabic script anywhere in the message means the visitor wrote in Arabic. */
export function detectLanguage(text) {
  return /[؀-ۿ]/.test(text) ? "ar" : "fr";
}

function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function hasAny(haystack, words) {
  return words.some((w) => haystack.includes(w));
}

function formatPrice(value) {
  return new Intl.NumberFormat("fr-FR").format(value);
}

/**
 * A few services of a category, with their real catalogue prices.
 *
 * What the visitor actually named comes first — asking about Instagram should
 * surface Instagram Management, not whichever service happens to be cheapest.
 * Flagship services come next, and price breaks the remaining ties.
 */
function quoteCategory(group, query, limit = 3) {
  const relevance = (s) => {
    const terms = [s.title, ...(s.tags || [])].map(normalize);
    return terms.some((term) => term.length > 2 && query.includes(term)) ? 1 : 0;
  };

  const picked = [...group.services]
    .filter((s) => typeof s.price === "number")
    .sort(
      (a, b) =>
        relevance(b) - relevance(a) ||
        Number(Boolean(b.popular)) - Number(Boolean(a.popular)) ||
        a.price - b.price
    )
    .slice(0, limit);

  return picked.map((s) => `${s.title} — ${formatPrice(s.price)} MAD`).join(" · ");
}

function cheapest(group) {
  const prices = group.services.map((s) => s.price).filter((p) => typeof p === "number");
  return prices.length ? Math.min(...prices) : null;
}

/**
 * Answers a visitor's question from the catalogue alone.
 *
 * @returns {Promise<{ text: string, link: { path: string, label: string } | null }>}
 */
export async function answerOffline(question) {
  const lang = detectLanguage(question);
  const q = normalize(question);
  const ar = lang === "ar";

  if (hasAny(q, PRINTING_WORDS)) {
    return {
      text: ar
        ? "عندنا خدمات الطباعة: كارت الزيارة، الفلايرات، البروشورات والتغليف. الأثمنة كتبدل حسب الكمية والورق، فكتب لينا الكمية لي بغيتي ونعطيوك الثمن بالضبط."
        : "Nous faisons l'impression : cartes de visite, flyers, brochures et packaging. Le prix dépend de la quantité et du papier — dites-nous la quantité souhaitée et nous vous chiffrons cela précisément.",
      link: { path: "/printing", label: ar ? "خدمات الطباعة" : "Services d'impression" },
    };
  }

  const groups = await loadCatalogue();
  const matched = [];
  for (const intent of INTENTS) {
    if (hasAny(q, intent.words)) {
      const group = groups.find((g) => g.id === intent.category);
      if (group) matched.push(group);
    }
  }

  if (matched.length === 1) {
    const group = matched[0];
    const label = CATEGORY_LABELS[lang][group.id] || group.name;
    return {
      text: ar
        ? `فـ${label} عندنا: ${quoteCategory(group, q)}. كل خدمة فيها التفاصيل كاملة فالصفحة ديالها، وإلى خديتي بزاف ديال الخدمات كيتنقص الثمن أوتوماتيكيا (10% بجوج، 15% بثلاثة، 20% بأربعة فما فوق).`
        : `En ${label.toLowerCase()}, nous proposons : ${quoteCategory(group, q)}. Le détail de chaque prestation est sur sa page, et la remise s'applique automatiquement dès plusieurs services (10% pour 2, 15% pour 3, 20% pour 4 et plus).`,
      link: {
        path: CATEGORY_ROUTES[group.id] || "/services",
        label: ar ? "شوف الخدمات" : "Voir les services",
      },
    };
  }

  if (matched.length > 1) {
    const lines = matched
      .slice(0, 3)
      .map((g) => {
        const label = CATEGORY_LABELS[lang][g.id] || g.name;
        const from = cheapest(g);
        return from ? `${label} (${ar ? "من" : "à partir de"} ${formatPrice(from)} MAD)` : label;
      })
      .join(ar ? "، " : ", ");

    return {
      text: ar
        ? `هادشي كيدخل فـ: ${lines}. قوليا شنو كتبيع وشكون الزبون ديالك ونوجهك للخدمة لي كتخدم معاك.`
        : `Cela touche à : ${lines}. Dites-nous ce que vous vendez et à qui, et nous vous orientons vers la bonne prestation.`,
      link: { path: "/services", label: ar ? "جميع الخدمات" : "Toutes nos prestations" },
    };
  }

  if (hasAny(q, PRICE_WORDS)) {
    const lines = groups
      .map((g) => {
        const label = CATEGORY_LABELS[lang][g.id] || g.name;
        const from = cheapest(g);
        return from ? `${label} ${ar ? "من" : "dès"} ${formatPrice(from)} MAD` : null;
      })
      .filter(Boolean)
      .join(ar ? " · " : " · ");

    return {
      text: ar
        ? `الأثمنة كتبدا من: ${lines}. وكيتنقص الثمن أوتوماتيكيا ملي كتاخد أكثر من خدمة — 10% بجوج، 15% بثلاثة، 20% بأربعة فما فوق.`
        : `Nos tarifs démarrent à : ${lines}. Une remise s'applique automatiquement à partir de plusieurs services — 10% pour 2, 15% pour 3, 20% pour 4 et plus.`,
      link: { path: "/services", label: ar ? "شوف الأثمنة" : "Voir les tarifs" },
    };
  }

  if (hasAny(q, ORDER_WORDS)) {
    return {
      text: ar
        ? "باش تبدا مشروع: عمر الفورم بالمعلومات ديال مشروعك والفريق كيرجع ليك. إلى عندك شي سؤال قبل، كتب لينا على " + CONTACT.email + "."
        : "Pour démarrer : remplissez le formulaire de projet avec votre besoin, l'équipe revient vers vous. Une question avant ? Écrivez-nous à " + CONTACT.email + ".",
      link: { path: "/get-started", label: ar ? "بدا مشروع" : "Démarrer un projet" },
    };
  }

  if (hasAny(q, CONTACT_WORDS)) {
    return {
      text: ar
        ? `كتقدر توصل لينا على ${CONTACT.email}، ولا بالتيليفون ${CONTACT.phone}، ولا على إنستغرام ${CONTACT.instagram}.`
        : `Vous pouvez nous joindre à ${CONTACT.email}, par téléphone au ${CONTACT.phone}, ou sur Instagram ${CONTACT.instagram}.`,
      link: { path: "/contact", label: ar ? "تواصل معانا" : "Nous contacter" },
    };
  }

  if (hasAny(q, GREETING_WORDS)) {
    return {
      text: ar
        ? "سلام! GROWSTACK وكالة ديجيتال فالمغرب: تصميم، تصوير، محتوى UGC، تسيير السوشيال ميديا، استراتيجية تسويق، تطوير مواقع وطباعة. شنو كتبيع، ولا شنو المشروع لي فبالك؟"
        : "Bonjour ! GROWSTACK est une agence digitale au Maroc : design, photographie, contenu UGC, réseaux sociaux, stratégie marketing, développement web et impression. Que vendez-vous, ou quel est votre projet ?",
      link: null,
    };
  }

  const summary = groups
    .map((g) => CATEGORY_LABELS[lang][g.id] || g.name)
    .join(ar ? "، " : ", ");

  return {
    text: ar
      ? `كنخدمو فـ: ${summary}، وزيد الطباعة. قوليا شنو كتبيع وشنو ناقصك ونوجهك للخدمة المناسبة — ولا كتب لينا على ${CONTACT.email}.`
      : `Nous intervenons sur : ${summary}, ainsi que l'impression. Dites-nous ce que vous vendez et ce qu'il vous manque, nous vous orientons — ou écrivez-nous à ${CONTACT.email}.`,
    link: { path: "/services", label: ar ? "شوف الخدمات" : "Explorer nos services" },
  };
}

export const OFFLINE_NOTICE = {
  fr: "Le conseiller en direct est momentanément indisponible, voici ce que je peux vous dire :",
  ar: "المستشار المباشر ماشي متاح دابا، هاهو داكشي لي نقدر نقولو ليك:",
};
