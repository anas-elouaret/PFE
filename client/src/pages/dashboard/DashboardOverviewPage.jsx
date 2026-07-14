import { useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useProjects } from "../../context/ProjectContext";
import { useAuth } from "../../context/AuthContext";
import { FolderOpen, Clock, CheckCircle2, AlertCircle, ArrowUpRight, Plus, Bell, ArrowRight } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "text-orange-500", bg: "bg-orange-50", icon: Clock },
  in_progress: { label: "In Progress", color: "text-blue-600", bg: "bg-blue-50", icon: AlertCircle },
  completed: { label: "Completed", color: "text-orange-500", bg: "bg-orange-50", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-red-500", bg: "bg-red-50", icon: AlertCircle },
};

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const { projects, loading } = useProjects();

  const stats = useMemo(
    () => ({
      total: projects.length,
      pending: projects.filter((p) => p.status === "pending").length,
      inProgress: projects.filter((p) => p.status === "in_progress").length,
      completed: projects.filter((p) => p.status === "completed").length,
    }),
    [projects]
  );

  const recentProjects = useMemo(() => projects.slice(0, 5), [projects]);

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6">
      {/* Header */}
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Aperçu
        </h1>
        <p className="mt-1 text-slate-600">
          Bon retour, {user?.name?.split(" ")[0] || "Client"}
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        custom={1}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
      >
        {[
          {
            label: "Projets Actifs",
            value: stats.total,
            icon: FolderOpen,
          },
          {
            label: "En Attente",
            value: stats.pending,
            icon: Clock,
          },
          {
            label: "Tâches en Attente",
            value: stats.inProgress,
            icon: AlertCircle,
          },
          {
            label: "Projets Terminés",
            value: stats.completed,
            icon: CheckCircle2,
          },
        ].map((s, i) => (
          <div
            key={s.label}
            className="bg-slate-50 border-2 border-black p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <s.icon className="w-5 h-5 text-slate-400" />
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                {s.label}
              </p>
            </div>
            <p className="text-3xl font-black tracking-tight text-slate-900">{s.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Recent Projects */}
      <motion.div
        custom={2}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="border-2 border-black p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-bold text-slate-900">
            Activité Récente
          </h2>
          <Link
            to="/client/dashboard/projects"
            className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors"
          >
            Voir Tout
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-14 bg-slate-100 animate-pulse"
              />
            ))}
          </div>
        ) : recentProjects.length === 0 ? (
          <div className="flex flex-col items-center py-12 text-center">
            <FolderOpen className="w-10 h-10 text-slate-300 mb-3" />
            <p className="text-sm font-medium text-slate-500 mb-4">
              Pas encore de projets
            </p>
            <Link
              to="/get-started"
              className="inline-flex items-center gap-2 bg-orange-500 border-2 border-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Nouveau Projet
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {recentProjects.map((p) => {
              const cfg = STATUS_CONFIG[p.status] || STATUS_CONFIG.pending;
              return (
                <Link
                  key={p.id}
                  to={`/client/dashboard/${p.id}`}
                  className="flex items-center justify-between bg-slate-50 border-2 border-black px-4 py-3 hover:bg-slate-100 transition-all group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {p.serviceTitle || p.projectType}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {p.id} &middot;{" "}
                      {new Date(p.createdAt).toLocaleDateString("fr-FR", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold ${cfg.bg} ${cfg.color}`}
                    >
                      <cfg.icon className="w-3 h-3" />
                      {p.status === "pending" ? "En Attente" : p.status === "in_progress" ? "Actif" : p.status === "completed" ? "Terminé" : p.status === "cancelled" ? "Annulé" : cfg.label}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-orange-500 transition-all" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        custom={3}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <Link
          to="/get-started"
          className="bg-orange-50 border-2 border-black p-6 hover:bg-orange-100 transition-all group"
        >
          <Plus className="w-5 h-5 text-orange-500 mb-2" />
          <p className="text-sm font-bold text-slate-900">
            Nouveau Projet
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Commencez par créer un nouveau projet
          </p>
        </Link>
        <Link
          to="/client/dashboard/projects"
          className="bg-slate-50 border-2 border-black p-6 hover:bg-slate-100 transition-all group"
        >
          <FolderOpen className="w-5 h-5 text-slate-400 mb-2" />
          <p className="text-sm font-bold text-slate-900">
            Voir tout
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Gérez vos paiements et vos factures ici
          </p>
        </Link>
        <Link
          to="/client/dashboard/billing"
          className="bg-slate-50 border-2 border-black p-6 hover:bg-slate-100 transition-all group"
        >
          <Bell className="w-5 h-5 text-slate-400 mb-2" />
          <p className="text-sm font-bold text-slate-900">
            Facturation
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Gérez vos paiements et vos factures ici
          </p>
        </Link>
      </motion.div>
    </div>
  );
}
