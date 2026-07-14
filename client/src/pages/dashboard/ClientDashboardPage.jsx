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
  pending: { label: "Pending Review", color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-500/20", icon: Clock },
  in_progress: { label: "In Progress", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-600/20", icon: AlertCircle },
  completed: { label: "Completed", color: "text-green-600", bg: "bg-green-50", border: "border-green-600/20", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-red-600", bg: "bg-red-50", border: "border-red-600/20", icon: XCircle },
};

function SkeletonCard() {
  return (
    <div className="bg-slate-100 border-2 border-black p-5 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-200 rounded" />
          <div className="h-3 w-20 bg-slate-200 rounded" />
        </div>
        <div className="h-6 w-16 bg-slate-200 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full bg-slate-200 rounded" />
        <div className="h-3 w-3/4 bg-slate-200 rounded" />
      </div>
      <div className="flex gap-2 mt-4">
        <div className="h-8 w-24 bg-slate-200 rounded" />
        <div className="h-8 w-24 bg-slate-200 rounded" />
      </div>
    </div>
  );
}

function EmptyState({ onCreate }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className="col-span-full flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 bg-slate-100 border-2 border-black flex items-center justify-center mb-6">
        <FolderOpen className="w-8 h-8 text-slate-500" />
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-2">Pas encore de projets</h3>
      <p className="text-slate-500 max-w-sm mb-8">Commencez par créer un nouveau projet</p>
      <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={onCreate}
        className="inline-flex items-center gap-2 bg-orange-500 border-2 border-orange-500 px-6 py-3.5 text-sm font-black text-white hover:bg-orange-600">
        <Plus className="w-4 h-4" />
        Nouveau Projet
      </motion.button>
    </motion.div>
  );
}

export default function ClientDashboardPage() {
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
    <div className="min-h-screen bg-white">
      <header className="border-b-2 border-black bg-white sticky top-0 z-50">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center bg-orange-500 text-xs font-black text-white">
              {initial}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{user?.name || "Tableau de Bord Client"}</p>
              <p className="text-[10px] tracking-wider text-slate-500 uppercase">Tableau de Bord Client</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/start-project"
              className="bg-orange-500 border-2 border-orange-500 px-4 py-2 text-xs font-bold text-white hover:bg-orange-600 transition-all">
              Nouveau Projet
            </Link>
            <button onClick={handleLogout}
              className="flex items-center gap-2 border-2 border-black bg-white px-4 py-2 text-xs font-semibold text-slate-900 transition-all hover:bg-slate-100">
              <LogOut className="h-3.5 w-3.5" />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="mb-8">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            {`Bon retour, ${user?.name?.split(" ")[0] || "Client"}`}
          </h1>
          <p className="text-sm text-slate-600">Consultez vos projets et suivez leur avancement</p>
        </motion.div>

        {/* Stats */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={1}
          className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {[
            { label: "Projets Actifs", value: stats.total },
            { label: "En Attente", value: stats.pending },
            { label: "Actif", value: stats.inProgress },
            { label: "Terminé", value: stats.completed },
          ].map((stat, i) => (
            <motion.div key={stat.label} variants={fadeUp} custom={i + 2}
              className="bg-slate-50 border-2 border-black p-5 transition-all duration-300 hover:bg-slate-100">
              <p className="text-[11px] font-semibold tracking-[0.12em] text-slate-500 uppercase">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Filter Tabs */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={3}
          className="mb-6 flex gap-1.5 p-1 bg-slate-50 border-2 border-black w-fit">
          {[
            { key: "all", label: "Voir Tout" },
            { key: "pending", label: "En Attente" },
            { key: "in_progress", label: "Actif" },
            { key: "completed", label: "Terminé" },
          ].map(tab => (
            <button key={tab.key} onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 text-xs font-bold transition-all ${
                filter === tab.key
                  ? "bg-orange-500 text-white"
                  : "text-slate-500 hover:text-slate-900"
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
  const cfg = STATUS_CONFIG[project.status] || STATUS_CONFIG.pending;
  const StatusIcon = cfg.icon;

  return (
    <Link to={`/client/dashboard/${project.id}`} className="block">
      <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        transition={{ delay: index * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="bg-slate-50 border-2 border-black p-5 transition-all hover:bg-slate-100 cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-slate-900 truncate">{project.serviceTitle || project.projectType}</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">{project.id}</p>
          </div>
          <span className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold ${cfg.bg} ${cfg.color} ${cfg.border} border ml-2`}>
            <StatusIcon className="w-3 h-3" />
            {(project.status === "pending" ? "En Attente" : project.status === "in_progress" ? "Actif" : project.status === "completed" ? "Terminé" : project.status === "cancelled" ? "Annulé" : cfg.label)}
          </span>
        </div>
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{project.description}</p>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200">
          <span className="text-[10px] text-slate-500">
            {new Date(project.createdAt).toLocaleDateString("fr-FR", { month: "short", day: "numeric", year: "numeric" })}
          </span>
          <span className="text-[10px] font-semibold text-orange-500 flex items-center gap-1">
            Voir tout <ArrowUpRight className="w-3 h-3" />
          </span>
        </div>
      </motion.div>
    </Link>
  );
}
