export default function CardGlow({ children, className = "", color = "purple", hover = true }) {
  const glowColor = color === "green"
    ? "rgba(0,174,239,0.15)"
    : color === "cyan"
    ? "rgba(0,174,239,0.15)"
    : "rgba(0,174,239,0.2)";

  const borderGradient = color === "green"
    ? "linear-gradient(135deg, rgba(0,174,239,0.15), rgba(0,174,239,0.05), rgba(0,174,239,0.08))"
    : "linear-gradient(135deg, rgba(0,174,239,0.2), rgba(51,200,255,0.08), rgba(0,174,239,0.12))";

  return (
    <div className={`group relative ${className}`}>
      {/* Animated border glow */}
      <div
        className="absolute -inset-[1px] rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: borderGradient,
          filter: "blur(1px)",
          transition: "opacity 0.7s ease",
        }}
      />

      {/* Pulsing shadow */}
      <div
        className={`absolute inset-0 rounded-[inherit] pointer-events-none ${hover ? "group-hover:animate-pulse-glow" : ""}`}
        style={{
          boxShadow: hover ? `0 0 0px ${glowColor}` : "none",
          transition: "box-shadow 0.5s ease",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
