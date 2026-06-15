export default function GlassPanel({
  children,
  className = "",
  border = true,
  glow = false,
  blur = "2xl",
  padding = "p-6",
  depth = "md",
  ...props
}) {
  const blurs = {
    sm: "backdrop-blur-md",
    md: "backdrop-blur-xl",
    lg: "backdrop-blur-2xl",
    xl: "backdrop-blur-3xl",
  };

  const shadows = {
    sm: "shadow-lg shadow-black/10",
    md: "shadow-2xl shadow-black/20",
    lg: "shadow-[0_20px_60px_rgba(0,0,0,0.3)]",
    xl: "shadow-[0_30px_80px_rgba(0,0,0,0.35)]",
  };

  return (
    <div
      className={`
        relative rounded-2xl bg-black/40 ${blurs[blur]} ${shadows[depth]}
        overflow-hidden ${padding} ${className}
      `}
      {...props}
    >
      {border && (
        <div className="absolute -inset-[1px] rounded-2xl overflow-hidden pointer-events-none -z-0">
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, rgba(0,174,239,0.1), rgba(0,174,239,0.06), rgba(0,174,239,0.06), rgba(0,174,239,0.1))",
            }}
          />
        </div>
      )}

      {glow && (
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#00AEEF]/8 rounded-full blur-[100px] pointer-events-none" />
      )}

      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
