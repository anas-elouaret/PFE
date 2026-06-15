import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface Service {
  id: string;
  title: string;
  icon: string;
  color: string;
  gradient: string;
  description: string;
}

const services: Service[] = [
  {
    id: "graphic-design",
    title: "Graphic Design",
    icon: "🎨",
    color: "#33C8FF",
    gradient: "from-[#00AEEF] to-[#33C8FF]",
    description: "Stunning visual identities that captivate.",
  },
  {
    id: "social-media",
    title: "Social Media Management",
    icon: "📱",
    color: "#00AEEF",
    gradient: "from-[#00AEEF] to-[#33C8FF]",
    description: "Strategic presence across all platforms.",
  },
  {
    id: "marketing",
    title: "Marketing Strategy",
    icon: "📈",
    color: "#00AEEF",
    gradient: "from-[#00AEEF] to-[#33C8FF]",
    description: "Data-driven campaigns for growth.",
  },
  {
    id: "ugc",
    title: "UGC Content Creation",
    icon: "🎥",
    color: "#00AEEF",
    gradient: "from-[#00AEEF] to-[#33C8FF]",
    description: "Authentic content that converts.",
  },
  {
    id: "photography",
    title: "Photography",
    icon: "📸",
    color: "#00AEEF",
    gradient: "from-[#00AEEF] to-[#33C8FF]",
    description: "Professional visuals that tell your story.",
  },
];

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

function getOrbitPosition(index: number, total: number, radius: number) {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  };
}

function calculateRadius(width: number) {
  if (width < 420) return width * 0.3;
  if (width < 640) return width * 0.28;
  if (width < 1024) return width * 0.26;
  return width * 0.24;
}

interface GrowstackHeroSectionProps {
  introFinished: boolean;
}

