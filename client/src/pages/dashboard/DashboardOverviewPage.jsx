import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useProjects } from "../../context/ProjectContext";
import { useAuth } from "../../context/AuthContext";
import { FolderOpen, Clock, CheckCircle2, AlertCircle, ArrowUpRight, Plus, Bell } from "lucide-react";
import { useTranslation } from "react-i18next";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }) };

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "text-[#00AEEF]", bg: "bg-[#00AEEF]/10", icon: Clock },
  in_progress: { label: "In Progress", color: "text-blue-400", bg: "bg-blue-400/10", icon: AlertCircle },
  completed: { label: "Completed", color: "text-[#00AEEF]", bg: "bg-[#00AEEF]/10", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-red-400", bg: "bg-red-400/10", icon: AlertCircle },
};

export default function DashboardOverviewPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { projects, loading } = useProjects();

  const stats = useMemo(() => ({
    total: projects.length,
    pending: projects.filter(p => p.status === "pending").length,
    inProgress: projects.filter(p => p.status === "in_progress").length,
    completed: projects.filter(p => p.status === "completed").length,
  }), [projects]);

  const recentProjects = useMemo(() => projects.slice(0, 5), [projects]);

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-6xl">
      {/* Header */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">{t("dashboard.overview.title")}</h1>
        <p className="mt-1 text-zinc-500">{t("dashboard.overview.subtitle", { name: user?.name?.split(" ")[0] || "Client" })}</p>
      </motion.div>

      {/* Stats */}
      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible" className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: t("dashboard.overview.activeProjects"), value: stats.total, accent: "from-zinc-400 to-zinc-600" },
          { label: t("dashboard.projects.status.pending"), value: stats.pending, accent: "from-[#00AEEF] to-[#0095D4]" },
          { label: t("dashboard.overview.pendingTasks"), value: stats.inProgress, accent: "from-blue-400 to-indigo-500" },
          { label: t("dashboard.overview.completedProjects"), value: stats.completed, accent: "from-[#00AEEF] to-[#33C8FF]" },
        ].map((s, i) => (
          <div key={s.label}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.06] p-5 card-glow-breath"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}>
            <div className={`absolute inset-0 bg-gradient-to-br ${s.accent} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />
            <p className="text-[11px] font-semibold tracking-[0.12em] text-zinc-500 uppercase">{s.label}</p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white">{s.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Recent Projects */}
      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
        className="rounded-2xl border border-white/[0.06] p-6 mb-6"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-white/80">{t("dashboard.overview.recentActivity")}</h2>
          <Link to="/client/dashboard/projects" className="text-xs font-semibold text-[#00AEEF]/70 hover:text-[#00AEEF] transition-colors">{t("dashboard.overview.viewAll")}</Link>
        </div>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-14 rounded-xl bg-white/[0.03] animate-pulse" />
            ))}
          </div>
        ) : recentProjects.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <FolderOpen className="w-10 h-10 text-zinc-600 mb-3" />
            <p className="text-sm font-medium text-zinc-400 mb-4">{t("dashboard.projects.noProjects")}</p>
            <Link to="/start-project"
              className="inline-flex items-center gap-2 rounded-xl bg-[#00AEEF] px-5 py-3 text-xs font-bold text-[#000000] shadow-lg shadow-[#00AEEF]/20 hover:bg-[#0095D4] transition-all">
              <Plus className="w-3.5 h-3.5" /> {t("dashboard.projects.newProject")}
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentProjects.map(p => {
              const cfg = STATUS_CONFIG[p.status] || STATUS_CONFIG.pending;
              return (
                <Link key={p.id} to={`/client/dashboard/${p.id}`}
                  className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3 hover:bg-white/[0.04] hover:border-white/[0.08] transition-all group">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white/80 truncate">{p.serviceTitle || p.projectType}</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5">{p.id} &middot; {new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${cfg.bg} ${cfg.color}`}>
                      <cfg.icon className="w-3 h-3" />
                      {t(p.status === "pending" ? "dashboard.projects.status.pending" : p.status === "in_progress" ? "dashboard.projects.status.active" : p.status === "completed" ? "dashboard.projects.status.completed" : p.status === "cancelled" ? "dashboard.projects.status.cancelled" : cfg.label)}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-zinc-500 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Quick actions */}
      <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/start-project"
          className="rounded-2xl border border-[#00AEEF]/20 bg-[#00AEEF]/5 p-5 hover:bg-[#00AEEF]/10 transition-all group">
          <Plus className="w-5 h-5 text-[#00AEEF] mb-2" />
          <p className="text-sm font-bold text-white">{t("dashboard.projects.newProject")}</p>
          <p className="text-xs text-zinc-500 mt-1">{t("dashboard.projects.noProjectsSub")}</p>
        </Link>
        <Link to="/client/dashboard/projects"
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-all group">
          <FolderOpen className="w-5 h-5 text-zinc-400 mb-2" />
          <p className="text-sm font-bold text-white">{t("dashboard.overview.viewAll")}</p>
          <p className="text-xs text-zinc-500 mt-1">{t("dashboard.billing.subtitle")}</p>
        </Link>
        <Link to="/client/dashboard/billing"
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-all group">
          <Bell className="w-5 h-5 text-zinc-400 mb-2" />
          <p className="text-sm font-bold text-white">{t("dashboard.billing.title")}</p>
          <p className="text-xs text-zinc-500 mt-1">{t("dashboard.billing.subtitle")}</p>
        </Link>
      </motion.div>
    </div>
  );
}
