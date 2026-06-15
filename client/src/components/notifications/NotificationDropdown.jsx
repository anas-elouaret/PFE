import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "../../context/NotificationContext";
import { Bell, CheckCheck, Trash2, Clock, CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useTranslation } from "react-i18next";

const ICON_MAP = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  project_update: Clock,
  status_change: AlertCircle,
};

const COLOR_MAP = {
  success: "text-[#00AEEF]",
  error: "text-red-400",
  info: "text-blue-400",
  project_update: "text-[#00AEEF]",
  status_change: "text-[#00AEEF]",
};

export default function NotificationDropdown() {
  const { t } = useTranslation();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll, loading } = useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="relative p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/[0.05]">
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-[#00AEEF] text-[9px] font-black text-black flex items-center justify-center shadow-lg shadow-[#00AEEF]/30">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 8, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.15 }}
            className="absolute right-0 top-full w-80 sm:w-96 bg-[#0A0A0F] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <h3 className="text-sm font-bold text-white">{t("notifications.title")}</h3>
              <div className="flex gap-1">
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-all" title={t("notifications.markAllRead")}>
                    <CheckCheck className="w-4 h-4" />
                  </button>
                )}
                {notifications.length > 0 && (
                  <button onClick={clearAll} className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-white/[0.05] transition-all" title={t("notifications.markAllRead")}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 border-2 border-white/10 border-t-[#00AEEF] rounded-full animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-center px-6">
                  <Bell className="w-8 h-8 text-zinc-600 mb-3" />
                  <p className="text-sm font-medium text-zinc-400">{t("notifications.empty")}</p>
                  <p className="text-xs text-zinc-600 mt-1">{t("notifications.empty")}</p>
                </div>
              ) : (
                notifications.slice(0, 20).map(n => {
                  const Icon = ICON_MAP[n.type] || Info;
                  const color = COLOR_MAP[n.type] || "text-zinc-400";
                  return (
                    <div key={n.id} onClick={() => { if (!n.read) markAsRead(n.id); }}
                      className={`flex gap-3 px-5 py-3.5 border-b border-white/[0.03] cursor-pointer transition-colors hover:bg-white/[0.03] ${n.read ? "opacity-60" : ""}`}>
                      <div className={`shrink-0 w-8 h-8 rounded-xl bg-white/[0.04] flex items-center justify-center ${color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm ${n.read ? "text-zinc-400" : "text-white font-medium"}`}>{n.message}</p>
                        {n.detail && <p className="text-xs text-zinc-600 mt-0.5 truncate">{n.detail}</p>}
                        <p className="text-[10px] text-zinc-600 mt-1">
                          {new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      {!n.read && <span className="shrink-0 w-2 h-2 rounded-full bg-[#00AEEF] mt-2" />}
                    </div>
                  );
                })
              )}
            </div>

            {notifications.length > 0 && (
              <button onClick={clearAll} className="w-full py-3 text-xs font-semibold text-zinc-500 hover:text-white hover:bg-white/[0.03] transition-colors border-t border-white/[0.06]">
                {t("notifications.viewAll")}
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
