import { useTranslation } from "react-i18next";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useProjects } from "../../context/ProjectContext";
import { getDashboardStats, getAnalytics } from "../../api/admin";
import { TrendingUp, Users, FolderKanban, Activity, BarChart3, PieChart } from "lucide-react";

export default function AdminAnalyticsPage() {
  const { t } = useTranslation();
  const { projects } = useProjects();
  const [stats, setStats] = useState({ totalUsers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getDashboardStats().catch(() => ({ stats: { totalUsers: 0 } })),
    ]).then(([data]) => {
      if (data?.stats) setStats(data.stats);
    }).finally(() => setLoading(false));
  }, []);

  const statusBreakdown = useMemo(() => ({
    pending: projects.filter(p => p.status === "pending").length,
    inProgress: projects.filter(p => p.status === "in_progress").length,
    completed: projects.filter(p => p.status === "completed").length,
  }), [projects]);

  const monthlyData = useMemo(() => {
    const months = {};
    projects.forEach(p => {
      const m = new Date(p.createdAt).toLocaleString("en-US", { month: "short", year: "numeric" });
      months[m] = (months[m] || 0) + 1;
    });
    return Object.entries(months).slice(-6);
  }, [projects]);

  return (
    <div className="max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-black text-white tracking-tight">{t("admin.analytics.title")}</h1>
        <p className="text-sm text-zinc-500 mt-1">{t("admin.analytics.subtitle")}</p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="rounded-2xl border border-white/[0.06] p-6"
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}>
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-4 h-4 text-zinc-400" />
            <h2 className="text-sm font-bold text-white/80">{t("admin.analytics.statusDistribution")}</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: t("admin.analytics.pending"), value: statusBreakdown.pending, color: "bg-[#00AEEF]", percent: projects.length ? (statusBreakdown.pending / projects.length) * 100 : 0 },
              { label: t("admin.analytics.inProgress"), value: statusBreakdown.inProgress, color: "bg-blue-400", percent: projects.length ? (statusBreakdown.inProgress / projects.length) * 100 : 0 },
              { label: t("admin.analytics.completed"), value: statusBreakdown.completed, color: "bg-[#00AEEF]", percent: projects.length ? (statusBreakdown.completed / projects.length) * 100 : 0 },
            ].map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-zinc-300">{item.label}</span>
                  <span className="text-white font-bold">{item.value}</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${item.percent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${item.color}`} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl border border-white/[0.06] p-6"
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}>
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-4 h-4 text-zinc-400" />
            <h2 className="text-sm font-bold text-white/80">{t("admin.analytics.monthlyProjects")}</h2>
          </div>
          {monthlyData.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <TrendingUp className="w-8 h-8 text-zinc-600 mb-2" />
              <p className="text-sm text-zinc-400">{t("admin.analytics.noData")}</p>
            </div>
          ) : (
            <div className="flex items-end gap-3 h-40">
              {monthlyData.map(([month, count]) => {
                const max = Math.max(...monthlyData.map(([, c]) => c));
                const height = max ? (count / max) * 100 : 0;
                return (
                  <div key={month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-xs font-bold text-white">{count}</span>
                    <motion.div initial={{ height: 0 }} animate={{ height: `${height}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="w-full rounded-lg bg-gradient-to-t from-[#00AEEF]/50 to-[#0095D4] max-h-full"
                      style={{ minHeight: count > 0 ? 8 : 0 }} />
                    <span className="text-[10px] text-zinc-500">{month.split(" ")[0]}</span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: t("admin.analytics.totalRevenue"), value: loading ? "..." : `${(stats.totalRevenue || 0).toLocaleString()} MAD`, icon: TrendingUp, accent: "from-[#00AEEF]" },
          { label: t("admin.analytics.activeUsers"), value: loading ? "..." : (stats.totalUsers || 0).toString(), icon: Users, accent: "from-blue-400" },
          { label: t("admin.analytics.conversionRate"), value: projects.length > 0 ? `${Math.round((statusBreakdown.completed / projects.length) * 100)}%` : "0%", icon: Activity, accent: "from-[#00AEEF]" },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl border border-white/[0.06] p-5"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}>
            <div className="flex items-center gap-2 mb-3">
              <s.icon className={`w-4 h-4 ${s.accent} text-zinc-400`} />
              <p className="text-[11px] font-semibold tracking-[0.12em] text-zinc-500 uppercase">{s.label}</p>
            </div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
