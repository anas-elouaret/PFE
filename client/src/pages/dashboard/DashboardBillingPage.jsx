import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { getInvoices } from "../../api/payments";
import { CreditCard, Receipt, CheckCircle2, Clock, AlertCircle, Download } from "lucide-react";
import { useTranslation } from "react-i18next";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }) };

export default function DashboardBillingPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInvoices().then(data => { setInvoices(data); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-6xl">
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
        <h1 className="text-2xl font-black text-white tracking-tight">{t("dashboard.billing.title")}</h1>
        <p className="text-sm text-zinc-500 mt-1">{t("dashboard.billing.subtitle")}</p>
      </motion.div>

      {/* Payment Method Card */}
      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
        className="rounded-2xl border border-white/[0.06] p-6 mb-6"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-zinc-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">{t("dashboard.billing.paymentMethod")}</h2>
            <p className="text-xs text-zinc-500">{t("dashboard.billing.noInvoices")}</p>
          </div>
        </div>
        <button className="rounded-xl bg-[#00AEEF] px-5 py-2.5 text-xs font-bold text-[#000000] hover:bg-[#0095D4] transition-all shadow-lg shadow-[#00AEEF]/20">
          {t("dashboard.billing.addPayment")}
        </button>
      </motion.div>

      {/* Invoices */}
      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
        className="rounded-2xl border border-white/[0.06] overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}>
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-sm font-bold text-white/80">{t("dashboard.billing.invoices")}</h2>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-12 bg-white/[0.03] rounded-xl animate-pulse" />)}
          </div>
        ) : invoices.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center px-6">
            <Receipt className="w-10 h-10 text-zinc-600 mb-3" />
            <p className="text-sm font-medium text-zinc-400">{t("dashboard.billing.noInvoices")}</p>
            <p className="text-xs text-zinc-600 mt-1">{t("dashboard.billing.subtitle")}</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {invoices.map(inv => (
              <div key={inv.id} className="flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${inv.status === "paid" ? "bg-[#00AEEF]/10" : "bg-[#00AEEF]/10"}`}>
                    {inv.status === "paid" ? <CheckCircle2 className="w-5 h-5 text-[#00AEEF]" /> : <Clock className="w-5 h-5 text-[#00AEEF]" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">{inv.id}</p>
                    <p className="text-xs text-zinc-500">{new Date(inv.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{inv.total ? `${inv.total.toLocaleString()} MAD` : "—"}</p>
                    <span className={`text-[10px] font-semibold ${inv.status === "paid" ? "text-[#00AEEF]" : "text-[#00AEEF]"}`}>
                      {inv.status === "paid" ? t("dashboard.projects.status.completed") : t("dashboard.projects.status.pending")}
                    </span>
                  </div>
                  <button className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/[0.05] transition-all">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
