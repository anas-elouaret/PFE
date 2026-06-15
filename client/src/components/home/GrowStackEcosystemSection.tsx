import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";

interface PuzzlePiece {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  position: { left: string; top: string };
  startOffset: { x: number; y: number; rotate: number };
}

interface StatItem {
  value: string;
  label: string;
  suffix: string;
}

const puzzlePieces: PuzzlePiece[] = [
  {
    id: "marketing",
    title: "Marketing Strategy",
    description: "Data-driven campaigns that amplify your brand reach and drive measurable growth.",
    icon: "📈",
    color: "#33C8FF",
    position: { left: "2%", top: "2%" },
    startOffset: { x: -320, y: -240, rotate: -18 },
  },
  {
    id: "ugc",
    title: "UGC Content",
    description: "Authentic user-generated content that builds trust and drives conversions.",
    icon: "🎥",
    color: "#00AEEF",
    position: { left: "54%", top: "2%" },
    startOffset: { x: 320, y: -240, rotate: 18 },
  },
  {
    id: "photography",
    title: "Photography",
    description: "Professional product and lifestyle photography that captivates your audience.",
    icon: "📸",
    color: "#00AEEF",
    position: { left: "2%", top: "54%" },
    startOffset: { x: -320, y: 240, rotate: 18 },
  },
  {
    id: "design",
    title: "Design",
    description: "Stunning visual identities and designs that make your brand unforgettable.",
    icon: "🎨",
    color: "#00AEEF",
    position: { left: "54%", top: "54%" },
    startOffset: { x: 320, y: 240, rotate: -18 },
  },
];

const stats: StatItem[] = [
  { value: "500", label: "Content Created", suffix: "+" },
  { value: "50", label: "Projects Delivered", suffix: "+" },
  { value: "98", label: "Client Satisfaction", suffix: "%" },
  { value: "7", label: "Average Delivery", suffix: " Days" },
];

function useCountUp(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) setHasStarted(true);
      },
      { threshold: 0.3 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted || isNaN(end)) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(ease * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, hasStarted]);

  return { count, ref };
}

function StatCounter({ stat, delay }: { stat: StatItem; delay: number }) {
  const { count, ref } = useCountUp(parseInt(stat.value));

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="text-center"
    >
      <span className="block text-4xl md:text-5xl font-black bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
        {count}
        {stat.suffix}
      </span>
      <span className="text-xs text-zinc-500 font-medium tracking-wider uppercase mt-2 block">
        {stat.label}
      </span>
    </motion.div>
  );
}

function useMousePosition(ref: React.RefObject<HTMLElement | null>) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handle = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setPos({
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      });
    };
    el.addEventListener("mousemove", handle);
    return () => el.removeEventListener("mousemove", handle);
  }, [ref]);

  return pos;
}

