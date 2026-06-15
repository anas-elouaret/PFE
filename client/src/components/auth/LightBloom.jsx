import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function LightBloom({ isOn }) {
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-0"
      initial={false}
      animate={{
        opacity: isOn ? 1 : 0,
      }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="absolute inset-0"
        style={{
          background: isOn
            ? "radial-gradient(ellipse 120% 50% at 50% 8%, rgba(0,174,239,0.12) 0%, rgba(0,174,239,0.06) 25%, rgba(0,149,212,0.03) 45%, transparent 65%)"
            : "none",
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: isOn
            ? "radial-gradient(ellipse 80% 40% at 50% 12%, rgba(0,174,239,0.15) 0%, rgba(0,174,239,0.08) 20%, transparent 50%)"
            : "none",
        }}
      />

      <motion.div
        className="absolute left-1/2 top-0 -translate-x-1/2"
        animate={{
          opacity: isOn ? [0.3, 0.6, 0.3] : 0,
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div
          className="h-[300px] w-[300px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(0,174,239,0.2) 0%, rgba(0,174,239,0.08) 30%, transparent 60%)",
            filter: "blur(40px)",
          }}
        />
      </motion.div>

      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(0,174,239,0.3) 30%, rgba(0,174,239,0.5) 50%, rgba(0,174,239,0.3) 70%, transparent 100%)",
          opacity: isOn ? 1 : 0,
          transition: "opacity 1s ease",
        }}
      />
    </motion.div>
  );
}
