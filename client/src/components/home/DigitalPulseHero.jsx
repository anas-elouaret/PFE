import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { LayoutGrid, ArrowRight, Activity, Zap, TrendingUp, ChevronDown } from "lucide-react";

const ELEC = "#00D4FF";

function useWindowSize() {
  const [size, setSize] = useState(typeof window !== "undefined" ? { w: window.innerWidth, h: window.innerHeight } : { w: 1280, h: 720 });
  useEffect(() => {
    let frame;
    const handler = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => setSize({ w: window.innerWidth, h: window.innerHeight })); };
    window.addEventListener("resize", handler, { passive: true });
    return () => { window.removeEventListener("resize", handler); cancelAnimationFrame(frame); };
  }, []);
  return size;
}

function EkgLine() {
  const { w } = useWindowSize();
  const pathRef = useRef(null);
  const [draw, setDraw] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDraw(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const pad = 60;
  const h = 120;
  const cX = w - pad * 2;

  function flat(offset, len) {
    return `L ${offset + len} ${h / 2}`;
  }

  function spike(at, height) {
    const halfW = 2;
    return `L ${at} ${h / 2} L ${at} ${h / 2 - height} L ${at + halfW} ${h / 2 - height} L ${at + halfW * 2} ${h / 2}`;
  }

  const segs = 300;
  const segLen = cX / segs;
  const spikes = [];
  let prevEnd = 0;
  for (let i = 0; i < 6; i++) {
    const start = 0.1 + Math.random() * 0.7;
    const pos = Math.floor(start * segs) * segLen;
    if (pos - prevEnd < 40) continue;
    prevEnd = pos + 20;
    const amplitude = 28 + Math.random() * 20;
    spikes.push({ at: pos + pad, height: amplitude });
  }

  let d = `M ${pad} ${h / 2}`;
  let cursor = pad;
  const intervals = [];
  let lastSpike = pad;
  for (const s of spikes.sort((a, b) => a.at - b.at)) {
    const flatLen = s.at - lastSpike - 5;
    if (flatLen > 0) {
      intervals.push({ type: "flat", start: lastSpike, len: flatLen });
      d += ` ${flat(lastSpike, flatLen)}`;
      cursor = lastSpike + flatLen;
    }
    intervals.push({ type: "spike", at: s.at, height: s.height });
    d += ` ${spike(s.at, s.height)}`;
    cursor = s.at + 5;
    lastSpike = cursor;
  }
  if (cX + pad - lastSpike > 0) {
    d += ` ${flat(lastSpike, cX + pad - lastSpike)}`;
  }
  d += ` L ${w - pad} ${h / 2}`;

  return (
    <div className="absolute inset-x-0 pointer-events-none" style={{ top: "40%", height, opacity: 0.15 }}>
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" preserveAspectRatio="none" className="w-full h-full">
        <motion.path
          ref={pathRef}
          d={d}
          stroke={ELEC}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={draw ? { pathLength: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <motion.path
          d={d}
          stroke={ELEC}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="blur-md"
          initial={{ pathLength: 0 }}
          animate={draw ? { pathLength: 1 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ opacity: 0.3 }}
        />
      </svg>
    </div>
  );
}

function CurtainReveal({ onComplete }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div className="fixed inset-0 z-[200] flex pointer-events-none" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, delay: 1.2 }}>
        <motion.div
          className="h-full bg-black"
          initial={{ width: "50vw" }}
          animate={{ width: "0vw" }}
          exit={{ width: "0vw" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          style={{ originRight: 0 }}
        />
        <motion.div
          className="h-full bg-black"
          initial={{ width: "50vw" }}
          animate={{ width: "0vw" }}
          exit={{ width: "0vw" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          style={{ originLeft: 0 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          initial={{ height: "100%", width: 1, opacity: 1 }}
          animate={{ height: "0%", opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.7, ease: "easeInOut" }}
          style={{ background: ELEC, boxShadow: `0 0 60px ${ELEC}, 0 0 120px ${ELEC}` }}
        />
      </motion.div>
    </AnimatePresence>
  );
}

function Scanline() {
  return (
    <div className="fixed inset-x-0 pointer-events-none z-50" style={{ animation: "scanline 4s linear infinite" }}>
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, transparent, ${ELEC}40, transparent)` }} />
    </div>
  );
}

function PulseLogo() {
  return (
    <motion.div
      className="relative flex items-center gap-2"
      animate={{ scale: [1, 1.04, 1] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        className="w-9 h-9 rounded-xl flex items-center justify-center relative"
        style={{ background: `${ELEC}12`, border: `1px solid ${ELEC}30` }}
        animate={{ boxShadow: [`0 0 0px ${ELEC}00`, `0 0 20px ${ELEC}30`, `0 0 0px ${ELEC}00`] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <LayoutGrid size={18} strokeWidth={1.75} style={{ color: ELEC }} />
        <motion.div
          className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
          style={{ background: ELEC, boxShadow: `0 0 6px ${ELEC}` }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      <span className="text-xl font-black tracking-tight">
        <span className="text-white">grow</span>
        <span style={{ color: ELEC }}>stack</span>
        <span style={{ color: ELEC }}>.</span>
      </span>
    </motion.div>
  );
}

function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const tabs = [
    { label: "Accueil", path: "/" },
    { label: "Services", path: "/services" },
    { label: "Réalisations", path: "/portfolio" },
    { label: "À propos", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8 pt-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mx-auto max-w-7xl">
        <motion.nav
          className="rounded-2xl backdrop-blur-2xl flex items-center justify-between px-5 h-16"
          animate={{
            background: scrolled ? "rgba(0,0,0,0.8)" : "rgba(255,255,255,0.03)",
            borderColor: scrolled ? "rgba(0,212,255,0.15)" : "rgba(255,255,255,0.06)",
          }}
          style={{ borderWidth: 1, borderStyle: "solid" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link to="/" className="shrink-0">
            <PulseLogo />
          </Link>

          <div className="hidden md:flex items-center">
            <div className="flex items-center gap-1 rounded-xl p-[3px]" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}>
              {tabs.map((tab) => (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className="relative px-4 py-[7px] text-sm font-medium rounded-lg transition-all duration-200 text-zinc-400 hover:text-white"
                >
                  {tab.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/get-started"
              className="relative group inline-flex items-center gap-2 rounded-xl font-bold px-5 py-2 text-sm transition-all duration-300 overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${ELEC}, #38BDF8)`,
                color: "#000",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Démarrer un projet
                <ArrowRight size={14} />
              </span>
              <motion.div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
                  transform: "skewX(-20deg)",
                }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 1 }}
              />
            </Link>
          </div>
        </motion.nav>
      </div>
    </motion.header>
  );
}

function BeamButton({ children, href, primary }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 2, ease: [0.16, 1, 0.3, 1] }}
      className="relative group"
    >
      {primary ? (
        <Link
          to={href}
          className="relative inline-flex items-center gap-3 font-bold px-10 py-4 rounded-full text-sm uppercase tracking-widest overflow-hidden"
          style={{
            background: "#000",
            color: "#fff",
            border: "1px solid rgba(0,212,255,0.3)",
          }}
        >
          <span className="absolute inset-0 rounded-full" style={{
            background: `conic-gradient(from var(--angle, 0deg), ${ELEC}, transparent 30%, transparent 70%, ${ELEC})`,
            animation: "beam-rotate 3s linear infinite",
            padding: "1px",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "xor",
          }} />
          <motion.span
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `linear-gradient(135deg, ${ELEC}, #38BDF8)`,
            }}
          />
          <span className="relative z-10 flex items-center gap-3">
            {children}
          </span>
        </Link>
      ) : (
        <Link
          to={href}
          className="inline-flex items-center gap-3 border border-zinc-700 text-zinc-400 font-medium px-10 py-4 rounded-full text-sm uppercase tracking-widest hover:border-zinc-500 hover:text-white transition-all duration-300"
        >
          {children}
        </Link>
      )}
    </motion.div>
  );
}

