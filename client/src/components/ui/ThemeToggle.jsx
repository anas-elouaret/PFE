import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-[60px] h-[28px] outline-none cursor-pointer ${
        isDark
          ? "bg-white/10 border border-white/10"
          : "bg-slate-200 border border-slate-300/60"
      }`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        className="absolute top-[2px] left-[2px] w-[22px] h-[22px] flex items-center justify-center z-10 shadow-sm"
        animate={{ x: isDark ? 0 : 34 }}
        transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
        style={{
          background: isDark
            ? "linear-gradient(135deg, #1e1b4b, #312e81)"
            : "linear-gradient(135deg, #003d66, #00AEEF)",
        }}
      >
        {isDark ? (
          <Moon className="w-2.5 h-2.5 text-[#33C8FF]" />
        ) : (
          <Sun className="w-2.5 h-2.5 text-white" />
        )}
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-between px-2.5 pointer-events-none">
        <Moon
          className={`w-2.5 h-2.5 ${
            isDark ? "text-[#33C8FF] opacity-100" : "text-slate-400 opacity-40"
          }`}
        />
        <Sun
          className={`w-2.5 h-2.5 ${
            isDark ? "text-slate-500 opacity-40" : "text-amber-500 opacity-100"
          }`}
        />
      </div>
    </button>
  );
}
