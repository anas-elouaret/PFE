import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

const statItems = [
  { label: "Projets actifs", value: "12", change: "+3", accent: "from-[#00AEEF] to-[#0095D4]" },
  { label: "Tâches terminées", value: "847", change: "+12%", accent: "from-[#00AEEF] to-[#0095D4]" },
  { label: "Messages", value: "24", change: "+8", accent: "from-[#00AEEF] to-[#0095D4]" },
  { label: "Stockage", value: "64%", change: "Utilisé", accent: "from-[#00AEEF] to-[#0095D4]" },
];


const containerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.15 },
  },
  exit: { opacity: 0, transition: { duration: 0.4 } },
};

const itemVariant = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function DashboardPreview({ user, onLogout, loading }) {
  return (
    <motion.div
      key="dashboard-preview"
      variants={containerVariant}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="relative flex min-h-screen w-full"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#0d0d14] to-[#050508]" />
      <div className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 30% at 50% 0%, rgba(0,174,239,0.04) 0%, transparent 60%)",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-50"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.02'/%3E%3C/svg%3E\")",
          opacity: 0.4,
        }}
      />

      <div className="relative z-10 flex w-full flex-col">
        <motion.header variants={itemVariant} className="flex items-center justify-between border-b border-white/[0.04] px-6 py-4 sm:px-10">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#00AEEF] to-[#0095D4] text-xs font-bold text-white shadow-lg shadow-[#00AEEF]/20">
              EC
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white/90">Espace Client</h2>
              <p className="text-[10px] text-white/30 tracking-wider uppercase">Tableau de bord</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-3 sm:flex">
              <div className="text-right">
                <p className="text-xs font-medium text-white/70">{user?.name || "Utilisateur"}</p>
                <p className="text-[10px] text-white/30">{user?.email || ""}</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#00AEEF] to-[#0095D4] text-xs font-bold text-white shadow-lg">
                {(user?.name || "U").charAt(0).toUpperCase()}
              </div>
            </div>
            <button
              onClick={onLogout}
              disabled={loading}
              className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-semibold text-white/50 transition-all hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white/80 disabled:opacity-50"
            >
              {loading ? "Déconnexion..." : "Déconnexion"}
            </button>
          </div>
        </motion.header>

        <div className="flex-1 overflow-y-auto p-6 sm:p-10">
          <motion.div variants={itemVariant} className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Bon retour, {user?.name?.split(" ")[0] || "Créateur"}
            </h1>
            <p className="mt-1 text-sm text-white/35">
              Voici un aperçu de votre activité
            </p>
          </motion.div>

          <motion.div variants={itemVariant} className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {statItems.map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -2, scale: 1.01 }}
                className="group relative overflow-hidden rounded-2xl p-4 sm:p-5"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-[0.04]`} />
                <p className="text-[10px] font-semibold tracking-[0.12em] text-white/35 uppercase">{stat.label}</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-white">{stat.value}</p>
                <p className={`mt-1 text-[11px] font-medium ${stat.change.startsWith("+") ? "text-[#33C8FF]" : "text-white/25"}`}>
                  {stat.change}
                </p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={itemVariant}>
            <h3 className="mb-4 text-sm font-semibold text-white/60">Projets récents</h3>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 3 }}
                  className="flex items-center justify-between rounded-2xl px-5 py-4 transition-all"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
                    border: "1px solid rgba(255,255,255,0.04)",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.04] text-white/30">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/80">Projet Alpha {i}</p>
                      <p className="text-[11px] text-white/30">Mis à jour il y a {i * 2}h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${
                      i === 1 ? "bg-[#33C8FF]" : i === 2 ? "bg-[#00AEEF]" : "bg-white/20"
                    }`} />
                    <span className="text-[10px] font-semibold tracking-wider text-white/30 uppercase">
                      {i === 1 ? "Terminé" : i === 2 ? "En cours" : "Brouillon"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
