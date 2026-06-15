import { useTranslation } from "react-i18next";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useProjects } from "../../context/ProjectContext";
import { useNotifications } from "../../context/NotificationContext";
import { Clock, CheckCircle2, AlertCircle, XCircle, Search, ArrowUpRight } from "lucide-react";

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "text-[#00AEEF]", bg: "bg-[#00AEEF]/10", icon: Clock },
  in_progress: { label: "In Progress", color: "text-blue-400", bg: "bg-blue-400/10", icon: AlertCircle },
  completed: { label: "Completed", color: "text-[#00AEEF]", bg: "bg-[#00AEEF]/10", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-red-400", bg: "bg-red-400/10", icon: XCircle },
};

const STATUS_TRANSITIONS = {
  pending: ["in_progress", "cancelled"],
  in_progress: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export default function AdminProjectsPage() {
  const { t } = useTranslation();
  const { projects, loading, updateStatus } = useProjects();
  const { addToast } = useNotifications();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  const filtered = useMemo(() => {
    let result = projects;
    if (filter !== "all") result = result.filter(p => p.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        (p.serviceTitle || "").toLowerCase().includes(q) ||
        p.clientName?.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      );
    }
    return result;
  }, [projects, filter, search]);

  const handleStatusUpdate = async (id, status) => {
    setUpdatingId(id);
    try {
      await updateStatus(id, status, `Admin updated status to ${STATUS_CONFIG[status].label}`);
      addToast(`Project ${id} updated to ${STATUS_CONFIG[status].label}`, "success");
    } catch (err) {
      addToast(err.message || "Failed to update", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">{t("admin.projects.title")}</h1>
          <p className="text-sm text-zinc-500 mt-1">{t("admin.projects.total", { count: projects.length })}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t("admin.projects.searchPlaceholder")}
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-[#00AEEF]/40 transition-all" />
        </div>
        <div className="flex gap-1.5 p-1 rounded-xl bg-white/[0.02] border border-white/[0.06] w-fit">
          {["all", "pending", "in_progress", "completed"].map(tab => (
            <button key={tab} onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${filter === tab ? "bg-white/10 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}>
              {tab === "in_progress" ? t("admin.projects.inProgress") : tab === "pending" ? t("admin.projects.pending") : tab === "completed" ? t("admin.projects.completed") : t("admin.projects.all")}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3, 4].map(i => <div key={i} className="h-16 bg-white/[0.03] rounded-2xl animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <Search className="w-10 h-10 text-zinc-600 mb-3" />
          <p className="text-sm font-medium text-zinc-400">{t("admin.projects.noProjects")}</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/[0.06] overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-zinc-500 text-[11px] font-semibold uppercase tracking-wider">
                  <th className="text-left px-5 py-4">{t("admin.projects.table.project")}</th>
                  <th className="text-left px-5 py-4 hidden sm:table-cell">{t("admin.projects.table.client")}</th>
                  <th className="text-left px-5 py-4">{t("admin.projects.table.status")}</th>
                  <th className="text-left px-5 py-4 hidden md:table-cell">{t("admin.projects.table.date")}</th>
                  <th className="text-right px-5 py-4">{t("admin.projects.table.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map(p => {
                  const cfg = STATUS_CONFIG[p.status] || STATUS_CONFIG.pending;
                  const Icon = cfg.icon;
                  const transitions = STATUS_TRANSITIONS[p.status] || [];
                  return (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-4">
                        <Link to={`/client/dashboard/${p.id}`} className="text-sm font-medium text-white hover:text-[#00AEEF] transition-colors">
                          {p.serviceTitle || p.projectType}
                        </Link>
                        <p className="text-[11px] text-zinc-500">{p.id}</p>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell text-zinc-300">{p.clientName || "—"}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${cfg.bg} ${cfg.color}`}>
                          <Icon className="w-3 h-3" /> {cfg.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell text-zinc-500 text-xs">
                        {new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {transitions.map(statusKey => {
                            const sc = STATUS_CONFIG[statusKey];
                            return (
                              <button key={statusKey} onClick={() => handleStatusUpdate(p.id, statusKey)} disabled={updatingId === p.id}
                                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-all disabled:opacity-50 ${sc.bg} ${sc.color} border-white/[0.06] hover:bg-white/[0.08]`}>
                                {updatingId === p.id ? "..." : sc.label}
                              </button>
                            );
                          })}
                          <Link to={`/client/dashboard/${p.id}`} className="ml-1 p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.05]">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
