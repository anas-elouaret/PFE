"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ScrollReveal } from "../animations";

const features = [
  {
    label: "Marketing Strategy",
    values: { growstack: true, agences: true, freelances: false, influenceurs: false },
  },
  {
    label: "UGC Content",
    values: { growstack: true, agences: "partial", freelances: true, influenceurs: true },
  },
  {
    label: "Graphic Design",
    values: { growstack: true, agences: true, freelances: true, influenceurs: false },
  },
  {
    label: "Photography",
    values: { growstack: true, agences: "partial", freelances: false, influenceurs: false },
  },
  {
    label: "Social Media Management",
    values: { growstack: true, agences: true, freelances: "partial", influenceurs: false },
  },
  {
    label: "Prix Transparent",
    values: { growstack: true, agences: false, freelances: true, influenceurs: false },
  },
  {
    label: "Communication Rapide",
    values: { growstack: true, agences: "partial", freelances: true, influenceurs: false },
  },
  {
    label: "Services Centralisés",
    values: { growstack: true, agences: false, freelances: false, influenceurs: false },
  },
  {
    label: "Accompagnement Personnalisé",
    values: { growstack: true, agences: "partial", freelances: true, influenceurs: false },
  },
  {
    label: "Équipe Complète",
    values: { growstack: true, agences: true, freelances: false, influenceurs: false },
  },
  {
    label: "Suivi des Performances",
    values: { growstack: true, agences: "partial", freelances: false, influenceurs: false },
  },
  {
    label: "Gestion des Projets",
    values: { growstack: true, agences: true, freelances: false, influenceurs: false },
  },
];

const columns = [
  { key: "growstack", label: "GROWSTACK", className: "text-[#00AEEF]" },
  { key: "agences", label: "Agences", className: "text-zinc-300" },
  { key: "freelances", label: "Freelances", className: "text-zinc-300" },
  { key: "influenceurs", label: "Influenceurs", className: "text-zinc-300" },
];

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00AEEF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <motion.path
        d="M5 13l4 4L19 7"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <motion.path
        d="M6 6l12 12M18 6l-12 12"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </svg>
  );
}

function PartialIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00AEEF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <motion.circle
        cx="12" cy="12" r="10"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
      <motion.line
        x1="8" y1="12" x2="16" y2="12"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.2, ease: "easeOut", delay: 0.15 }}
      />
    </svg>
  );
}

function StatusIcon({ value }) {
  if (value === true) return <CheckIcon />;
  if (value === false) return <CrossIcon />;
  return <PartialIcon />;
}

const rowVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
};

