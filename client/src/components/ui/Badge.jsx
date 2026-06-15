import { motion } from "framer-motion";

export default function Badge({
  children,
  variant = "default",
  className = "",
  dot = false,
  pulse = false,
}) {
  const variants = {
    default: "bg-white/[0.04] border-white/[0.06] text-zinc-400",
    brand: "bg-[#00AEEF]/10 border-[#00AEEF]/20 text-[#00AEEF]",
    purple: "bg-[#00AEEF]/10 border-[#00AEEF]/20 text-[#33C8FF]",
    cyan: "bg-[#00AEEF]/10 border-[#00AEEF]/20 text-[#33C8FF]",
    premium: "bg-gradient-to-r from-[#00AEEF]/20 to-[#33C8FF]/10 border-[#00AEEF]/20 text-[#33C8FF]",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] border ${variants[variant]} ${className}`}>
      {dot && (
        <motion.span
          animate={pulse ? { scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className={`w-1.5 h-1.5 rounded-full ${
            variant === "brand" ? "bg-[#00AEEF]" :
            variant === "purple" || variant === "premium" ? "bg-[#00AEEF]" :
            variant === "cyan" ? "bg-[#00AEEF]" :
            "bg-zinc-400"
          }`}
        />
      )}
      {children}
    </span>
  );
}