export default function GrowStackEcosystemSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const puzzleRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"hidden" | "assembling" | "assembled" | "revealed">("hidden");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const mousePos = useMousePosition(puzzleRef);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const parallaxY = useSpring(useTransform(scrollYProgress, [0, 1], [80, -80]), {
    damping: 50,
    stiffness: 400,
  });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && phase === "hidden") {
          setTimeout(() => setPhase("assembling"), 150);
          setTimeout(() => setPhase("assembled"), 1800);
          setTimeout(() => setPhase("revealed"), 3000);
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [phase]);

  const getPieceMotion = useCallback(
    (piece: PuzzlePiece, index: number) => {
      const isHovered = hoveredId === piece.id;
      const magneticX = isHovered ? mousePos.x * 30 : 0;
      const magneticY = isHovered ? mousePos.y * 30 : 0;

      if (phase === "hidden") {
        return {
          opacity: 0,
          x: piece.startOffset.x,
          y: piece.startOffset.y,
          rotate: piece.startOffset.rotate,
          scale: 0.85,
          filter: "blur(16px)",
        };
      }

      if (phase === "assembling") {
        return {
          opacity: 1,
          x: 0,
          y: 0,
          rotate: 0,
          scale: 1,
          filter: "blur(0px)",
        };
      }

      return {
        opacity: 1,
        x: magneticX,
        y: magneticY,
        rotate: isHovered ? piece.startOffset.rotate * 0.2 : 0,
        scale: isHovered ? 1.04 : 1,
        filter: "blur(0px)",
      };
    },
    [phase, hoveredId, mousePos],
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-surface-950 py-24 sm:py-28 md:py-32"
    >
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-48 -left-48 w-[500px] h-[500px] rounded-full bg-[#00AEEF]/10 blur-[140px]"
          animate={{ opacity: [0.08, 0.25, 0.08], scale: [1, 1.12, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-48 -right-48 w-[500px] h-[500px] rounded-full bg-[#00AEEF]/10 blur-[140px]"
          animate={{ opacity: [0.08, 0.2, 0.08], scale: [1, 1.15, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#00AEEF]/5 blur-[160px]"
          animate={{ opacity: [0.04, 0.12, 0.04] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${((i * 137.5 + 50) % 100)}%`,
              top: `${((i * 89.3 + 20) % 100)}%`,
              backgroundColor: i % 3 === 0 ? "#33C8FF" : i % 3 === 1 ? "#00AEEF" : "#00AEEF",
              opacity: 0.15 + (i % 5) * 0.05,
            }}
            animate={{
              y: [0, -(20 + (i % 15) * 2), 0],
              opacity: [0, 0.4, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 4 + (i % 4) * 2,
              repeat: Infinity,
              delay: (i % 6) * 0.8,
              ease: "easeInOut",
            }}
          />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={`fragment-${i}`}
            className="absolute w-2 h-2 rounded-sm"
            style={{
              left: `${((i * 211 + 70) % 100)}%`,
              top: `${((i * 173 + 40) % 100)}%`,
              border: "1px solid rgba(51,200,255,0.15)",
              backgroundColor: "rgba(51,200,255,0.03)",
            }}
            animate={{
              y: [0, -(15 + i * 3), 0],
              rotate: [0, 45 + i * 15, 0],
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 5 + (i % 3) * 2,
              repeat: Infinity,
              delay: i * 1.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div className="relative mb-16 md:mb-24" style={{ y: parallaxY }}>
          <div
            ref={puzzleRef}
            className="relative mx-auto w-full max-w-[420px] sm:max-w-[540px] md:max-w-[620px] lg:max-w-[680px] aspect-square"
          >
            <div className="absolute inset-0 rounded-[2.5rem] border border-white/[0.06] bg-white/[0.015] backdrop-blur-3xl shadow-[0_0_120px_rgba(0,174,239,0.06)]" />

            <div className="relative w-full h-full p-[3%]">
              {puzzlePieces.map((piece, index) => (
                <motion.div
                  key={piece.id}
                  className="absolute cursor-pointer"
                  style={{
                    left: piece.position.left,
                    top: piece.position.top,
                    width: "44%",
                    height: "44%",
                    zIndex: hoveredId === piece.id ? 20 : 10,
                    willChange: "transform, opacity",
                  }}
                  initial={false}
                  animate={getPieceMotion(piece, index)}
                  transition={{
                    type: "spring",
                    stiffness: index < 2 ? 180 : 220,
                    damping: 22,
                    mass: 1.6,
                    delay: phase === "assembling" ? index * 0.18 : 0,
                  }}
                  onMouseEnter={() => setHoveredId(piece.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div
                    className={`relative w-full h-full rounded-2xl sm:rounded-3xl border p-3 sm:p-4 md:p-5 flex flex-col items-center justify-center text-center transition-all duration-500 ${
                      hoveredId === piece.id
                        ? "border-[#00AEEF]/40 shadow-[0_0_60px_rgba(0,174,239,0.15)]"
                        : "border-white/[0.07]"
                    } bg-gradient-to-br from-white/[0.06] to-white/[0.015] backdrop-blur-2xl`}
                  >
                    <div
                      className={`absolute inset-0 rounded-2xl sm:rounded-3xl transition-opacity duration-500 pointer-events-none ${
                        hoveredId === piece.id ? "opacity-100" : "opacity-0"
                      }`}
                      style={{
                        background: `radial-gradient(circle at 50% 50%, ${piece.color}20, transparent 70%)`,
                      }}
                    />

                    <span className="relative z-10 text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">
                      {piece.icon}
                    </span>
                    <span
                      className="relative z-10 text-[8px] sm:text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] leading-tight"
                      style={{ color: piece.color }}
                    >
                      {piece.title}
                    </span>

                    <AnimatePresence>
                      {hoveredId === piece.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.92 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -6, scale: 0.92 }}
                          transition={{ duration: 0.18 }}
                          className="absolute -top-14 left-1/2 -translate-x-1/2 w-44 sm:w-48 px-3 py-2 rounded-xl bg-surface-900/95 backdrop-blur-xl border border-white/[0.08] shadow-xl pointer-events-none"
                        >
                          <p className="text-[10px] sm:text-xs text-zinc-300 leading-relaxed">
                            {piece.description}
                          </p>
                          <div className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-surface-900/95 border-r border-b border-white/[0.08]" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}

              <AnimatePresence>
                {(phase === "assembled" || phase === "revealed") && (
                  <>
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 1.6, 0], opacity: [0, 0.5, 0] }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-[#00AEEF]/30 pointer-events-none"
                    />
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 2, 0], opacity: [0, 0.25, 0] }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 1.6, delay: 0.5, ease: "easeOut" }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-[#33C8FF]/20 pointer-events-none"
                    />
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: [0, 2.4, 0], opacity: [0, 0.12, 0] }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 1.8, delay: 0.8, ease: "easeOut" }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-[#00AEEF]/15 pointer-events-none"
                    />

                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        delay: 0.9,
                        duration: 0.7,
                        ease: [0.16, 1, 0.3, 1],
                        type: "spring",
                        stiffness: 200,
                        damping: 18,
                      }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#00AEEF]/15 via-[#00AEEF]/15 to-[#33C8FF]/15 backdrop-blur-2xl border border-white/[0.1] flex items-center justify-center shadow-[0_0_60px_rgba(0,174,239,0.12)]"
                    >
                      <span className="text-xl sm:text-2xl md:text-3xl font-black bg-gradient-to-r from-[#00AEEF] to-[#33C8FF] bg-clip-text text-transparent">
                        G
                      </span>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>

              {(phase === "assembling" || phase === "assembled" || phase === "revealed") && (
                <svg
                  className="absolute inset-[3%] w-[94%] h-[94%] pointer-events-none"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {puzzlePieces.map((piece, index) => {
                    const cx = index === 0 || index === 2 ? 22 : 78;
                    const cy = index === 0 || index === 1 ? 22 : 78;
                    return (
                      <motion.line
                        key={`line-${piece.id}`}
                        x1={cx}
                        y1={cy}
                        x2={50}
                        y2={50}
                        stroke={piece.color}
                        strokeWidth="0.3"
                        strokeOpacity="0.15"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ delay: 0.6 + index * 0.12, duration: 0.7 }}
                        strokeLinecap="round"
                      />
                    );
                  })}
                  {puzzlePieces.map((piece, index) => {
                    const cx = index === 0 || index === 2 ? 22 : 78;
                    const cy = index === 0 || index === 1 ? 22 : 78;
                    return (
                      <motion.circle
                        key={`dot-${piece.id}`}
                        cx={cx}
                        cy={cy}
                        r="1.2"
                        fill={piece.color}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.4, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: 1.0 + index * 0.15,
                          ease: "easeInOut",
                        }}
                      />
                    );
                  })}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="0.8"
                    fill="#33C8FF"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 1.5, ease: "easeInOut" }}
                  />
                </svg>
              )}
            </div>
          </div>

          <AnimatePresence>
            {phase === "revealed" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-8 max-w-2xl sm:max-w-3xl mx-auto px-2"
              >
                {puzzlePieces.map((piece, index) => (
                  <motion.div
                    key={piece.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ delay: 0.15 + index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="text-center"
                  >
                    <span
                      className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.18em]"
                      style={{ color: piece.color }}
                    >
                      {piece.title}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {phase === "revealed" && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.96 }}
              transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-center mb-16 sm:mb-20"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
                <span className="text-white">Everything your brand needs.</span>
                <br />
                <span className="bg-gradient-to-r from-[#00AEEF] via-[#00AEEF] to-[#33C8FF] bg-clip-text text-transparent">
                  In one ecosystem.
                </span>
              </h2>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="border-t border-white/[0.06] pt-12 sm:pt-16">
          <AnimatePresence>
            {phase === "revealed" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12"
              >
                {stats.map((stat, index) => (
                  <StatCounter key={stat.label} stat={stat} delay={1.0 + index * 0.15} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
