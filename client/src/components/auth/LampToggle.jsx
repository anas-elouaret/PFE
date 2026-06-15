import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

export default function LampToggle({ isOn, onToggle }) {
  const bulbRef = useRef(null);
  const glowRef = useRef(null);
  const armRef = useRef(null);

  useEffect(() => {
    if (!bulbRef.current) return;
    gsap.to(bulbRef.current, {
      boxShadow: isOn
        ? "0 0 40px rgba(0,174,239,0.8), 0 0 80px rgba(0,174,239,0.4), 0 0 120px rgba(0,174,239,0.2)"
        : "0 0 5px rgba(100,100,100,0.2)",
      backgroundColor: isOn ? "#00AEEF" : "#374151",
      duration: 0.8,
      ease: "power2.inOut",
    });
  }, [isOn]);

  useEffect(() => {
    if (!glowRef.current) return;
    gsap.to(glowRef.current, {
      opacity: isOn ? 1 : 0,
      scale: isOn ? 1 : 0.5,
      duration: 1,
      ease: "power3.out",
    });
  }, [isOn]);

  return (
    <motion.button
      onClick={onToggle}
      className="relative z-50 flex cursor-pointer flex-col items-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      aria-label={isOn ? "Turn off lamp" : "Turn on lamp"}
    >
      <div className="relative flex flex-col items-center">
        <motion.div
          ref={bulbRef}
          className="relative h-6 w-6 rounded-full bg-gray-500 shadow-lg"
          animate={isOn ? {
            scale: [1, 1.08, 1],
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
        </motion.div>

        <div
          ref={armRef}
          className="mt-0 h-14 w-0.5 bg-gradient-to-b from-[#00AEEF]/60 to-gray-600"
        />

        <motion.div
          className="mt-0 h-10 w-10 rounded-full border-2 border-gray-700 bg-gradient-to-b from-gray-700 to-gray-800 shadow-lg"
          whileHover={{ borderColor: "rgba(0,174,239,0.3)" }}
        >
          <div className="flex h-full items-center justify-center">
            <div className="h-0.5 w-4 rounded-full bg-gray-500" />
          </div>
        </motion.div>

        <motion.div
          className="-mt-1 h-3 w-12 rounded-b-full border-b-2 border-l-2 border-r-2 border-gray-700 bg-gradient-to-b from-gray-800 to-gray-900"
        />

        <motion.div
          className="mt-1 h-16 w-1 bg-gradient-to-b from-gray-700 to-gray-800"
        />

        <motion.div
          className="h-8 w-16 rounded-b-xl border-2 border-gray-700 bg-gradient-to-b from-gray-800 to-gray-900 shadow-inner"
        >
          <div className="flex h-full items-center justify-center gap-1.5 px-2">
            <motion.div
              className={`h-2 w-2 rounded-full ${isOn ? "bg-[#00AEEF]" : "bg-gray-600"}`}
              animate={{ opacity: isOn ? [0.4, 1, 0.4] : 0.4 }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="text-[7px] font-semibold tracking-widest text-gray-500">
              {isOn ? "ON" : "OFF"}
            </span>
          </div>
        </motion.div>
      </div>

      <div
        ref={glowRef}
        className="pointer-events-none fixed inset-0 opacity-0"
        style={{
          background:
            "radial-gradient(circle at 50% 15%, rgba(0,174,239,0.15) 0%, rgba(0,174,239,0.08) 30%, transparent 60%)",
        }}
      />
    </motion.button>
  );
}
