import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useProjects } from "../../context/ProjectContext";
import { LogOut, FolderOpen, Plus, ArrowUpRight, Clock, CheckCircle2, AlertCircle, XCircle } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
};

const STATUS_CONFIG = {
  pending: { label: "Pending Review", color: "text-[#00AEEF]", bg: "bg-[#00AEEF]/10", border: "border-[#00AEEF]/20", icon: Clock },
  in_progress: { label: "In Progress", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", icon: AlertCircle },
  completed: { label: "Completed", color: "text-[#00AEEF]", bg: "bg-[#00AEEF]/10", border: "border-[#00AEEF]/20", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20", icon: XCircle },
};

function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-white/5 rounded" />
          <div className="h-3 w-20 bg-white/5 rounded" />
        </div>
        <div className="h-6 w-16 bg-white/5 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-white/5 rounded" />
        <div className="h-3 w-3/4 bg-white/5 rounded" />
      </div>
      <div className="flex gap-2 mt-4">
        <div className="h-8 w-24 bg-white/5 rounded-xl" />
        <div className="h-8 w-24 bg-white/5 rounded-xl" />
      </div>
    </div>
  );
}

function EmptyState({ onCreate }) {
  const { t } = useTranslation();
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-6">
        <FolderOpen className="w-8 h-8 text-zinc-500" />
      </div>
      <h3 className="text-xl font-black text-white mb-2">{t("dashboard.projects.noProjects")}</h3>
      <p className="text-zinc-500 max-w-sm mb-8">{t("dashboard.projects.noProjectsSub")}</p>
      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={onCreate}
        className="inline-flex items-center gap-2 rounded-2xl bg-[#00AEEF] px-6 py-3.5 text-sm font-black text-[#000000] shadow-xl shadow-[#00AEEF]/20">
        <Plus className="w-4 h-4" />
        {t("dashboard.projects.newProject")}
      </motion.button>
    </motion.div>
  );
}

export default function ClientDashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { projects, loading } = useProjects();
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    if (filter === "all") return projects;
    return projects.filter(p => p.status === filter);
  }, [projects, filter]);

  const stats = useMemo(() => ({
    total: projects.length,
    pending: projects.filter(p => p.status === "pending").length,
    inProgress: projects.filter(p => p.status === "in_progress").length,
    completed: projects.filter(p => p.status === "completed").length,
  }), [projects]);

  const handleLogout = () => {
    logout();
    navigate("/client/login", { replace: true });
  };

  const initial = user?.name?.charAt(0)?.toUpperCase() || "C";

  return (
    <div className="min-h-screen bg-[#04050C]">
      <header className="border-b border-white/[0.04] bg-white/[0.01] backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#00AEEF] to-[#0095D4] text-xs font-black text-[#000000] shadow-lg shadow-[#00AEEF]/20">
              {initial}
            </div>
            <div>
              <p className="text-sm font-bold text-white">{user?.name || t("dashboard.client.title")}</p>
              <p className="text-[10px] tracking-wider text-zinc-500 uppercase">{t("dashboard.client.title")}</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/start-project"
              className="rounded-xl bg-[#00AEEF] px-4 py-2 text-xs font-bold text-[#000000] hover:bg-[#0095D4] transition-all shadow-lg shadow-[#00AEEF]/20">
              {t("dashboard.projects.newProject")}
            </Link>
            <button onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-xs font-semibold text-zinc-400 transition-all hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white">
              <LogOut className="h-3.5 w-3.5" />
              {t("navbar.logout")}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="mb-8">
          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
            {t("dashboard.overview.subtitle", { name: user?.name?.split(" ")[0] || "Client" })}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">{t("dashboard.client.subtitle")}</p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {[
            { label: t("dashboard.overview.activeProjects"), value: stats.total, accent: "from-zinc-400 to-zinc-600" },
            { label: t("dashboard.projects.status.pending"), value: stats.pending, accent: "from-[#00AEEF] to-[#0095D4]" },
            { label: t("dashboard.projects.status.active"), value: stats.inProgress, accent: "from-blue-400 to-indigo-500" },
            { label: t("dashboard.projects.status.completed"), value: stats.completed, accent: "from-[#00AEEF] to-[#33C8FF]" },
          ].map((stat, i) => (
            <motion.div key={stat.label} variants={fadeUp} custom={i + 2}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.06] p-5"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}>
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-[0.04]`} />
              <div className="relative">
                <p className="text-[11px] font-semibold tracking-[0.12em] text-zinc-500 uppercase">{stat.label}</p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-white">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filter Tabs */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
          className="mb-6 flex gap-1.5 p-1 rounded-xl bg-white/[0.02] border border-white/[0.06] w-fit">
          {[
            { key: "all", label: t("dashboard.overview.viewAll") },
            { key: "pending", label: t("dashboard.projects.status.pending") },
            { key: "in_progress", label: t("dashboard.projects.status.active") },
            { key: "completed", label: t("dashboard.projects.status.completed") },
          ].map(tab => (
            <button key={tab.key} onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filter === tab.key
                  ? "bg-white/10 text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}>
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Project Cards */}
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState onCreate={() => navigate("/start-project")} />
        ) : (
          <motion.div layout className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project, index }) {
  const { t } = useTranslation();
  const cfg = STATUS_CONFIG[project.status] || STATUS_CONFIG.pending;
  const StatusIcon = cfg.icon;

  return (
    <Link to={`/client/dashboard/${project.id}`} className="block">
      <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        transition={{ delay: index * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="group relative overflow-hidden rounded-2xl border border-white/[0.06] p-5 transition-all hover:border-white/[0.12] hover:bg-white/[0.03] cursor-pointer"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}>
        <div className="flex items-start justify-between mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-white truncate">{project.serviceTitle || project.projectType}</h3>
            <p className="text-[11px] text-zinc-500 mt-0.5">{project.id}</p>
          </div>
          <span className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${cfg.bg} ${cfg.color} ${cfg.border} border ml-2`}>
            <StatusIcon className="w-3 h-3" />
            {t(project.status === "pending" ? "dashboard.projects.status.pending" : project.status === "in_progress" ? "dashboard.projects.status.active" : project.status === "completed" ? "dashboard.projects.status.completed" : project.status === "cancelled" ? "dashboard.projects.status.cancelled" : cfg.label)}
          </span>
        </div>
        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{project.description}</p>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.04]">
          <span className="text-[10px] text-zinc-600">
            {new Date(project.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
          <span className="text-[10px] font-semibold text-zinc-500 group-hover:text-[#00AEEF] transition-colors flex items-center gap-1">
            {t("common.viewAll")} <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
