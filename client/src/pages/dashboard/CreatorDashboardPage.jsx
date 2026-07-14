import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { getMyProjects } from "../../api/projects";
import { FolderOpen, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function CreatorDashboardPage() {
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
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8 bg-white">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-black text-slate-900">Tableau de Bord Créateur</h1>
        <p className="mt-3 text-slate-600">Gérez vos projets et suivez votre progression</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Projects", value: stats.total, icon: FolderOpen },
          { label: "Pending", value: stats.pending, icon: Clock },
          { label: "In Progress", value: stats.inProgress, icon: AlertCircle },
          { label: "Completed", value: stats.completed, icon: CheckCircle2 },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="bg-slate-50 border-2 border-black p-5">
            <div className="flex items-center gap-2 mb-3">
              <s.icon className="w-4 h-4 text-slate-500" />
              <p className="text-[11px] font-bold tracking-[0.12em] text-slate-500 uppercase">{s.label}</p>
            </div>
            {loading ? (
              <div className="h-8 w-16 bg-slate-100 animate-pulse mt-2" />
            ) : (
              <p className="text-3xl font-black tracking-tight text-slate-900">{s.value}</p>
            )}
          </motion.div>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-slate-100 border-2 border-black animate-pulse" />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center border-2 border-black bg-slate-50">
          <FolderOpen className="w-12 h-12 text-slate-500 mb-4" />
          <p className="text-lg font-black text-slate-900 mb-2">No projects assigned yet</p>
          <p className="text-sm text-slate-500">Projects will appear here once clients submit them.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-slate-50 border-2 border-black p-5 transition-all duration-300 hover:bg-slate-100">
              <div className="flex items-start justify-between mb-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-slate-900 truncate">{project.serviceTitle || project.projectType}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{project.clientName} &middot; {project.id?.slice(-8)}</p>
                </div>
                <span className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold ${
                  project.status === "pending" ? "bg-orange-50 text-orange-500" :
                  project.status === "in_progress" ? "bg-blue-50 text-blue-600" :
                  project.status === "completed" ? "bg-green-50 text-green-600" :
                  "bg-red-50 text-red-600"
                }`}>
                  {project.status}
                </span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">{project.description}</p>
              <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between">
                <span className="text-[10px] text-slate-500">
                  {new Date(project.createdAt).toLocaleDateString("fr-FR", { month: "short", day: "numeric" })}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
