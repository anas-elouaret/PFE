import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "../../context/NotificationContext";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ICONS = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const COLORS = {
  success: "border-[#00AEEF]/30 bg-[#00AEEF]/10 text-[#00AEEF]",
  error: "border-red-500/30 bg-red-500/10 text-red-400",
  info: "border-[#00AEEF]/30 bg-[#00AEEF]/10 text-[#00AEEF]",
};

export default function ToastContainer() {
  const { toasts, dismissToast } = useNotifications();

  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => {
          const Icon = ICONS[toast.type] || Info;
          const colorClass = COLORS[toast.type] || COLORS.info;
          return (
            <motion.div key={toast.id} layout initial={{ opacity: 0, x: 80, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 80, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className={`pointer-events-auto rounded-2xl border px-5 py-4 backdrop-blur-xl shadow-2xl flex items-start gap-3 ${colorClass}`}
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))" }}>
              <Icon className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium flex-1">{toast.message}</p>
              <button onClick={() => dismissToast(toast.id)} className="shrink-0 opacity-50 hover:opacity-100 transition-opacity">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
