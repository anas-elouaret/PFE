import { useId } from "react";

export default function AmbientWaves({ intensity = "medium", className = "" }) {
  const id = useId();
  const opacity = intensity === "low" ? "opacity-30" : intensity === "high" ? "opacity-80" : "opacity-50";

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${opacity} ${className}`} style={{ zIndex: -2 }}>
      {/* Wave blob 1 — slow large blue sweep */}
      <div
        className="absolute w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle at 30% 30%, rgba(0,174,239,0.15), transparent 70%)",
          animation: `ambient-wave-${id}-1 18s ease-in-out infinite`,
          filter: "blur(60px)",
        }}
      />

      {/* Wave blob 2 — medium violet drift */}
      <div
        className="absolute w-[500px] h-[500px] md:w-[700px] md:h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle at 70% 60%, rgba(51,200,255,0.12), transparent 70%)",
          animation: `ambient-wave-${id}-2 22s ease-in-out infinite`,
          filter: "blur(80px)",
        }}
      />

      {/* Wave blob 3 — small accent pulse */}
      <div
        className="absolute w-[400px] h-[400px] md:w-[500px] md:h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(0,174,239,0.08), transparent 70%)",
          animation: `ambient-wave-${id}-3 15s ease-in-out infinite`,
          filter: "blur(100px)",
        }}
      />

      {/* Wave blob 4 — subtle blue accent */}
      <div
        className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle at 40% 40%, rgba(0,174,239,0.04), transparent 70%)",
          animation: `ambient-wave-${id}-4 20s ease-in-out infinite`,
          filter: "blur(120px)",
        }}
      />

      {/* Mesh gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 20% 50%, rgba(0,174,239,0.03) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(51,200,255,0.02) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 80%, rgba(0,174,239,0.02) 0%, transparent 50%)
          `,
          animation: `ambient-wave-${id}-5 25s ease-in-out infinite`,
        }}
      />

      <style>{`
        @keyframes ambient-wave-${id}-1 {
          0%, 100% { transform: translate(-10%, -10%) scale(1); }
          25% { transform: translate(15%, 5%) scale(1.1); }
          50% { transform: translate(5%, 15%) scale(0.95); }
          75% { transform: translate(-5%, -5%) scale(1.05); }
        }
        @keyframes ambient-wave-${id}-2 {
          0%, 100% { transform: translate(10%, 5%) scale(1); }
          25% { transform: translate(-10%, 15%) scale(1.08); }
          50% { transform: translate(-15%, -5%) scale(0.92); }
          75% { transform: translate(5%, -10%) scale(1.02); }
        }
        @keyframes ambient-wave-${id}-3 {
          0%, 100% { transform: translate(0%, 0%) scale(1); opacity: 0.6; }
          33% { transform: translate(8%, -8%) scale(1.15); opacity: 1; }
          66% { transform: translate(-8%, 8%) scale(0.9); opacity: 0.7; }
        }
        @keyframes ambient-wave-${id}-4 {
          0%, 100% { transform: translate(0%, 10%) scale(1); }
          50% { transform: translate(10%, -10%) scale(1.12); }
        }
        @keyframes ambient-wave-${id}-5 {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          [class*="ambient-wave-"] { animation: none !important; opacity: 0.3 !important; }
        }
      `}</style>
    </div>
  );
}
