import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProjects } from "../../context/ProjectContext";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft, Clock, CheckCircle2, AlertCircle, XCircle, ChevronDown } from "lucide-react";

const STATUS_CONFIG = {
  pending: { label: "Pending Review", color: "text-[#00AEEF]", bg: "bg-[#00AEEF]/10", border: "border-[#00AEEF]/20", icon: Clock },
  in_progress: { label: "In Progress", color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", icon: AlertCircle },
  completed: { label: "Completed", color: "text-[#00AEEF]", bg: "bg-[#00AEEF]/10", border: "border-[#00AEEF]/20", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20", icon: XCircle },
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
      <div className="h-4 w-24 bg-white/5 rounded mb-8" />
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/[0.06] p-6">
            <div className="h-6 w-48 bg-white/5 rounded mb-4" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-white/5 rounded" />
              <div className="h-3 w-3/4 bg-white/5 rounded" />
              <div className="h-3 w-1/2 bg-white/5 rounded" />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/[0.06] p-6">
          <div className="h-5 w-32 bg-white/5 rounded mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex gap-3">
                <div className="w-3 h-3 rounded-full bg-white/5 mt-0.5" />
                <div className="flex-1">
                  <div className="h-3 w-32 bg-white/5 rounded mb-1" />
                  <div className="h-2 w-20 bg-white/5 rounded" />
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
  const { t } = useTranslation();
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
        <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-8 h-8 text-zinc-500" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">{t("error.notFound")}</h2>
        <p className="text-zinc-500 mb-8">{t("error.general")}</p>
        <Link to="/client/dashboard"
          className="inline-flex items-center gap-2 rounded-2xl bg-[#00AEEF] px-6 py-3.5 text-sm font-black text-[#000000] shadow-xl shadow-[#00AEEF]/20">
          {t("common.back")}
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
      await updateStatus(project.id, newStatus, statusNote || t("common.loading"));
      setStatusNote("");
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#04050C]">
      <header className="border-b border-white/[0.04] bg-white/[0.01] backdrop-blur-xl sticky top-0 z-50">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/client/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            {t("common.back")}
          </Link>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
              <StatusIcon className="w-3 h-3" />
              {t(project.status === "pending" ? "dashboard.projects.status.pending" : project.status === "in_progress" ? "dashboard.projects.status.active" : project.status === "completed" ? "dashboard.projects.status.completed" : project.status === "cancelled" ? "dashboard.projects.status.cancelled" : cfg.label)}
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          {/* Main Content */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-white/[0.06] p-6"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}>
              <h1 className="text-2xl font-black text-white tracking-tight mb-1">{project.serviceTitle || project.projectType}</h1>
              <p className="text-xs text-zinc-500 mb-6">{t("common.search")}: {project.id}</p>

              <div className="grid gap-4 sm:grid-cols-2">
                <InfoRow label={t("contact.name")} value={project.clientName} />
                <InfoRow label={t("contact.emailLabel")} value={project.email} />
                <InfoRow label={t("services")} value={project.projectType} />
                <InfoRow label={t("getStarted.budgetRange")} value={project.urgencyLevel} />
                <InfoRow label={t("getStarted.budgetRange")} value={project.budgetRange || t("common.loading")} />
                <InfoRow label={t("getStarted.submit")} value={new Date(project.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="rounded-2xl border border-white/[0.06] p-6"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}>
              <h2 className="text-sm font-bold text-white/80 mb-3">{t("getStarted.projectBrief")}</h2>
              <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{project.description}</p>
            </motion.div>

            {/* Status Actions */}
            {allowedTransitions.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="rounded-2xl border border-white/[0.06] p-6"
                style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}>
                <h2 className="text-sm font-bold text-white/80 mb-4">{t("common.loading")}</h2>
                <div className="relative">
                  <button onClick={() => setShowStatusMenu(!showStatusMenu)}
                    className="w-full flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300 hover:text-white transition-colors">
                    <span>{statusNote || t("common.search")}</span>
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                  </button>
                  <AnimatePresence>
                    {showStatusMenu && (
                      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                        className="absolute bottom-full mb-2 left-0 right-0 rounded-xl border border-white/[0.06] bg-[#0a0a0f] shadow-2xl overflow-hidden z-10">
                        {allowedTransitions.map(statusKey => {
                          const sc = STATUS_CONFIG[statusKey];
                          return (
                            <button key={statusKey} onClick={() => handleStatusUpdate(statusKey)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-white/[0.04] transition-colors">
                              <sc.icon className={`w-4 h-4 ${sc.color}`} />
                              <span className="text-zinc-300 font-medium">{t(statusKey === "pending" ? "dashboard.projects.status.pending" : statusKey === "in_progress" ? "dashboard.projects.status.active" : statusKey === "completed" ? "dashboard.projects.status.completed" : statusKey === "cancelled" ? "dashboard.projects.status.cancelled" : sc.label)}</span>
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
                      className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
                      <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                      {t("common.loading")}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="rounded-2xl border border-white/[0.06] p-6"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}>
              <h2 className="text-sm font-bold text-white/80 mb-4">{t("dashboard.overview.recentActivity")}</h2>
              <div className="relative">
                {project.statusHistory.length > 0 ? (
                  <div className="space-y-0">
                    {[...project.statusHistory].reverse().map((entry, i) => {
                      const sc = STATUS_CONFIG[entry.status] || STATUS_CONFIG.pending;
                      const isLatest = i === 0;
                      return (
                        <div key={i} className="relative flex gap-4 pb-5 last:pb-0">
                          {i < project.statusHistory.length - 1 && (
                            <div className="absolute left-[5.5px] top-4 bottom-0 w-px bg-white/[0.06]" />
                          )}
                          <div className={`relative shrink-0 w-3 h-3 rounded-full mt-1 ${isLatest ? "ring-2 ring-[#00AEEF]/30" : ""}`}
                            style={{ backgroundColor: sc.color.replace("text-", "") }} />
                          <div className="min-w-0 flex-1">
                            <p className={`text-xs font-semibold ${isLatest ? "text-white" : "text-zinc-400"}`}>{t(entry.status === "pending" ? "dashboard.projects.status.pending" : entry.status === "in_progress" ? "dashboard.projects.status.active" : entry.status === "completed" ? "dashboard.projects.status.completed" : entry.status === "cancelled" ? "dashboard.projects.status.cancelled" : sc.label)}</p>
                            <p className="text-[10px] text-zinc-600 mt-0.5">
                              {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </p>
                            {entry.note && (
                              <p className="text-[11px] text-zinc-500 mt-0.5">{entry.note}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500">{t("common.loading")}</p>
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
              className="rounded-2xl border border-white/[0.06] p-6"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}>
              <h2 className="text-sm font-bold text-white/80 mb-4">{t("dashboard.overview.viewAll")}</h2>
              <div className="space-y-2">
                <Link to="/start-project"
                  className="flex items-center gap-2 rounded-xl bg-[#00AEEF] px-4 py-3 text-xs font-bold text-[#000000] justify-center hover:bg-[#0095D4] transition-all shadow-lg shadow-[#00AEEF]/20">
                  {t("dashboard.projects.newProject")}
                </Link>
                <Link to="/client/dashboard"
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs font-semibold text-zinc-300 justify-center hover:bg-white/[0.06] transition-all">
                  {t("dashboard.overview.viewAll")}
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
      <p className="text-[10px] font-semibold tracking-wider text-zinc-500 uppercase">{label}</p>
      <p className="text-sm font-medium text-white mt-0.5">{value}</p>
    </div>
  );
}
