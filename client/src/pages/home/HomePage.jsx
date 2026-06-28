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
import LiveTickerSection from "../../components/home/LiveTickerSection";
import DeliverablesSection from "../../components/home/DeliverablesSection";
import RiskReversalSection from "../../components/home/RiskReversalSection";

const serviceGridItems = [
  { id: "brand-identity", labelKey: "services_brand_name", image: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=400&fit=crop" },
  { id: "logo-design", labelKey: "services_logo_name", image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=400&fit=crop" },
  { id: "social-media", labelKey: "services_social_name", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop" },
  { id: "social-media-mgmt", labelKey: "services.socialMedia.title", image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop" },
  { id: "marketing-strategy", labelKey: "services.marketingStrategy.title", image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=400&fit=crop" },
  { id: "ugc", labelKey: "services.ugc.title", image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=400&fit=crop" },
  { id: "photography", labelKey: "services.photography.title", image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=400&fit=crop" },
];

function ServiceMosaicGrid() {
  const { t } = useTranslation();

  return (
    <>
      {/* Column 1 - Left Track */}
      <div className="flex flex-col gap-[4px] w-full mt-[120px]">
        <div className="w-full aspect-square relative overflow-hidden group rounded-[2px] bg-slate-900">
          <img src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=400&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 p-3 text-center">
            <span className="text-white font-bold text-xs uppercase tracking-wider">{t("services.marketingStrategy.title")}</span>
          </div>
        </div>
        <div className="w-full aspect-square relative overflow-hidden group rounded-[2px] bg-slate-900">
          <img src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=400&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 p-3 text-center">
            <span className="text-white font-bold text-xs uppercase tracking-wider">{t("services.ugc.title")}</span>
          </div>
        </div>
      </div>

      {/* Column 2 - Middle Track */}
      <div className="flex flex-col gap-[4px] w-full mt-[60px]">
        <div className="w-full aspect-square relative overflow-hidden group rounded-[2px] bg-slate-900">
          <img src="https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=400&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 p-3 text-center">
            <span className="text-white font-bold text-xs uppercase tracking-wider">{t("services_social_name")}</span>
          </div>
        </div>
        <div className="w-full aspect-square relative overflow-hidden group rounded-[2px] bg-slate-900">
          <img src="https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=400&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 p-3 text-center">
            <span className="text-white font-bold text-xs uppercase tracking-wider">{t("services_brand_name")}</span>
          </div>
        </div>
      </div>

      {/* Column 3 - Right Track */}
      <div className="flex flex-col gap-[4px] w-full mt-0">
        <div className="w-full aspect-square relative overflow-hidden group rounded-[2px] bg-slate-900">
          <img src="https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&h=400&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 p-3 text-center">
            <span className="text-white font-bold text-xs uppercase tracking-wider">{t("services_logo_name")}</span>
          </div>
        </div>
        <div className="w-full aspect-square relative overflow-hidden group rounded-[2px] bg-slate-900">
          <img src="https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=400&h=400&fit=crop" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300 p-3 text-center">
            <span className="text-white font-bold text-xs uppercase tracking-wider">{t("services.photography.title")}</span>
          </div>
        </div>
      </div>
    </>
  );
}

function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="relative py-28 px-4 bg-slate-50 overflow-hidden">
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

export default function HomePage() {
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
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36 overflow-hidden">
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
                className="lg:col-span-7 w-full grid grid-cols-3 gap-[4px] items-start overflow-hidden pr-4"
              >
                <ServiceMosaicGrid />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* âââ COMPARISON TABLE âââ */}
      <ComparisonTable />

      {/* âââ LIVE TICKER âââ */}
      <LiveTickerSection />

      {/* âââ WHY CHOOSE US âââ */}
      <WhyChooseUsSection />

      {/* âââ WORKFLOW âââ */}
      <WorkflowSection />

      {/* âââ DELIVERABLES âââ */}
      <DeliverablesSection />

      {/* âââ RISK REVERSAL âââ */}
      <RiskReversalSection />

      {/* âââ FAQ âââ */}
      <FaqSection />

      {/* âââ CTA âââ */}
      <CTASection />
    </>
  );
}