import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useState, useCallback } from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();
  const [ripples, setRipples] = useState([]);

  const handleClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now() + Math.random();

    setRipples(prev => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 600);

    toggleTheme();
  }, [toggleTheme]);

  return (
    <button
      onClick={handleClick}
      className={`relative overflow-hidden rounded-full p-0.5 w-[60px] h-[28px] transition-all duration-500 outline-none ${
        isDark
          ? "bg-white/10 border border-white/10"
          : "bg-slate-200 border border-slate-300/60"
      }`}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <motion.div
        className="absolute top-[2px] left-[2px] w-[22px] h-[22px] rounded-full flex items-center justify-center z-10 shadow-sm"
        animate={{ x: isDark ? 0 : 34 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
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
          className={`w-2.5 h-2.5 transition-all duration-500 ${
            isDark ? "text-[#33C8FF] opacity-100" : "text-slate-400 opacity-40"
          }`}
        />
        <Sun
          className={`w-2.5 h-2.5 transition-all duration-500 ${
            isDark ? "text-slate-500 opacity-40" : "text-amber-500 opacity-100"
          }`}
        />
      </div>

      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute pointer-events-none rounded-full"
          style={{
            left: ripple.x - 8,
            top: ripple.y - 8,
            width: 16,
            height: 16,
            background: isDark
              ? "radial-gradient(circle, rgba(0,174,239,0.3), transparent)"
              : "radial-gradient(circle, rgba(0,174,239,0.3), transparent)",
            animation: "theme-ripple 0.6s ease-out forwards",
          }}
        />
      ))}
    </button>
  );
}
