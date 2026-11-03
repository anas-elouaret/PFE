/**
 * French and Arabic names for the service catalogue.
 *
 * The catalogue in `*ServicesData.js` is written in English and was shown in
 * English whatever the visitor had selected — including in French, which is
 * the site's default. Rather than rewrite six data files, the English stays
 * where it is and this overlay supplies the other two languages, keyed by
 * service id.
 *
 * Adding a service: add its id here too, in both languages. A missing entry
 * falls back to the English name rather than breaking, so the gap shows up as
 * an untranslated card and not as a blank one.
 */
export const serviceTitles = {
  // Graphic design
  "logo-design": { fr: "Design de logo", ar: "تصميم الشعار" },
  "brand-identity": { fr: "Identité de marque", ar: "الهوية البصرية" },
  "social-media-design": { fr: "Design réseaux sociaux", ar: "تصاميم مواقع التواصل" },
  "poster-design": { fr: "Design d'affiche", ar: "تصميم الملصقات" },
  "flyer-design": { fr: "Design de flyer", ar: "تصميم الفلايرات" },
  "business-cards": { fr: "Cartes de visite", ar: "بطاقات الزيارة" },
  "packaging-design": { fr: "Design de packaging", ar: "تصميم التغليف" },
  "infographic-design": { fr: "Infographie", ar: "تصميم الإنفوغرافيك" },
  "brand-starter": { fr: "Pack Marque Essentiel", ar: "باقة الهوية الأساسية" },
  "print-essentials": { fr: "Pack Impression Essentiel", ar: "باقة المطبوعات الأساسية" },

  // Social media
  "ig-management": { fr: "Gestion Instagram", ar: "تسيير إنستغرام" },
  "fb-management": { fr: "Gestion Facebook", ar: "تسيير فيسبوك" },
  "tiktok-management": { fr: "Gestion TikTok", ar: "تسيير تيك توك" },
  "linkedin-management": { fr: "Gestion LinkedIn", ar: "تسيير لينكد إن" },
  "content-calendar": { fr: "Calendrier de contenu", ar: "رزنامة المحتوى" },
  "community-management": { fr: "Gestion de communauté", ar: "تسيير المجتمع" },
  "analytics-reporting": { fr: "Analyse & reporting", ar: "التحليل والتقارير" },
  "social-starter": { fr: "Pack Réseaux Essentiel", ar: "باقة التواصل الأساسية" },
  "social-growth": { fr: "Pack Réseaux Croissance", ar: "باقة التواصل للنمو" },

  // Marketing strategy
  "brand-positioning": { fr: "Positionnement de marque", ar: "تموضع العلامة" },
  "market-research": { fr: "Étude de marché", ar: "دراسة السوق" },
  "competitor-analysis": { fr: "Analyse concurrentielle", ar: "تحليل المنافسين" },
  "content-strategy": { fr: "Stratégie de contenu", ar: "استراتيجية المحتوى" },
  "funnel-strategy": { fr: "Stratégie de tunnel", ar: "استراتيجية مسار التحويل" },
  "launch-strategy": { fr: "Stratégie de lancement", ar: "استراتيجية الإطلاق" },
  "growth-strategy": { fr: "Stratégie de croissance", ar: "استراتيجية النمو" },
  "strategy-essentials": { fr: "Pack Stratégie Essentiel", ar: "باقة الاستراتيجية الأساسية" },
  "growth-accelerator": { fr: "Accélérateur de croissance", ar: "مسرّع النمو" },

  // UGC
  "tiktok-videos": { fr: "Vidéos UGC TikTok", ar: "فيديوهات UGC لتيك توك" },
  "instagram-reels": { fr: "Reels Instagram", ar: "ريلز إنستغرام" },
  "product-reviews": { fr: "Avis produit", ar: "مراجعات المنتجات" },
  "unboxing-videos": { fr: "Vidéos d'unboxing", ar: "فيديوهات فتح العلب" },
  "lifestyle-videos": { fr: "Contenu lifestyle", ar: "محتوى نمط الحياة" },
  "storytelling-ads": { fr: "Publicités narratives", ar: "إعلانات بأسلوب القصة" },
  "tutorial-videos": { fr: "Vidéos tutoriel", ar: "فيديوهات تعليمية" },
  "before-after": { fr: "Vidéos avant / après", ar: "فيديوهات قبل وبعد" },
  "ugc-starter": { fr: "Pack UGC Essentiel", ar: "باقة UGC الأساسية" },
  "ugc-complete": { fr: "Suite UGC Complète", ar: "حزمة UGC الكاملة" },

  // Photography
  "product-photography": { fr: "Photographie produit", ar: "تصوير المنتجات" },
  "lifestyle-photography": { fr: "Photographie lifestyle", ar: "تصوير نمط الحياة" },
  "corporate-photography": { fr: "Photographie corporate", ar: "تصوير الشركات" },
  "event-photography": { fr: "Photographie d'événement", ar: "تصوير الفعاليات" },
  "food-photography": { fr: "Photographie culinaire", ar: "تصوير الأطعمة" },
  "ecommerce-photography": { fr: "Photographie e-commerce", ar: "تصوير للمتاجر الإلكترونية" },
  "fashion-photography": { fr: "Photographie mode", ar: "تصوير الموضة" },
  "real-estate-photography": { fr: "Photographie immobilière", ar: "التصوير العقاري" },
  "portrait-photography": { fr: "Photographie portrait", ar: "تصوير البورتريه" },
  "architectural-photography": { fr: "Photographie d'architecture", ar: "التصوير المعماري" },
  "photo-starter": { fr: "Pack Photo Essentiel", ar: "باقة التصوير الأساسية" },
  "photo-complete": { fr: "Suite Photo Complète", ar: "حزمة التصوير الكاملة" },

  // Web
  "site-web": { fr: "Création de site web", ar: "إنشاء موقع إلكتروني" },
  "seo-referencement": { fr: "SEO & référencement", ar: "تحسين الظهور في محركات البحث" },
  deployment: { fr: "Mise en ligne", ar: "النشر والاستضافة" },
  "dashboard-creation": { fr: "Création de dashboard", ar: "إنشاء لوحة تحكم" },
  "landing-page": { fr: "Landing page", ar: "صفحة هبوط" },
  portfolio: { fr: "Site portfolio", ar: "موقع أعمال" },
  "web-complet": { fr: "Site web complet", ar: "موقع إلكتروني كامل" },
  "presence-en-ligne": { fr: "Présence en ligne", ar: "الحضور الرقمي" },
};

/**
 * The service's name in the given language, falling back to whatever the
 * catalogue holds.
 */
export function localizedServiceTitle(service, language) {
  if (!service) return "";
  const lang = String(language || "").split("-")[0];
  const base = service.title || service.name || "";
  if (lang === "en") return base;
  return serviceTitles[service.id]?.[lang] || base;
}
