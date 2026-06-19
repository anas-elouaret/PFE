import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight, Sparkles,
  LayoutGrid
} from "lucide-react";
import ComparisonTable from "../../components/home/ComparisonTable";
import WorkflowSection from "../../components/home/WorkflowSection";
import FaqSection from "../../components/home/FaqSection";
import WhyChooseUsSection from "../../components/home/WhyChooseUsSection";
import LiveTickerSection from "../../components/home/LiveTickerSection";
import DeliverablesSection from "../../components/home/DeliverablesSection";
import RiskReversalSection from "../../components/home/RiskReversalSection";

const dashboardMetrics = [
  { label: "Total Impressions", value: "2.4M", change: "+12%", pill: true },
  { label: "Engagement Rate", value: "4.8%", change: "+0.6%", pill: true },
  { label: "Active Projects", value: "24", change: "3 in review", pill: false },
  { label: "Client Satisfaction", value: "98%", change: "+2%", pill: true },
];

const chartMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const chartData = [35, 42, 38, 55, 48, 62, 58, 72, 68, 82, 78, 95];

function DashboardPreview() {
  return (
    <div className="rounded-none border-2 border-slate-200 bg-white overflow-hidden">
      <div className="px-5 py-3.5 border-b-2 border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-none flex items-center justify-center bg-orange-500">
            <LayoutGrid size={12} strokeWidth={2} className="text-white" />
          </div>
          <span className="text-sm font-black text-slate-900">growstack</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-wider text-orange-500">Overview</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Reports</span>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Settings</span>
        </div>
      </div>
      <div className="p-5 space-y-5">
        <div className="grid grid-cols-2 gap-3">
          {dashboardMetrics.map((m) => (
            <div key={m.label} className="rounded-none p-3.5 border-2 border-slate-200 bg-slate-50">
              <p className="text-[11px] font-black text-slate-500 mb-0.5">{m.label}</p>
              <p className="text-xl font-extrabold text-slate-900">{m.value}</p>
              {m.pill ? (
                <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-none bg-orange-500 text-white">{m.change}</span>
              ) : (
                <p className="text-[11px] font-bold text-slate-500">{m.change}</p>
              )}
            </div>
          ))}
        </div>
        <div className="rounded-none p-4 border-2 border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-black text-slate-900">Monthly Performance</p>
            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-none bg-orange-500 text-white">+24% Growth</span>
          </div>
          <div className="flex items-end gap-1.5 h-16">
            {chartData.map((h, i) => (
              <div key={i} className="flex-1 rounded-none" style={{ height: `${h}%`, background: i === chartData.length - 1 ? "#F97316" : "#CBD5E1", opacity: i === chartData.length - 1 ? 1 : 0.65 }} />
            ))}
          </div>
          <div className="flex justify-between mt-1.5">
            {chartMonths.map((m, i) => (
              <span key={i} className="text-[7px] font-bold text-slate-500" style={{ opacity: i === chartMonths.length - 1 ? 1 : 0.5 }}>{m}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
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
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6">{t("cta_heading")}</h2>
        <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">{t("cta_desc")}</p>
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
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="w-full">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-none mb-8 bg-orange-500 text-white border-2 border-orange-500">
                  <Sparkles size={12} />
                  {t("hero_badge")}
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-none mb-6 text-slate-900">
                  {t("hero_heading1")}
                  <br />
                  {t("hero_heading2")}
                </h1>
                <p className="text-lg max-w-xl leading-relaxed mb-10 text-slate-600">{t("hero_desc")}</p>
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
                className="hidden lg:block"
              >
                <DashboardPreview />
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