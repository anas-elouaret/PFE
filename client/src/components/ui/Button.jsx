import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";

const variants = {
  primary:
    "bg-[#00AEEF] text-black font-bold shadow-lg shadow-[#00AEEF]/25",
  gradient:
    "bg-gradient-to-r from-[#00AEEF] to-[#33C8FF] text-white hover:from-[#00AEEF] hover:to-[#33C8FF]",
  secondary:
    "border border-white/20 bg-white/[0.02] text-zinc-300 hover:text-white hover:bg-white/[0.06] hover:border-white/30 backdrop-blur-sm",
  ghost:
    "text-zinc-400 hover:text-white hover:bg-white/[0.04]",
  danger:
    "text-red-400 hover:text-red-300 hover:bg-red-500/10",
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
      className={`
        relative inline-flex items-center justify-center gap-2 font-semibold
        transition-colors duration-300
        ${variant === "primary" ? "rounded-full" : "rounded-xl"}
        ${variants[variant]} ${sizes[size]}
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      disabled={disabled}
      style={variant === "primary" && !disabled ? { overflow: "visible" } : undefined}
      {...props}
    >
      {variant === "primary" && !disabled && (
        <span className="absolute -inset-[2px] rounded-full overflow-hidden pointer-events-none">
          <span
            className="absolute inset-0 rounded-full"
            style={{
              background: "conic-gradient(from var(--border-angle, 0deg), #00AEEF, #33C8FF, #00AEEF, #33C8FF, #00AEEF)",
              animation: "border-rotate 3s linear infinite",
            }}
          />
          <span className="absolute inset-[2px] rounded-full" style={{ background: "#00AEEF" }} />
        </span>
      )}

      {loading && (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full shrink-0"
        />
      )}

      {variant === "primary" && !disabled && (
        <span className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
          <span
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-in-out"
            style={{
              transform: isHovered
                ? "translateX(200%) skewX(-12deg)"
                : "translateX(-100%) skewX(-12deg)",
            }}
          />
        </span>
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