export default function GrowstackHeroSection({ introFinished }: GrowstackHeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const mousePos = useMousePosition(sectionRef);

  const [activeServiceIndex, setActiveServiceIndex] = useState(-1);
  const [emittedCount, setEmittedCount] = useState(0);
  const [pulseIndex, setPulseIndex] = useState(-1);
  const [orbitRadius, setOrbitRadius] = useState(160);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const parallaxY = useSpring(useTransform(scrollYProgress, [0, 1], [0, 120]), {
    damping: 50,
    stiffness: 400,
  });

  useEffect(() => {
    const updateRadius = () => setOrbitRadius(calculateRadius(window.innerWidth));
    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  const logoMagnetX = mousePos.x * 20;
  const logoMagnetY = mousePos.y * 20;

  const servicePositions = useMemo(
    () => services.map((_, i) => getOrbitPosition(i, services.length, orbitRadius)),
    [orbitRadius],
  );

  useEffect(() => {
    if (!introFinished) return;
    const t1 = setTimeout(() => setActiveServiceIndex(0), 600);
    return () => clearTimeout(t1);
  }, [introFinished]);

  useEffect(() => {
    if (activeServiceIndex < 0) return;
    const t = setTimeout(() => {
      setEmittedCount((prev) => prev + 1);
      if (activeServiceIndex < services.length - 1) {
        setActiveServiceIndex((prev) => prev + 1);
      } else {
        setActiveServiceIndex(-1);
      }
    }, 800);
    return () => clearTimeout(t);
  }, [activeServiceIndex]);

  useEffect(() => {
    if (emittedCount < services.length) return;
    const startDelay = setTimeout(() => setPulseIndex(0), 400);
    const interval = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % services.length);
    }, 1500);
    return () => {
      clearTimeout(startDelay);
      clearInterval(interval);
    };
  }, [emittedCount]);

  const getServiceState = useCallback(
    (index: number) => {
      if (activeServiceIndex === index) return "emerging" as const;
      if (pulseIndex === index && emittedCount >= services.length) return "pulsing" as const;
      if (emittedCount > index) return "orbiting" as const;
      return "hidden" as const;
    },
    [activeServiceIndex, emittedCount, pulseIndex],
  );

  const bgGlowSize = useMemo(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1024;
    if (w < 640) return "w-48 h-48";
    if (w < 1024) return "w-72 h-72";
    return "w-96 h-96";
  }, []);

  const containerSize = useMemo(() => {
    const size = orbitRadius * 2 + 200;
    return Math.max(size, 320);
  }, [orbitRadius]);

  const logoOpacity = introFinished ? 1 : 0;

  return (
    <section
      ref={sectionRef}
      className="relative min-h-svh flex flex-col overflow-hidden bg-surface-950"
      style={{ opacity: logoOpacity, transition: "opacity 0.45s ease" }}
    >
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(0,174,239,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(0,174,239,0.06),transparent_50%)]" />

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className={`absolute top-1/4 left-1/4 ${bgGlowSize} rounded-full bg-[#00AEEF]/10 blur-[100px]`}
          animate={{ opacity: [0.08, 0.25, 0.08], scale: [1, 1.08, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className={`absolute bottom-1/3 right-1/4 ${bgGlowSize} rounded-full bg-[#00AEEF]/10 blur-[100px]`}
          animate={{ opacity: [0.06, 0.2, 0.06], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[500px] md:w-[700px] h-[400px] sm:h-[500px] md:h-[700px] rounded-full bg-[#00AEEF]/5 blur-[150px]"
          animate={{ opacity: [0.04, 0.12, 0.04] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] md:w-[500px] aspect-square"
          style={{
            background:
              "conic-gradient(from 0deg, transparent, rgba(0,174,239,0.04), transparent, rgba(0,174,239,0.04), transparent)",
            borderRadius: "50%",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[280px] md:w-[360px] aspect-square"
          style={{
            background:
              "conic-gradient(from 90deg, transparent, rgba(0,174,239,0.03), transparent, rgba(0,174,239,0.03), transparent)",
            borderRadius: "50%",
          }}
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${((i * 137.5 + 50) % 100)}%`,
              top: `${((i * 89.3 + 20) % 100)}%`,
              backgroundColor: i % 3 === 0 ? "#33C8FF" : i % 3 === 1 ? "#00AEEF" : "#00AEEF",
            }}
            animate={{
              y: [0, -(20 + (i % 10) * 3), 0],
              opacity: [0, 0.45, 0],
              scale: [0, 1.2, 0],
            }}
            transition={{
              duration: 2 + (i % 3) * 1.5,
              repeat: Infinity,
              delay: (i % 8) * 0.35,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col min-h-svh max-w-full">
        <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-24 pb-16">
          <motion.div
            className="relative flex flex-col items-center justify-center"
            style={{ y: parallaxY }}
          >
            <div
              ref={logoRef}
              className="relative flex items-center justify-center"
              style={{ perspective: 1200 }}
            >
              <motion.div
                className="relative flex items-center justify-center"
                animate={{
                  rotateY: [0, 8, 0, -8, 0],
                  rotateX: [0, -4, 0, 4, 0],
                }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  x: logoMagnetX,
                  y: logoMagnetY,
                }}
              >
                <div
                  className="relative flex items-center justify-center"
                  style={{
                    width: containerSize,
                    height: containerSize,
                    maxWidth: "92vw",
                    maxHeight: "92vw",
                  }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(0,174,239,0.15) 0%, transparent 70%)",
                    }}
                    animate={{
                      scale: [1, 1.06, 1],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border border-[#00AEEF]/20 pointer-events-none"
                    animate={{
                      scale: [1, 1.03, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.3,
                    }}
                  />

                  <motion.div
                    className="absolute inset-0"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    style={{ originX: "50%", originY: "50%" }}
                  >
                    {services.map((service, index) => {
                      const state = getServiceState(index);
                      const targetPos = servicePositions[index];
                      const isActive = state === "emerging";
                      const isOrbiting = state === "orbiting";
                      const isPulsing = state === "pulsing" && emittedCount >= services.length;
                      const isVisible = isActive || isOrbiting || isPulsing;

                      return (
                        <motion.div
                          key={service.id}
                          className="absolute"
                          style={{
                            left: "50%",
                            top: "50%",
                            translate: "-50% -50%",
                            willChange: "transform, opacity",
                            zIndex: isPulsing ? 15 : 10,
                          }}
                          initial={{
                            x: 0,
                            y: 0,
                            scale: 0,
                            opacity: 0,
                            rotate: 0,
                          }}
                          animate={
                            isActive
                              ? {
                                  x: targetPos.x,
                                  y: targetPos.y,
                                  scale: [0, 1.4, 1],
                                  opacity: [0, 1, 1],
                                  rotate: -360,
                                }
                              : isVisible
                                ? {
                                    x: targetPos.x,
                                    y: targetPos.y,
                                    scale: isPulsing ? [1, 1.08, 1] : 1,
                                    opacity: 1,
                                    rotate: -360,
                                  }
                                : {
                                    x: 0,
                                    y: 0,
                                    scale: 0,
                                    opacity: 0,
                                    rotate: 0,
                                  }
                          }
                          transition={
                            isActive
                              ? {
                                  x: { type: "spring", stiffness: 300, damping: 18, mass: 1 },
                                  y: { type: "spring", stiffness: 300, damping: 18, mass: 1 },
                                  scale: {
                                    duration: 0.4,
                                    ease: [0.16, 1, 0.3, 1],
                                    times: [0, 0.4, 1],
                                  },
                                  opacity: { duration: 0.2 },
                                  rotate: {
                                    duration: 18,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: 0.4,
                                  },
                                }
                              : isPulsing
                                ? {
                                    scale: {
                                      duration: 1.2,
                                      repeat: Infinity,
                                      ease: "easeInOut",
                                    },
                                    rotate: {
                                      duration: 18,
                                      repeat: Infinity,
                                      ease: "linear",
                                    },
                                  }
                                : {
                                    type: "spring",
                                    stiffness: 350,
                                    damping: 20,
                                    rotate: {
                                      duration: 18,
                                      repeat: Infinity,
                                      ease: "linear",
                                    },
                                  }
                          }
                        >
                          <div
                            className={`relative flex flex-col items-center justify-center w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl border backdrop-blur-2xl transition-all duration-500 ${
                              isPulsing
                                ? "border-[#00AEEF]/50 shadow-[0_0_50px_rgba(0,174,239,0.25)]"
                                : "border-white/[0.08]"
                            } bg-gradient-to-br from-white/[0.06] to-white/[0.015]`}
                          >
                            <div
                              className={`absolute inset-0 rounded-2xl transition-opacity duration-500 pointer-events-none ${
                                isPulsing ? "opacity-100" : "opacity-0"
                              }`}
                              style={{
                                background: `radial-gradient(circle at 50% 50%, ${service.color}25, transparent 70%)`,
                              }}
                            />
                            <span className="relative z-10 text-xl sm:text-2xl md:text-3xl mb-1">
                              {service.icon}
                            </span>
                            <span
                              className="relative z-10 text-[7px] sm:text-[8px] md:text-[10px] font-bold uppercase tracking-[0.15em] text-center leading-tight px-1"
                              style={{ color: service.color }}
                            >
                              {service.title}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}

                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      viewBox="0 0 100 100"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      {services.map((service, index) => {
                        const state = getServiceState(index);
                        const isVisible = state === "emerging" || state === "orbiting" || state === "pulsing";
                        const targetPos = servicePositions[index];
                        if (!isVisible) return null;

                        const mappedX = (targetPos.x / (containerSize / 2)) * 50 + 50;
                        const mappedY = (targetPos.y / (containerSize / 2)) * 50 + 50;

                        return (
                          <g key={`connection-${service.id}`}>
                            <motion.line
                              x1="50"
                              y1="50"
                              x2={mappedX}
                              y2={mappedY}
                              stroke={service.color}
                              strokeWidth="0.4"
                              strokeOpacity={state === "pulsing" ? "0.5" : "0.2"}
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ delay: 0.15, duration: 0.35 }}
                              strokeLinecap="round"
                            />
                            <motion.circle
                              cx={mappedX}
                              cy={mappedY}
                              r="0.8"
                              fill={service.color}
                              animate={{
                                opacity: state === "pulsing" ? [0.3, 0.8, 0.3] : [0.1, 0.3, 0.1],
                              }}
                              transition={{
                                duration: 1.2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: index * 0.1,
                              }}
                            />
                          </g>
                        );
                      })}
                    </svg>
                  </motion.div>

                  <div className="relative z-20 flex flex-col items-center justify-center pointer-events-none">
                    <motion.div
                      className="w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-2xl flex items-center justify-center backdrop-blur-3xl border border-white/[0.1]"
                      animate={{
                      boxShadow: [
                        "0 0 30px rgba(0,174,239,0.08)",
                        "0 0 60px rgba(0,174,239,0.18)",
                        "0 0 30px rgba(0,174,239,0.08)",
                      ],
                      }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(0,174,239,0.1), rgba(0,174,239,0.08), rgba(0,174,239,0.05))",
                      }}
                    >
                      <span className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-[#00AEEF] via-[#00AEEF] to-[#33C8FF] bg-clip-text text-transparent tracking-tight">
                        G
                      </span>
                    </motion.div>

                    <motion.span
                      className="mt-4 text-base sm:text-lg md:text-xl font-bold tracking-[0.3em] uppercase"
                      style={{
                        background:
                          "linear-gradient(to right, rgba(0,174,239,0.9), rgba(0,174,239,0.9))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      GROWSTACK
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            </div>

            <AnimatePresence>
              {emittedCount >= services.length && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-base sm:text-lg md:text-xl text-zinc-400 font-medium tracking-wide mt-8 sm:mt-10"
                >
                  Your Growth. Our Stack.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 sm:mt-12"
          >
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Link
                to="/services"
                className="inline-flex items-center gap-3 bg-[#00AEEF] text-black font-bold px-8 py-4 rounded-full text-sm uppercase tracking-widest shadow-xl shadow-[#00AEEF]/25 hover:shadow-[#00AEEF]/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-3 border border-white/20 text-zinc-300 font-medium px-8 py-4 rounded-full text-sm uppercase tracking-widest hover:border-white/40 hover:text-white transition-all duration-300"
              >
                Explore Services
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 rounded-full border border-white/15 flex items-start justify-center p-1.5"
          >
            <motion.div
              animate={{ y: [0, 4, 0], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-2 rounded-full bg-white/30"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
