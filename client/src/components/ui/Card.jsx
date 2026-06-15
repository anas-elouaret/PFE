import { motion } from "framer-motion";

export default function Card({
  children,
  className = "",
  hover = true,
  glow = false,
  padding = "p-6",
  depth = "medium",
  ...props
}) {
  const shadows = {
    sm: "shadow-[0_4px_12px_rgba(0,0,0,0.2)]",
    medium: "shadow-[0_10px_30px_rgba(0,0,0,0.25)]",
    lg: "shadow-[0_20px_50px_rgba(0,0,0,0.3)]",
    xl: "shadow-[0_30px_80px_rgba(0,0,0,0.35)]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5 }}
      className={`
        relative rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-white/[0.02]
        overflow-hidden ${shadows[depth]}
        ${hover ? "transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_15px_40px_rgba(0,0,0,0.3)]" : ""}
        ${glow ? "shadow-[0_0_30px_rgba(0,174,239,0.08)]" : ""}
        ${padding} ${className}
      `}
      {...props}
    >
      {glow && (
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00AEEF]/5 rounded-full blur-[80px] transition-all duration-500 group-hover:bg-[#00AEEF]/10" />
      )}
      <div className="relative z-[1]">{children}</div>
    </motion.div>
  );
}

export function CardGrid({ children, cols = { default: 1, md: 2, lg: 3 }, className = "" }) {
  const gridCols = `grid-cols-${cols.default} md:grid-cols-${cols.md || cols.default} lg:grid-cols-${cols.lg || cols.md || cols.default}`;
  return (
    <div className={`grid gap-5 ${gridCols} ${className}`}>
      {children}
    </div>
  );
}
