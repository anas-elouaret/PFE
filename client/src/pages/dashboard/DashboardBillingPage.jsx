import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { getInvoices } from "../../api/payments";
import { Landmark, Receipt, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }) };

export default function DashboardBillingPage() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInvoices().then(data => { setInvoices(data); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-6xl">
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Facturation</h1>
        <p className="text-sm text-slate-500 mt-1">Gérez vos paiements et vos factures ici</p>
      </motion.div>

      {/* Payment Method Card */}
      <motion.div custom={1} variants={fadeUp} initial="hidden" animate="visible"
        className="bg-slate-50 border-2 border-black p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center border-2 border-black bg-white">
            <Landmark className="h-6 w-6 text-slate-600" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900">Modalités de paiement</h2>
            {/* GROWSTACK takes bank transfer only. The card icon and the
                "add a payment method" button that stood here promised a card
                flow that does not exist and never led anywhere. */}
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Le règlement se fait par virement bancaire : un acompte de 50% au lancement du
              projet, le solde après la livraison finale. Les coordonnées bancaires vous sont
              transmises avec le devis.
            </p>
            <a
              href="mailto:growstackagency@gmail.com"
              className="mt-3 inline-flex min-h-[44px] items-center text-sm font-bold text-orange-600 underline underline-offset-2 hover:text-orange-700"
            >
              Une question sur une facture ?
            </a>
          </div>
        </div>
      </motion.div>

      {/* Invoices */}
      <motion.div custom={2} variants={fadeUp} initial="hidden" animate="visible"
        className="bg-slate-50 border-2 border-black overflow-hidden">
        <div className="px-6 py-4 border-b-2 border-black">
          <h2 className="text-sm font-bold text-slate-900">Factures</h2>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-12 bg-slate-100 animate-pulse" />)}
          </div>
        ) : invoices.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center px-6">
            <Receipt className="w-10 h-10 text-slate-400 mb-3" />
            <p className="text-sm font-medium text-slate-500">Aucune facture</p>
            <p className="text-xs text-slate-400 mt-1">Gérez vos paiements et vos factures ici</p>
          </div>
        ) : (
          <div className="divide-y-2 divide-slate-200">
            {invoices.map(inv => (
              <div key={inv.id} className="flex items-center justify-between px-6 py-4 bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`w-10 h-10 flex items-center justify-center bg-orange-50`}>
                    {inv.status === "paid" ? <CheckCircle2 className="w-5 h-5 text-orange-500" /> : <Clock className="w-5 h-5 text-orange-500" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900">{inv.id}</p>
                    <p className="text-xs text-slate-500">{new Date(inv.createdAt).toLocaleDateString("fr-FR", { month: "short", day: "numeric", year: "numeric" })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-end">
                    <p className="text-sm font-bold text-slate-900">{inv.total ? `${inv.total.toLocaleString()} MAD` : "—"}</p>
                    <span className="text-[10px] font-semibold bg-orange-50 text-orange-500 px-2 py-0.5">
                      {inv.status === "paid" ? "Terminé" : "En Attente"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
