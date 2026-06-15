import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

export default function LampEnvironment({ isOn, onToggle }) {
  const bulbRef = useRef(null);
  const glowRingRef = useRef(null);
  const coneRef = useRef(null);
  const lightConeRef = useRef(null);
  const armRef = useRef(null);
  const baseRef = useRef(null);

  useEffect(() => {
    if (!bulbRef.current) return;
    gsap.to(bulbRef.current, {
      boxShadow: isOn
        ? "0 0 60px rgba(0,174,239,0.9), 0 0 120px rgba(0,174,239,0.4), 0 0 200px rgba(0,174,239,0.15)"
        : "0 0 5px rgba(100,100,100,0.1)",
      backgroundColor: isOn ? "#00AEEF" : "#374151",
      duration: 1.2,
      ease: "power3.inOut",
    });
  }, [isOn]);

  useEffect(() => {
    if (!glowRingRef.current) return;
    gsap.to(glowRingRef.current, {
      opacity: isOn ? 0.6 : 0,
      scale: isOn ? 1 : 0.3,
      duration: 1.4,
      ease: "power2.out",
    });
  }, [isOn]);

  useEffect(() => {
    if (!coneRef.current) return;
    gsap.to(coneRef.current, {
      borderColor: isOn ? "rgba(0,174,239,0.3)" : "rgba(75,75,75,0.5)",
      duration: 1,
      ease: "power2.inOut",
    });
  }, [isOn]);

  useEffect(() => {
    if (!lightConeRef.current) return;
    gsap.to(lightConeRef.current, {
      opacity: isOn ? 0.35 : 0,
      scaleY: isOn ? 1 : 0,
      duration: 1.2,
      ease: "power3.out",
      transformOrigin: "top center",
    });
  }, [isOn]);

  useEffect(() => {
    if (!baseRef.current) return;
    gsap.to(baseRef.current, {
      borderColor: isOn ? "rgba(0,174,239,0.15)" : "rgba(75,75,75,0.3)",
      duration: 1,
      ease: "power2.inOut",
    });
  }, [isOn]);

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <motion.button
        onClick={onToggle}
        className="relative z-20 flex cursor-pointer flex-col items-center outline-none"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.97 }}
        aria-label={isOn ? "Éteindre la lampe" : "Allumer la lampe"}
      >
        <div className="relative flex flex-col items-center">
          <motion.div
            ref={bulbRef}
            className="relative h-8 w-8 rounded-full bg-gray-500"
            animate={isOn ? {
              scale: [1, 1.06, 1],
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className="absolute inset-[3px] rounded-full bg-gradient-to-br from-white/50 to-transparent" />
            <div className="absolute -inset-3 rounded-full bg-[#00AEEF]/5 blur-sm" />
          </motion.div>

          <div
            ref={glowRingRef}
            className="pointer-events-none absolute -top-8 h-24 w-24 rounded-full opacity-0"
            style={{
              background:
                "radial-gradient(circle, rgba(0,174,239,0.25) 0%, rgba(0,174,239,0.1) 30%, transparent 60%)",
              filter: "blur(20px)",
            }}
          />

          <div
            ref={lightConeRef}
            className="pointer-events-none absolute top-6 w-64 opacity-0"
            style={{
              height: "500px",
              background:
                "linear-gradient(180deg, rgba(0,174,239,0.2) 0%, rgba(0,174,239,0.08) 20%, rgba(0,174,239,0.03) 40%, transparent 60%)",
              clipPath: "polygon(25% 0%, 75% 0%, 100% 100%, 0% 100%)",
              filter: "blur(30px)",
            }}
          />

          <div
            ref={coneRef}
            className="relative -mt-1 h-16 w-20 rounded-t-full border-b-0"
            style={{
              border: "1px solid rgba(75,75,75,0.5)",
              background: isOn
                ? "linear-gradient(180deg, rgba(0,174,239,0.08), rgba(20,20,25,0.95))"
                : "linear-gradient(180deg, rgba(50,50,55,0.5), rgba(20,20,25,0.95))",
              transition: "background 1s ease",
            }}
          >
            <div className="absolute inset-x-4 top-2 h-0.5 rounded-full bg-white/5" />
          </div>

          <div className="flex flex-col items-center">
            <motion.div className="h-16 w-1 bg-gradient-to-b from-gray-600 to-gray-700" />

            <motion.div className="flex items-center gap-3">
              <div className="h-0.5 w-8 bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
              <div
                className="h-10 w-10 rounded-full border border-gray-700 bg-gradient-to-b from-gray-700 to-gray-800 shadow-lg"
              >
                <div className="flex h-full items-center justify-center">
                  <div className="flex gap-1">
                    <div className="h-0.5 w-3 rotate-45 rounded-full bg-gray-500" />
                    <div className="h-0.5 w-3 -rotate-45 rounded-full bg-gray-500" />
                  </div>
                </div>
              </div>
              <div className="h-0.5 w-8 bg-gradient-to-r from-transparent via-gray-600 to-transparent" />
            </motion.div>

            <motion.div className="-mt-3 h-4 w-14 rounded-b-full border-b border-l border-r border-gray-700 bg-gradient-to-b from-gray-800 to-gray-900" />

            <motion.div className="h-20 w-1 bg-gradient-to-b from-gray-700 to-gray-800" />
          </div>

          <div
            ref={baseRef}
            className="h-10 w-24 rounded-b-2xl border-2 border-gray-700 bg-gradient-to-b from-gray-800 to-[#0a0a0f] shadow-inner"
            style={{ transition: "border-color 1s ease" }}
          >
            <div className="flex h-full items-center justify-center gap-2 px-3">
              <motion.div
                className={`h-2 w-2 rounded-full ${isOn ? "bg-[#00AEEF]" : "bg-gray-600"}`}
                animate={{ opacity: isOn ? [0.4, 1, 0.4] : 0.4 }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <span className="text-[8px] font-bold tracking-[0.15em] text-gray-500 uppercase">
                {isOn ? "Allumé" : "Éteint"}
              </span>
            </div>
          </div>

          <motion.div className="mt-1 h-1 w-32 rounded-full bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
        </div>
      </motion.button>

      {!isOn && (
        <motion.div
          className="absolute bottom-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <p className="text-[10px] tracking-[0.25em] text-white/30 uppercase">
            Activez la lampe
          </p>
          <p className="mt-1 text-[9px] tracking-[0.2em] text-white/25 uppercase">
            pour découvrir l'espace client
          </p>
        </motion.div>
      )}
    </div>
  );
}
