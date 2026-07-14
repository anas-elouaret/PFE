import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useProjects } from "../../context/ProjectContext";
import { FolderOpen, Plus, ArrowUpRight, Clock, CheckCircle2, AlertCircle, XCircle, Search } from "lucide-react";

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-200", icon: Clock },
  in_progress: { label: "In Progress", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200", icon: AlertCircle },
  completed: { label: "Completed", color: "text-green-600", bg: "bg-green-50", border: "border-green-200", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-red-600", bg: "bg-red-50", border: "border-red-200", icon: XCircle },
};

export default function DashboardProjectsPage() {
  const { projects, loading } = useProjects();
  const FILTERS = [
    { key: "all", label: "Voir tout" },
    { key: "pending", label: "En Attente" },
    { key: "in_progress", label: "Actif" },
    { key: "completed", label: "Terminé" },
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
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Mes Projets</h1>
          <p className="text-sm text-slate-500 mt-1">Gérez vos projets</p>
        </div>
        <Link to="/start-project"
          className="inline-flex items-center gap-2 bg-orange-500 border-2 border-orange-500 px-5 py-3 text-xs font-bold text-white hover:bg-orange-600 transition-all">
          <Plus className="w-3.5 h-3.5" /> Nouveau Projet
        </Link>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher"
            className="w-full bg-slate-50 border-2 border-black px-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-orange-500 transition-all" />
        </div>
        <div className="flex gap-0 border-2 border-black w-fit">
          {FILTERS.map(tab => (
            <button key={tab.key} onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 text-xs font-bold transition-all border-2 border-black ${
                filter === tab.key ? "bg-orange-500 text-white border-orange-500" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 bg-white"
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
            <div key={i} className="bg-slate-50 border-2 border-black p-5 animate-pulse">
              <div className="h-4 w-32 bg-slate-200 mb-3" />
              <div className="h-3 w-full bg-slate-200 mb-2" />
              <div className="h-3 w-2/3 bg-slate-200" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <FolderOpen className="w-12 h-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">{search || filter !== "all" ? "Rechercher" : "Pas encore de projets"}</h3>
          <p className="text-sm text-slate-500 mb-6">{search || filter !== "all" ? "Filtrer" : "Commencez par créer un nouveau projet"}</p>
          {!search && filter === "all" && (
            <Link to="/start-project" className="inline-flex items-center gap-2 bg-orange-500 border-2 border-orange-500 px-5 py-3 text-xs font-bold text-white">
              <Plus className="w-3.5 h-3.5" /> Nouveau Projet
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
                    className="group relative overflow-hidden bg-slate-50 border-2 border-black p-5 hover:border-orange-500 transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-slate-900 truncate">{project.serviceTitle || project.projectType}</h3>
                        <p className="text-xs text-slate-500 mt-0.5">{project.id}</p>
                      </div>
                      <span className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold ${cfg.bg} ${cfg.color} border-2 ${cfg.border} ml-2`}>
                        <Icon className="w-3 h-3" /> {project.status === "pending" ? "En Attente" : project.status === "in_progress" ? "Actif" : project.status === "completed" ? "Terminé" : project.status === "cancelled" ? "Annulé" : cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{project.description}</p>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t-2 border-slate-200">
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {new Date(project.createdAt).toLocaleDateString("fr-FR", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 group-hover:text-orange-500 transition-colors flex items-center gap-1">
                        Voir tout <ArrowUpRight className="w-3 h-3" />
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
