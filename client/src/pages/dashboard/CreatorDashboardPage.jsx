import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { getMyProjects } from "../../api/projects";
import { FolderOpen, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function CreatorDashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyProjects()
      .then(setProjects)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: projects.length,
    pending: projects.filter(p => p.status === "pending").length,
    inProgress: projects.filter(p => p.status === "in_progress").length,
    completed: projects.filter(p => p.status === "completed").length,
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-black">{t("dashboard.creator.title")}</h1>
        <p className="mt-3 text-zinc-400">{t("dashboard.creator.subtitle")}</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Projects", value: stats.total, accent: "from-zinc-400 to-zinc-600" },
          { label: "Pending", value: stats.pending, accent: "from-[#00AEEF] to-[#0095D4]" },
          { label: "In Progress", value: stats.inProgress, accent: "from-blue-400 to-indigo-500" },
          { label: "Completed", value: stats.completed, accent: "from-[#00AEEF] to-[#33C8FF]" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.06] p-5"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}>
            <div className={`absolute inset-0 bg-gradient-to-br ${s.accent} opacity-0 group-hover:opacity-[0.04] transition-opacity`} />
            <p className="text-[11px] font-semibold tracking-[0.12em] text-zinc-500 uppercase">{s.label}</p>
            {loading ? (
              <div className="h-8 w-16 bg-white/5 rounded animate-pulse mt-2" />
            ) : (
              <p className="mt-2 text-3xl font-bold tracking-tight text-white">{s.value}</p>
            )}
          </motion.div>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-white/[0.03] rounded-2xl animate-pulse" />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <FolderOpen className="w-12 h-12 text-zinc-600 mb-4" />
          <p className="text-lg font-bold text-white mb-2">No projects assigned yet</p>
          <p className="text-sm text-zinc-500">Projects will appear here once clients submit them.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/[0.06] p-5"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}>
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-white truncate">{project.serviceTitle || project.projectType}</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">{project.clientName} &middot; {project.id?.slice(-8)}</p>
                </div>
                <span className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                  project.status === "pending" ? "bg-[#00AEEF]/10 text-[#00AEEF]" :
                  project.status === "in_progress" ? "bg-blue-400/10 text-blue-400" :
                  project.status === "completed" ? "bg-[#00AEEF]/10 text-[#00AEEF]" :
                  "bg-red-400/10 text-red-400"
                }`}>
                  {project.status}
                </span>
              </div>
              <p className="text-xs text-zinc-400 line-clamp-2">{project.description}</p>
              <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between">
                <span className="text-[10px] text-zinc-600">
                  {new Date(project.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
