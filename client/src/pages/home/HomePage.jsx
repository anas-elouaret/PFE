import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight, Sparkles
} from "lucide-react";
import ComparisonTable from "../../components/home/ComparisonTable";
import WorkflowSection from "../../components/home/WorkflowSection";
import FaqSection from "../../components/home/FaqSection";
import WhyChooseUsSection from "../../components/home/WhyChooseUsSection";
import DeliverablesSection from "../../components/home/DeliverablesSection";
import { getServiceImage } from "../../data/serviceAssets";
import useSeo, { useJsonLd, ORIGIN } from "../../hooks/useSeo";

// Columns of the hero mosaic. Each tile names a service id from the shared
// asset map, so the picture always comes from the same place as the label and
// the two cannot drift apart. See src/data/serviceAssets.js for what each
// image shows.
const mosaicColumns = [
  { offset: "mt-0 lg:mt-[120px]", tiles: [
    { serviceId: "market-research", labelKey: "services.marketingStrategy.title" },
    { serviceId: "tiktok-videos", labelKey: "services.ugc.title" },
  ] },
  { offset: "mt-0 lg:mt-[60px]", tiles: [
    { serviceId: "social-media-design", labelKey: "services_social_name" },
    { serviceId: "brand-identity", labelKey: "services_brand_name" },
  ] },
  { offset: "mt-0", tiles: [
    { serviceId: "logo-design", labelKey: "services_logo_name" },
    { serviceId: "product-photography", labelKey: "services.photography.title" },
  ] },
];

function ServiceMosaicGrid() {
  const { t } = useTranslation();

  return (
    <>
      {/* `contents` dissolves the column wrappers below lg, so the six tiles
          become direct children of the parent grid and lay out two per row.
          Three columns on a phone left each tile near 110px, too small to read
          its label. The staggered offsets only make sense once the columns
          exist again at lg. */}
      {mosaicColumns.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className={`contents lg:flex lg:flex-col lg:gap-[4px] lg:w-full ${column.offset}`}
        >
          {column.tiles.map((tile) => {
            const label = t(tile.labelKey);
            return (
              <div key={tile.serviceId} className="w-full aspect-square relative overflow-hidden group rounded-[2px] bg-slate-900">
                <img
                  src={getServiceImage(tile.serviceId)}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  alt={label}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/70 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 p-2 text-center sm:p-3">
                  <span className="text-white font-bold text-[11px] uppercase tracking-wide sm:text-xs sm:tracking-wider">{label}</span>
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}

function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="relative py-16 sm:py-28 px-4 bg-slate-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-50" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-4xl mx-auto text-center"
      >
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">{t("cta_heading")}</h2>
        <p className="text-base sm:text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">{t("cta_desc")}</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/get-started"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-none font-black text-sm text-white bg-orange-500 hover:bg-orange-600 border-2 border-orange-500 transition-all duration-200"
          >
            {t("cta_cta1")}
            <ArrowRight size={14} />
          </Link>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-none border-2 border-slate-200 font-black text-sm text-slate-900 hover:border-slate-300 hover:bg-slate-100 transition-all duration-200"
          >
            {t("cta_cta2")}
          </Link>
        </div>
      </motion.div>
    </section>
  );
}


// Structured data describing the agency. Every value here is already shown
// publicly on the contact page; nothing is asserted that the site does not
// already claim.
const ORGANISATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "GROWSTACK",
  url: ORIGIN,
  image: `${ORIGIN}/logo.png`,
  logo: `${ORIGIN}/logo.png`,
  description:
    "Agence digitale intégrée au Maroc : stratégie marketing, réseaux sociaux, contenu UGC, design graphique, photographie et développement web.",
  email: "growstackagency@gmail.com",
  telephone: "+212631711680",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Casablanca",
    addressCountry: "MA",
  },
  areaServed: { "@type": "Country", name: "Maroc" },
  sameAs: ["https://www.instagram.com/ste_2m/"],
};

export default function HomePage() {
  useSeo({
    title: "Agence digitale au Maroc",
    description:
      "GROWSTACK accompagne les marques et entrepreneurs marocains : stratégie marketing, réseaux sociaux, UGC, design graphique, photographie et développement web.",
    path: "/",
  });
  useJsonLd(ORGANISATION_JSONLD, "organisation");

  const { t } = useTranslation();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);

  return (
    <>
      {/* âââ HERO âââ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-white">
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="w-full overflow-hidden">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-24 lg:py-36 overflow-hidden">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-5 w-full flex flex-col justify-center"
              >
                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-none mb-8 bg-orange-500 text-white border-2 border-orange-500">
                  <Sparkles size={12} />
                  {t("hero_badge")}
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-none mb-6 text-slate-900">
                  {t("hero_heading2")}
                </h1>
                <p className="text-base sm:text-lg max-w-xl leading-relaxed mb-10 text-slate-600">{t("hero_desc_sub")}</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/portfolio"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-none border-2 border-orange-500 font-black text-sm text-white bg-orange-500 hover:bg-orange-600 transition-all duration-200"
                  >
                    {t("hero_cta2")}
                  </Link>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-7 w-full grid grid-cols-2 lg:grid-cols-3 gap-[4px] items-start overflow-hidden lg:pe-4"
              >
                <ServiceMosaicGrid />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* âââ COMPARISON TABLE âââ */}
      <ComparisonTable />


      {/* âââ WHY CHOOSE US âââ */}
      <WhyChooseUsSection />

      {/* âââ WORKFLOW âââ */}
      <WorkflowSection />

      {/* âââ DELIVERABLES âââ */}
      <DeliverablesSection />

      {/* âââ FAQ âââ */}
      <FaqSection />

      {/* âââ CTA âââ */}
      <CTASection />
    </>
  );
}