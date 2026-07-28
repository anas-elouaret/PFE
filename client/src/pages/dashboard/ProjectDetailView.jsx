import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProjects } from "../../context/ProjectContext";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, XCircle, ChevronDown } from "lucide-react";

const STATUS_CONFIG = {
  pending: { label: "Pending Review", color: "text-orange-500", bg: "bg-orange-50", border: "border-orange-500/30", icon: Clock },
  in_progress: { label: "In Progress", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-600/30", icon: AlertCircle },
  completed: { label: "Completed", color: "text-green-600", bg: "bg-green-50", border: "border-green-600/30", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-red-600", bg: "bg-red-50", border: "border-red-600/30", icon: XCircle },
};

const STATUS_TRANSITIONS = {
  pending: ["in_progress", "cancelled"],
  in_progress: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

function SkeletonDetail() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
      <div className="h-4 w-24 bg-slate-100 mb-8" />
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="bg-slate-50 border-2 border-black p-6">
            <div className="h-6 w-48 bg-slate-100 mb-4" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-slate-100" />
              <div className="h-3 w-3/4 bg-slate-100" />
              <div className="h-3 w-1/2 bg-slate-100" />
            </div>
          </div>
        </div>
        <div className="bg-slate-50 border-2 border-black p-6">
          <div className="h-5 w-32 bg-slate-100 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex gap-3">
                <div className="w-3 h-3 bg-slate-100 mt-0.5" />
                <div className="flex-1">
                  <div className="h-3 w-32 bg-slate-100 mb-1" />
                  <div className="h-2 w-20 bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, loading, updateStatus } = useProjects();
  const { user } = useAuth();
  const [updating, setUpdating] = useState(false);
  const [statusNote, setStatusNote] = useState("");
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const project = useMemo(() => projects.find(p => p.id === id), [projects, id]);

  if (loading) return <SkeletonDetail />;

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center">
        <div className="w-20 h-20 bg-slate-100 border-2 border-black flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Projet introuvable</h2>
        <p className="text-slate-500 mb-8">Une erreur est survenue. Veuillez réessayer.</p>
        <Link to="/client/dashboard"
          className="inline-flex items-center gap-2 bg-orange-500 border-2 border-orange-500 px-6 py-3.5 text-sm font-black text-white hover:bg-orange-600 transition-colors">
          Retour
        </Link>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[project.status] || STATUS_CONFIG.pending;
  const StatusIcon = cfg.icon;
  const allowedTransitions = STATUS_TRANSITIONS[project.status] || [];

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    setShowStatusMenu(false);
    try {
      await updateStatus(project.id, newStatus, statusNote || "Chargement...");
      setStatusNote("");
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b-2 border-black bg-white sticky top-0 z-50">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/client/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Retour
          </Link>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold ${cfg.bg} ${cfg.color} border-2 border-black`}>
              <StatusIcon className="w-3 h-3" />
              {(project.status === "pending" ? "En Attente" : project.status === "in_progress" ? "Actif" : project.status === "completed" ? "Terminé" : project.status === "cancelled" ? "Annulé" : cfg.label)}
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          {/* Main Content */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              className="bg-slate-50 border-2 border-black p-6 transition-all duration-300">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{project.serviceTitle || project.projectType}</h1>
              <p className="text-xs text-slate-500 mb-6">Rechercher: {project.id}</p>

              <div className="grid gap-4 sm:grid-cols-2">
                <InfoRow label="Nom" value={project.clientName} />
                <InfoRow label="Adresse Email" value={project.email} />
                <InfoRow label="Services" value={project.projectType} />
                <InfoRow label="Budget" value={project.urgencyLevel} />
                <InfoRow label="Budget" value={project.budgetRange || "Chargement..."} />
                <InfoRow label="Soumettre le Projet" value={new Date(project.createdAt).toLocaleDateString("fr-FR", { month: "long", day: "numeric", year: "numeric" })} />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-slate-50 border-2 border-black p-6 transition-all duration-300">
              <h2 className="text-sm font-bold text-slate-500 mb-3">Brief du Projet</h2>
              <p className="text-sm text-slate-900 leading-relaxed whitespace-pre-wrap">{project.description}</p>
            </motion.div>

            {/* Status Actions */}
            {allowedTransitions.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="bg-slate-50 border-2 border-black p-6 transition-all duration-300">
                <h2 className="text-sm font-bold text-slate-500 mb-4">Chargement...</h2>
                <div className="relative">
                  <button onClick={() => setShowStatusMenu(!showStatusMenu)}
                    className="w-full flex items-center justify-between border-2 border-black bg-white px-4 py-3 text-sm text-slate-900 hover:bg-slate-100 transition-colors">
                    <span>{statusNote || "Rechercher"}</span>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </button>
                  <AnimatePresence>
                    {showStatusMenu && (
                      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                        className="absolute bottom-full mb-2 left-0 right-0 border-2 border-black bg-white shadow-lg overflow-hidden z-10">
                        {allowedTransitions.map(statusKey => {
                          const sc = STATUS_CONFIG[statusKey];
                          return (
                            <button key={statusKey} onClick={() => handleStatusUpdate(statusKey)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-slate-100 transition-colors border-b border-black last:border-b-0">
                              <sc.icon className={`w-4 h-4 ${sc.color}`} />
                              <span className="text-slate-900 font-medium">{(statusKey === "pending" ? "En Attente" : statusKey === "in_progress" ? "Actif" : statusKey === "completed" ? "Terminé" : statusKey === "cancelled" ? "Annulé" : sc.label)}</span>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <AnimatePresence>
                  {updating && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                      <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                      Chargement...
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="bg-slate-50 border-2 border-black p-6 transition-all duration-300">
              <h2 className="text-sm font-bold text-slate-500 mb-4">Activité Récente</h2>
              <div className="relative">
                {project.statusHistory.length > 0 ? (
                  <div className="space-y-0">
                    {[...project.statusHistory].reverse().map((entry, i) => {
                      const sc = STATUS_CONFIG[entry.status] || STATUS_CONFIG.pending;
                      const isLatest = i === 0;
                      return (
                        <div key={i} className="relative flex gap-4 pb-5 last:pb-0">
                          {i < project.statusHistory.length - 1 && (
                            <div className="absolute left-[5.5px] top-4 bottom-0 w-px bg-slate-200" />
                          )}
                          <div className={`relative shrink-0 w-3 h-3 mt-1 ${isLatest ? "bg-orange-500" : "bg-slate-300"}`} />
                          <div className="min-w-0 flex-1">
                            <p className={`text-xs font-semibold ${isLatest ? "text-slate-900" : "text-slate-600"}`}>{(entry.status === "pending" ? "En Attente" : entry.status === "in_progress" ? "Actif" : entry.status === "completed" ? "Terminé" : entry.status === "cancelled" ? "Annulé" : sc.label)}</p>
                            <p className="text-[10px] text-slate-500 mt-0.5">
                              {new Date(entry.date).toLocaleDateString("fr-FR", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </p>
                            {entry.note && (
                              <p className="text-[11px] text-slate-500 mt-0.5">{entry.note}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">Chargement...</p>
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
              className="bg-slate-50 border-2 border-black p-6 transition-all duration-300">
              <h2 className="text-sm font-bold text-slate-500 mb-4">Voir tout</h2>
              <div className="space-y-2">
                <Link to="/start-project"
                  className="flex items-center gap-2 bg-orange-500 border-2 border-orange-500 px-4 py-3 text-xs font-bold text-white justify-center hover:bg-orange-600 transition-colors">
                  Nouveau Projet
                </Link>
                <Link to="/client/dashboard"
                  className="flex items-center gap-2 border-2 border-black bg-white px-4 py-3 text-xs font-semibold text-slate-900 justify-center hover:bg-slate-100 transition-colors">
                  Voir tout
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">{label}</p>
      <p className="text-sm font-medium text-slate-900 mt-0.5">{value}</p>
    </div>
  );
}