function FloatingCard({ children, className, depth = 0, delay = 0 }) {
  return (
    <motion.div
      className={`absolute ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.6 + delay, ease: [0.16, 1, 0.3, 1] }}
      style={{ transformStyle: "preserve-3d" }}
    >
      <motion.div
        className="rounded-2xl backdrop-blur-xl"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          transform: `rotateX(${4 + depth * 2}deg) rotateY(${-3 - depth * 3}deg) translateZ(${depth * 10}px)`,
        }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function DashboardComposition() {
  return (
    <div className="relative w-full h-full" style={{ perspective: "1000px" }}>
      <FloatingCard className="top-[8%] right-[5%] w-[200px]" depth={0} delay={0}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Impressions</span>
            <Activity size={12} style={{ color: ELEC }} />
          </div>
          <span className="text-2xl font-black text-white">284.5K</span>
          <div className="mt-2 flex gap-1">
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <motion.div
                key={i}
                className="w-2 rounded-full"
                style={{
                  height: h * 0.4,
                  background: `linear-gradient(180deg, ${ELEC}, transparent)`,
                  opacity: 0.6,
                }}
                animate={{ height: [h * 0.3, h * 0.5, h * 0.3] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
              />
            ))}
          </div>
        </div>
      </FloatingCard>

      <FloatingCard className="top-[38%] right-[-2%] w-[170px]" depth={1} delay={0.15}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Taux d'engagement</span>
            <TrendingUp size={12} style={{ color: "#22D3EE" }} />
          </div>
          <span className="text-2xl font-black text-white">4.8<span className="text-sm text-zinc-500">%</span></span>
          <div className="mt-2 flex items-center gap-1.5">
            <motion.div
              className="h-1.5 rounded-full flex-1"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ width: "78%", background: `linear-gradient(90deg, #22D3EE, ${ELEC})` }}
                animate={{ width: ["78%", "82%", "78%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
            <span className="text-[10px] font-medium text-zinc-500">+12%</span>
          </div>
        </div>
      </FloatingCard>

      <FloatingCard className="top-[62%] right-[8%] w-[150px]" depth={2} delay={0.3}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Projets</span>
            <Zap size={12} style={{ color: "#38BDF8" }} />
          </div>
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${ELEC}15`, border: `1px solid ${ELEC}25` }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-lg font-black" style={{ color: ELEC }}>38</span>
            </motion.div>
            <div>
              <span className="block text-sm font-bold text-white">128+</span>
              <span className="text-[10px] text-zinc-500">terminés</span>
            </div>
          </div>
        </div>
      </FloatingCard>

      <motion.div
        className="absolute top-[20%] right-[12%] w-2 h-2 rounded-full"
        style={{ background: ELEC, boxShadow: `0 0 12px ${ELEC}` }}
        animate={{ opacity: [1, 0.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-[55%] right-[22%] w-1.5 h-1.5 rounded-full"
        style={{ background: "#22D3EE", boxShadow: "0 0 8px #22D3EE" }}
        animate={{ opacity: [1, 0.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
    </div>
  );
}

const techBrands = [
  { name: "Vercel", icon: "▲" },
  { name: "Stripe", icon: "◇" },
  { name: "Framer", icon: "●" },
  { name: "Notion", icon: "■" },
  { name: "Figma", icon: "◆" },
  { name: "Linear", icon: "⬡" },
  { name: "Vercel", icon: "▲" },
  { name: "Stripe", icon: "◇" },
  { name: "Framer", icon: "●" },
  { name: "Notion", icon: "■" },
  { name: "Figma", icon: "◆" },
  { name: "Linear", icon: "⬡" },
];

function MarqueeRow() {
  return (
    <div className="absolute bottom-0 inset-x-0 h-20 overflow-hidden" style={{ background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.02))", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
      <div className="relative h-full flex items-center overflow-hidden">
        <motion.div
          className="flex items-center gap-16 whitespace-nowrap px-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {techBrands.map((brand, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-lg" style={{ color: ELEC }}>{brand.icon}</span>
              <span className="text-sm font-semibold tracking-wider text-zinc-600">{brand.name}</span>
            </div>
          ))}
        </motion.div>
        <motion.div
          className="flex items-center gap-16 whitespace-nowrap px-8 absolute left-full top-1/2 -translate-y-1/2"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {techBrands.map((brand, i) => (
            <div key={`dup-${i}`} className="flex items-center gap-3">
              <span className="text-lg" style={{ color: ELEC }}>{brand.icon}</span>
              <span className="text-sm font-semibold tracking-wider text-zinc-600">{brand.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default function DigitalPulseHero() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIntroDone(true), 2000);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <CurtainReveal />

      <motion.div
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <Scanline />

      <NavBar />

      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden" style={{ background: "#030303" }}>
        <EkgLine />

        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="relative z-10 w-full pt-32 pb-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="max-w-2xl">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className="mb-6"
                >
                  <span
                    className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] px-4 py-2 rounded-full"
                    style={{
                      color: ELEC,
                      background: `${ELEC}10`,
                      border: `1px solid ${ELEC}20`,
                    }}
                  >
                    <Activity size={12} />
                    Agence Créative Full-Service
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.7, ease: [0.16, 1, 0.3, 1] }}
                  className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-[0.92] mb-6"
                >
                  <span className="text-white">Propulsez Votre</span>
                  <br />
                  <span className="bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${ELEC}, #38BDF8, #60A5FA)` }}>
                    Croissance Digitale.
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.9, ease: [0.16, 1, 0.3, 1] }}
                  className="text-base sm:text-lg text-zinc-500 leading-relaxed max-w-xl mb-10"
                >
                  Nous créons du contenu UGC, du design et des stratégies marketing qui transforment votre audience en croissance mesurable.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 2.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col sm:flex-row items-start gap-4"
                >
                  <BeamButton href="/get-started" primary>
                    Démarrer un projet
                    <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </BeamButton>
                  <BeamButton href="/portfolio">
                    Voir nos réalisations
                  </BeamButton>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 2.5 }}
                  className="flex items-center gap-6 mt-12 pt-8 border-t border-white/[0.04]"
                >
                  {[
                    { value: "38+", label: "Clients" },
                    { value: "128", label: "Projets" },
                    { value: "98%", label: "Satisfaction" },
                  ].map((stat) => (
                    <div key={stat.label}>
                      <span className="block text-lg font-black text-white">{stat.value}</span>
                      <span className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">{stat.label}</span>
                    </div>
                  ))}
                </motion.div>
              </div>

              <div className="hidden lg:block relative h-[600px]">
                <DashboardComposition />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6, duration: 1 }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={20} className="text-zinc-600" />
          </motion.div>
        </motion.div>

        <MarqueeRow />
      </section>
    </>
  );
}
