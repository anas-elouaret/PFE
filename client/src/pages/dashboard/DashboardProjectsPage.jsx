import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useProjects } from "../../context/ProjectContext";
import { FolderOpen, Plus, ArrowUpRight, Clock, CheckCircle2, AlertCircle, XCircle, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "text-[#00AEEF]", bg: "bg-[#00AEEF]/10", border: "border-[#00AEEF]/20", icon: Clock },
  in_progress: { label: "In Progress", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", icon: AlertCircle },
  completed: { label: "Completed", color: "text-[#00AEEF]", bg: "bg-[#00AEEF]/10", border: "border-[#00AEEF]/20", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20", icon: XCircle },
};

export default function DashboardProjectsPage() {
  const { t } = useTranslation();
  const { projects, loading } = useProjects();
  const FILTERS = [
    { key: "all", label: t("dashboard.overview.viewAll") },
    { key: "pending", label: t("dashboard.projects.status.pending") },
    { key: "in_progress", label: t("dashboard.projects.status.active") },
    { key: "completed", label: t("dashboard.projects.status.completed") },
  ];
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = projects;
    if (filter !== "all") result = result.filter(p => p.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        (p.serviceTitle || "").toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [projects, filter, search]);

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">{t("dashboard.projects.title")}</h1>
          <p className="text-sm text-zinc-500 mt-1">{t("dashboard.projects.subtitle")}</p>
        </div>
        <Link to="/start-project"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00AEEF] to-[#0095D4] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-[#00AEEF]/20 hover:shadow-[#00AEEF]/30 transition-all">
          <Plus className="w-3.5 h-3.5" /> {t("dashboard.projects.newProject")}
        </Link>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t("common.search")}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-[#00AEEF]/40 transition-all" />
        </div>
        <div className="flex gap-1.5 p-1 rounded-xl bg-white/[0.02] border border-white/[0.06] w-fit">
          {FILTERS.map(tab => (
            <button key={tab.key} onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filter === tab.key ? "bg-white/10 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="rounded-2xl border border-white/[0.06] p-5 animate-pulse">
              <div className="h-4 w-32 bg-white/5 rounded mb-3" />
              <div className="h-3 w-full bg-white/5 rounded mb-2" />
              <div className="h-3 w-2/3 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <FolderOpen className="w-12 h-12 text-zinc-600 mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">{search || filter !== "all" ? t("common.search") : t("dashboard.projects.noProjects")}</h3>
          <p className="text-sm text-zinc-500 mb-6">{search || filter !== "all" ? t("common.filter") : t("dashboard.projects.noProjectsSub")}</p>
          {!search && filter === "all" && (
            <Link to="/start-project" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00AEEF] to-[#0095D4] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-[#00AEEF]/20">
              <Plus className="w-3.5 h-3.5" /> {t("dashboard.projects.newProject")}
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => {
              const cfg = STATUS_CONFIG[project.status] || STATUS_CONFIG.pending;
              const Icon = cfg.icon;
              return (
                <Link key={project.id} to={`/client/dashboard/${project.id}`}>
                  <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.03, duration: 0.4 }}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.06] p-5 hover:border-[#00AEEF]/30 hover:bg-white/[0.03] transition-all cursor-pointer card-glow-breath"
                    style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-white truncate">{project.serviceTitle || project.projectType}</h3>
                        <p className="text-xs text-zinc-500 mt-0.5">{project.id}</p>
                      </div>
                      <span className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${cfg.bg} ${cfg.color} border ${cfg.border} ml-2`}>
                        <Icon className="w-3 h-3" /> {t(project.status === "pending" ? "dashboard.projects.status.pending" : project.status === "in_progress" ? "dashboard.projects.status.active" : project.status === "completed" ? "dashboard.projects.status.completed" : project.status === "cancelled" ? "dashboard.projects.status.cancelled" : cfg.label)}
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
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
