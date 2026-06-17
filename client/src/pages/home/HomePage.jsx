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
    <div className="rounded-xl border border-slate-100 shadow-sm bg-white overflow-hidden">
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md flex items-center justify-center bg-indigo-50">
            <LayoutGrid size={12} strokeWidth={2} className="text-indigo-600" />
          </div>
          <span className="text-sm font-semibold text-slate-800">growstack</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600">Overview</span>
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Reports</span>
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Settings</span>
        </div>
      </div>
      <div className="p-5 space-y-5">
        <div className="grid grid-cols-2 gap-3">
          {dashboardMetrics.map((m) => (
            <div key={m.label} className="rounded-lg p-3.5 border border-slate-100 bg-white">
              <p className="text-[11px] font-bold text-slate-900 mb-0.5">{m.label}</p>
              <p className="text-xl font-extrabold text-slate-900">{m.value}</p>
              {m.pill ? (
                <span className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">{m.change}</span>
              ) : (
                <p className="text-[11px] font-medium text-slate-500">{m.change}</p>
              )}
            </div>
          ))}
        </div>
        <div className="rounded-lg p-4 border border-slate-100 bg-white">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-slate-800">Monthly Performance</p>
            <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">+24% Growth</span>
          </div>
          <div className="flex items-end gap-1.5 h-16">
            {chartData.map((h, i) => (
              <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: i === chartData.length - 1 ? "#6366F1" : "#94A3B8", opacity: i === chartData.length - 1 ? 1 : 0.25 }} />
            ))}
          </div>
          <div className="flex justify-between mt-1.5">
            {chartMonths.map((m, i) => (
              <span key={i} className="text-[7px] font-medium text-slate-400" style={{ opacity: i === chartMonths.length - 1 ? 1 : 0.5 }}>{m}</span>
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
    <section className="relative py-28 px-4 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(99,102,241,0.04),transparent_70%)]" />
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
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 transition-all duration-200 shadow-sm"
          >
            {t("cta_cta1")}
            <ArrowRight size={14} />
          </Link>
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-sm text-slate-600 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
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
      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-white">
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="w-full">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
            <div className="grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-8 bg-indigo-50 text-indigo-600 border border-indigo-100">
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
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-lg border-2 border-slate-200 font-semibold text-sm text-slate-600 hover:border-slate-300 hover:bg-slate-50 transition-all duration-200"
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

      {/* ─── COMPARISON TABLE ─── */}
      <ComparisonTable />

      {/* ─── LIVE TICKER ─── */}
      <LiveTickerSection />

      {/* ─── WHY CHOOSE US ─── */}
      <WhyChooseUsSection />

      {/* ─── WORKFLOW ─── */}
      <WorkflowSection />

      {/* ─── DELIVERABLES ─── */}
      <DeliverablesSection />

      {/* ─── RISK REVERSAL ─── */}
      <RiskReversalSection />

      {/* ─── FAQ ─── */}
      <FaqSection />

      {/* ─── CTA ─── */}
      <CTASection />
    </>
  );
}