export default function ComparisonSection() {
  const rows = useMemo(() => [...features], []);

  return (
    <section className="relative overflow-hidden py-24 sm:py-28 md:py-32" style={{ background: "#060a0d" }}>
      {/* Background glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-48 left-1/4 w-[500px] h-[500px] rounded-full"
          style={{ background: "rgba(0,174,239,0.04)", filter: "blur(140px)" }}
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.08, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-48 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{ background: "rgba(0,174,239,0.03)", filter: "blur(120px)" }}
          animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.12, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <ScrollReveal delay={0.1} duration={0.7}>
            <span
              className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em] px-4 py-2 rounded-full mb-5"
              style={{
                color: "#00AEEF",
                border: "1px solid rgba(0,174,239,0.2)",
                background: "rgba(0,174,239,0.06)",
              }}
            >
              COMPARAISON
            </span>
          </ScrollReveal>

          <ScrollReveal delay={0.2} duration={0.8}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-5">
              <span style={{ color: "#f0f4f8" }}>GROWSTACK vs </span>
              <span
                className="px-3 py-1 inline-block rounded-xl"
                style={{
                  color: "#000000",
                  background: "#00AEEF",
                  boxShadow: "0 0 30px rgba(0,174,239,0.35)",
                }}
              >
                Les Alternatives
              </span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.3} duration={0.8}>
            <p className="max-w-2xl mx-auto text-base sm:text-lg leading-relaxed" style={{ color: "rgba(240,244,248,0.55)" }}>
              Découvrez pourquoi les marques choisissent GROWSTACK pour développer leur présence digitale.
            </p>
          </ScrollReveal>
        </div>

        {/* Intro paragraph */}
        <ScrollReveal delay={0.35} duration={0.7}>
          <div
            className="max-w-3xl mx-auto mb-10 sm:mb-14 text-center text-sm sm:text-base leading-relaxed px-4 py-5 rounded-2xl"
            style={{
              color: "rgba(240,244,248,0.5)",
              border: "1px solid rgba(0,174,239,0.06)",
              background: "rgba(0,174,239,0.02)",
            }}
          >
            Pourquoi travailler avec plusieurs prestataires alors que GROWSTACK réunit Marketing, UGC, Design, Photographie et Social Media Management dans une seule solution ?
          </div>
        </ScrollReveal>

        {/* Desktop + Tablet Table */}
        <ScrollReveal delay={0.4} duration={0.9} distance={30}>
          <div className="hidden md:block overflow-x-auto pb-4" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(0,174,239,0.2) transparent" }}>
            <div
              className="min-w-[680px] rounded-3xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.03)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.06)",
                boxShadow: "0 8px 60px rgba(0,0,0,0.25), 0 0 80px rgba(0,174,239,0.03)",
              }}
            >
              {/* Table header */}
              <div
                className="grid gap-0 px-6 py-4 sm:px-8 sm:py-5"
                style={{
                  gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "rgba(240,244,248,0.3)" }}>
                  Fonctionnalité
                </div>
                {columns.map((col) => (
                  <div
                    key={col.key}
                    className={`text-xs font-bold uppercase tracking-[0.18em] text-center ${col.className}`}
                  >
                    {col.label}
                  </div>
                ))}
              </div>

              {/* Table rows */}
              {rows.map((row, i) => (
                <motion.div
                  key={row.label}
                  custom={i}
                  variants={rowVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  className="grid gap-0 px-6 py-4 sm:px-8 sm:py-5 transition-all duration-300"
                  style={{
                    gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr",
                    alignItems: "center",
                    borderBottom: i < rows.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
                    background: i % 2 === 0 ? "rgba(255,255,255,0.01)" : "transparent",
                  }}
                  whileHover={{
                    background: "rgba(0,174,239,0.04)",
                    transition: { duration: 0.2 },
                  }}
                >
                  {/* Feature label */}
                  <div className="text-sm font-medium pr-4" style={{ color: "rgba(240,244,248,0.8)" }}>
                    {row.label}
                  </div>

                  {/* GROWSTACK column */}
                  <motion.div
                    className="flex justify-center"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <StatusIcon value={row.values.growstack} />
                  </motion.div>

                  {/* Other columns */}
                  {["agences", "freelances", "influenceurs"].map((key) => (
                    <div key={key} className="flex justify-center">
                      <StatusIcon value={row.values[key]} />
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Mobile cards */}
        <div className="md:hidden space-y-4">
          {rows.map((row, i) => (
            <ScrollReveal key={row.label} delay={i * 0.05} duration={0.5} distance={20}>
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
                }}
              >
                {/* Feature name */}
                <div
                  className="px-4 py-3 text-sm font-bold tracking-tight"
                  style={{
                    color: "rgba(240,244,248,0.9)",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    background: "rgba(255,255,255,0.02)",
                  }}
                >
                  {row.label}
                </div>

                {/* Values grid */}
                <div className="grid grid-cols-2 gap-px">
                  {columns.map((col) => (
                    <div
                      key={col.key}
                      className="flex items-center justify-between px-4 py-3"
                      style={{
                        background: col.key === "growstack" ? "rgba(0,174,239,0.04)" : "transparent",
                      }}
                    >
                      <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "rgba(240,244,248,0.35)" }}>
                        {col.label}
                      </span>
                      <StatusIcon value={row.values[col.key]} />
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* CTA */}
        <ScrollReveal delay={0.6} duration={0.9} distance={30}>
          <div className="text-center mt-14 sm:mt-20">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-8" style={{ color: "#f0f4f8" }}>
              Prêt à faire grandir votre marque ?
            </h3>
            <motion.a
              href="/start-project"
              className="inline-flex items-center gap-3 px-10 py-4 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300"
              style={{
                background: "#000000",
                color: "#00AEEF",
                border: "1px solid rgba(0,174,239,0.2)",
                boxShadow: "0 0 30px rgba(0,174,239,0.10)",
              }}
              whileHover={{
                scale: 1.04,
                boxShadow: "0 0 50px rgba(0,174,239,0.25)",
                borderColor: "rgba(0,174,239,0.4)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              Commencer avec GROWSTACK
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00AEEF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </motion.a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
