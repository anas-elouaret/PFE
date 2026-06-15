import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useProjects } from "../../context/ProjectContext";
import { getDashboardStats } from "../../api/admin";
import { FolderKanban, Users, Clock, CheckCircle2, AlertCircle, TrendingUp, Activity } from "lucide-react";

export default function AdminDashboardPage() {
  const { t } = useTranslation();
  const { projects, loading: projectsLoading } = useProjects();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then((data) => setStats(data.stats))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: t("admin.stats.totalProjects"), value: stats?.totalProjects ?? projects.length, icon: FolderKanban, accent: "from-[#00AEEF] to-[#0095D4]" },
    { label: t("admin.stats.activeClients"), value: stats?.totalUsers ?? 0, icon: Users, accent: "from-blue-400 to-indigo-500" },
    { label: t("admin.stats.inProgress"), value: projects.filter(p => p.status === "in_progress").length, icon: Activity, accent: "from-[#00AEEF] to-[#0095D4]" },
    { label: t("admin.stats.completed"), value: projects.filter(p => p.status === "completed").length, icon: CheckCircle2, accent: "from-[#00AEEF] to-[#33C8FF]" },
  ];

  const pendingProjects = projects.filter(p => p.status === "pending");

  return (
    <div className="max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">{t("admin.dashboard.title")}</h1>
        <p className="text-zinc-500 mt-1">{t("admin.dashboard.subtitle")}</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.06] p-5 card-glow-breath"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}>
            <div className={`absolute inset-0 bg-gradient-to-br ${s.accent} opacity-0 group-hover:opacity-[0.04] transition-opacity`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-semibold tracking-[0.12em] text-zinc-500 uppercase">{s.label}</p>
                <s.icon className="w-4 h-4 text-zinc-500" />
              </div>
              {loading || projectsLoading ? (
                <div className="h-8 w-16 bg-white/5 rounded animate-pulse" />
              ) : (
                <p className="text-3xl font-bold tracking-tight text-white">{s.value}</p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/[0.06] p-6"
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white/80">{t("admin.dashboard.pendingReviews")}</h2>
            <span className="text-xs px-2 py-1 rounded-full bg-[#00AEEF]/10 text-[#00AEEF] font-bold">{pendingProjects.length}</span>
          </div>
          {pendingProjects.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <CheckCircle2 className="w-8 h-8 text-zinc-600 mb-2" />
              <p className="text-sm text-zinc-400">{t("admin.dashboard.allCaughtUp")}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {pendingProjects.slice(0, 5).map(p => (
                <Link key={p._id || p.id} to={`/client/dashboard/${p._id || p.id}`}
                  className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3 hover:bg-white/[0.04] transition-all">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">{p.serviceTitle || p.projectType}</p>
                    <p className="text-xs text-zinc-500">{p.clientName} &middot; {p._id || p.id}</p>
                  </div>
                  <span className="text-[10px] font-semibold text-[#00AEEF] shrink-0">{t("admin.dashboard.review")}</span>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="rounded-2xl border border-white/[0.06] p-6"
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}>
          <h2 className="text-sm font-bold text-white/80 mb-4">{t("admin.dashboard.quickActions")}</h2>
          <div className="space-y-3">
            {[
              { label: t("admin.dashboard.viewAllProjects"), path: "/admin/projects", desc: t("admin.dashboard.viewAllProjectsDesc") },
              { label: t("admin.dashboard.analytics"), path: "/admin/analytics", desc: t("admin.dashboard.analyticsDesc") },
            ].map(action => (
              <Link key={action.path} to={action.path}
                className="flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] px-4 py-3.5 hover:bg-white/[0.04] transition-all group">
                <div>
                  <p className="text-sm font-medium text-white">{action.label}</p>
                  <p className="text-xs text-zinc-500">{action.desc}</p>
                </div>
                <TrendingUp className="w-4 h-4 text-zinc-500 group-hover:text-[#00AEEF] transition-colors" />
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
