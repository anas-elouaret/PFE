import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

const variants = {
  primary: "border border-orange-500 bg-orange-500 text-slate-950 font-bold",
  gradient: "bg-gradient-to-r from-orange-500 to-orange-600 text-slate-950",
  secondary: "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 hover:text-slate-900",
  ghost: "text-slate-700 hover:text-orange-600",
  danger: "text-red-400 hover:text-red-300 hover:bg-red-500/10",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
  xl: "px-9 py-4 text-lg",
};

function isTouchDevice() {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  disabled = false,
  loading = false,
  ...props
}) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    setTouch(isTouchDevice());
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (touch) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / 6;
    const deltaY = (e.clientY - centerY) / 6;
    setCoords({
      x: Math.max(-10, Math.min(10, deltaX)),
      y: Math.max(-10, Math.min(10, deltaY)),
    });
  }, [touch]);

  const handleMouseEnter = useCallback(() => {
    if (touch) return;
    setIsHovered(true);
  }, [touch]);

  const handleMouseLeave = useCallback(() => {
    if (touch) return;
    setIsHovered(false);
    setCoords({ x: 0, y: 0 });
  }, [touch]);

  return (
    <motion.button
      animate={disabled ? {} : {
        x: touch ? 0 : (isHovered ? coords.x : 0),
        y: touch ? 0 : (isHovered ? coords.y : 0),
        scale: isHovered ? 1.02 : 1,
      }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={
        `
        relative inline-flex items-center justify-center gap-2 font-semibold
        transition-colors duration-300
        rounded-none
        ${variants[variant]} ${sizes[size]}
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {loading && (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full shrink-0"
        />
      )}

      {variant === "primary" && !disabled && (
        <span
          className="absolute inset-0 bg-orange-500/10 pointer-events-none"
          style={{ opacity: isHovered ? 1 : 0, transition: "opacity 200ms ease-in-out" }}
        />
      )}

      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </motion.button>
  );
}

export function ButtonGroup({ children, className = "" }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {children}
    </div>
  );
}
