import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, Mail, Phone, Building2, Globe, Calendar, Clock, Wallet,
  FileText, LinkIcon, Package, CheckCircle2, AlertCircle, Loader2, Ban,
} from "lucide-react";
import useAdminOrders from "../../hooks/useAdminOrders";

const STATUS = {
  pending: { label: "En attente", icon: AlertCircle, dot: "bg-amber-400", chip: "bg-amber-400/10 text-amber-300 border-amber-400/20" },
  in_progress: { label: "En cours", icon: Loader2, dot: "bg-sky-400", chip: "bg-sky-400/10 text-sky-300 border-sky-400/20" },
  completed: { label: "Terminé", icon: CheckCircle2, dot: "bg-emerald-400", chip: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20" },
  cancelled: { label: "Annulé", icon: Ban, dot: "bg-zinc-500", chip: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
};

const NEXT_STATUS = {
  pending: ["in_progress", "cancelled"],
  in_progress: ["completed", "cancelled"],
  completed: [],
  cancelled: ["pending"],
};

const TABS = ["all", "pending", "in_progress", "completed", "cancelled"];

const money = (value) =>
  `${new Intl.NumberFormat("fr-FR").format(Math.round(Number(value) || 0))} MAD`;

const fullDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const orderTotal = (order) =>
  Number(order?.total ?? order?.price ?? 0) ||
  (order?.items || []).reduce((sum, i) => sum + Number(i.price || 0) * (i.quantity ?? 1), 0);

/** One labelled line in the client-details block. Hidden when there is no value. */
function Detail({ icon: Icon, label, value, href }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-zinc-500" aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">{label}</p>
        {href ? (
          <a href={href} className="break-words text-sm text-orange-300 underline-offset-2 hover:underline">
            {value}
          </a>
        ) : (
          <p className="break-words text-sm text-zinc-100">{value}</p>
        )}
      </div>
    </div>
  );
}

function OrderDetail({ order, onClose, onStatusChange, busy }) {
  const cfg = STATUS[order.status] || STATUS.pending;
  const total = orderTotal(order);
  const discount = Number(order.discount || 0) + Number(order.promoAmount || 0);

  return (
    <motion.aside
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 overflow-y-auto bg-[#07070B]/95 backdrop-blur-xl lg:inset-y-0 lg:left-auto lg:right-0 lg:w-[34rem] lg:border-l lg:border-white/10"
      role="dialog"
      aria-label="Détail de la commande"
    >
      <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/[0.06] bg-[#07070B]/90 px-5 py-4 backdrop-blur-xl">
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-white">{order.clientName || "Client"}</p>
          <p className="truncate text-xs text-zinc-500">
            {order.orderId || order.id} · {fullDate(order.createdAt)}
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Fermer le détail"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 text-zinc-400 transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-6 px-5 py-5">
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">Statut</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${cfg.chip}`}>
              <cfg.icon className="h-3.5 w-3.5" /> {cfg.label}
            </span>
            {(NEXT_STATUS[order.status] || []).map((key) => (
              <button
                key={key}
                disabled={busy}
                onClick={() => onStatusChange(order.id, key)}
                className="rounded-xl border border-white/10 px-3 py-1.5 text-xs font-bold text-zinc-200 transition-colors hover:bg-white/[0.08] disabled:opacity-50"
              >
                {busy ? "…" : `→ ${STATUS[key].label}`}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4">
          <Detail icon={Mail} label="Email" value={order.email} href={order.email ? `mailto:${order.email}` : null} />
          <Detail icon={Phone} label="Téléphone" value={order.phone} href={order.phone ? `tel:${order.phone}` : null} />
          <Detail icon={Building2} label="Société" value={order.companyName} />
          <Detail icon={Package} label="Secteur" value={order.industry} />
          <Detail icon={Globe} label="Site web" value={order.website} href={order.website} />
          <Detail icon={Clock} label="Délai souhaité" value={order.timeline} />
          <Detail icon={Wallet} label="Budget annoncé" value={order.budget ? `${order.budget} MAD` : ""} />
          <Detail icon={Calendar} label="Reçue le" value={fullDate(order.createdAt)} />
        </div>

        {order.description && (
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">Brief</p>
            <p className="whitespace-pre-wrap rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm leading-relaxed text-zinc-200">
              {order.description}
            </p>
          </div>
        )}

        {(order.items || []).length > 0 && (
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">Services commandés</p>
            <div className="overflow-hidden rounded-2xl border border-white/[0.06]">
              {order.items.map((item, index) => (
                <div
                  key={`${item.serviceId || item.title}-${index}`}
                  className="flex items-center justify-between gap-3 border-b border-white/[0.04] px-4 py-3 last:border-b-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-zinc-100">{item.title}</p>
                    {(item.quantity ?? 1) > 1 && <p className="text-[11px] text-zinc-500">× {item.quantity}</p>}
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-orange-300">
                    {money(Number(item.price || 0) * (item.quantity ?? 1))}
                  </p>
                </div>
              ))}
              <div className="space-y-1 bg-white/[0.02] px-4 py-3">
                {discount > 0 && (
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Remise{order.promoCode ? ` (${order.promoCode})` : ""}</span>
                    <span>− {money(discount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-zinc-300">Total</span>
                  <span className="text-lg font-bold text-white">{money(total)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {(order.files || []).length > 0 && (
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
              Fichiers ({order.files.length})
            </p>
            <div className="space-y-1.5">
              {order.files.map((file, index) => {
                const name = file.name || file.filename || "Fichier";
                return file.url ? (
                  <a
                    key={`${name}-${index}`}
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm text-orange-300 transition-colors hover:bg-white/[0.05]"
                  >
                    <FileText className="h-4 w-4 shrink-0" />
                    <span className="truncate">{name}</span>
                  </a>
                ) : (
                  <div
                    key={`${name}-${index}`}
                    className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm text-zinc-400"
                  >
                    <FileText className="h-4 w-4 shrink-0" />
                    <span className="truncate">{name}</span>
                    <span className="ml-auto shrink-0 text-[11px] text-zinc-600">non téléversé</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {(order.references || []).filter((r) => r.url).length > 0 && (
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">Références</p>
            <div className="space-y-1.5">
              {order.references.filter((r) => r.url).map((ref, index) => (
                <a
                  key={`${ref.url}-${index}`}
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm text-orange-300 transition-colors hover:bg-white/[0.05]"
                >
                  <LinkIcon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{ref.url}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {(order.statusHistory || []).length > 0 && (
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">Historique</p>
            <ol className="space-y-2">
              {order.statusHistory.map((entry, index) => (
                <li key={index} className="flex items-start gap-3 text-sm">
                  <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${(STATUS[entry.status] || STATUS.pending).dot}`} />
                  <div>
                    <p className="text-zinc-200">{(STATUS[entry.status] || STATUS.pending).label}</p>
                    <p className="text-[11px] text-zinc-500">{fullDate(entry.date)}</p>
                    {entry.note && <p className="mt-0.5 text-xs text-zinc-400">{entry.note}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </motion.aside>
  );
}

export default function AdminOrdersPage() {
  const { orders: projects, loading, error, reload, changeStatus } = useAdminOrders();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return projects
      .filter((p) => (tab === "all" ? true : p.status === tab))
      .filter((p) =>
        !needle
          ? true
          : [p.clientName, p.email, p.phone, p.companyName, p.serviceTitle, p.orderId]
              .some((field) => String(field || "").toLowerCase().includes(needle))
      )
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [projects, search, tab]);

  const selected = filtered.find((p) => p.id === selectedId) || projects.find((p) => p.id === selectedId) || null;

  const handleStatusChange = async (id, status) => {
    setBusyId(id);
    try {
      await changeStatus(id, status);
    } finally {
      setBusyId(null);
    }
  };

  const counts = useMemo(() => {
    const base = { all: projects.length };
    for (const key of Object.keys(STATUS)) base[key] = projects.filter((p) => p.status === key).length;
    return base;
  }, [projects]);

  return (
    <div className="max-w-6xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Commandes</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {loading ? "Chargement…" : `${projects.length} commande${projects.length === 1 ? "" : "s"} reçue${projects.length === 1 ? "" : "s"}`}
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
          <div className="flex-1 text-sm text-red-200">{error}</div>
          <button onClick={reload} className="shrink-0 text-xs font-bold text-red-200 underline underline-offset-2">
            Réessayer
          </button>
        </div>
      )}

      <div className="mb-5 space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nom, email, téléphone, société…"
            aria-label="Rechercher une commande"
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-orange-400/50"
          />
        </div>

        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {TABS.map((key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`shrink-0 rounded-xl border px-3.5 py-2 text-xs font-bold transition-colors ${
                tab === key
                  ? "border-orange-400/40 bg-orange-400/10 text-orange-300"
                  : "border-white/[0.08] text-zinc-400 hover:bg-white/[0.05]"
              }`}
            >
              {key === "all" ? "Toutes" : STATUS[key].label}
              <span className="ml-1.5 text-zinc-500">{counts[key] ?? 0}</span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-white/[0.03]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-14 text-center">
          <Package className="mx-auto mb-3 h-8 w-8 text-zinc-600" />
          <p className="text-sm font-medium text-zinc-400">
            {projects.length === 0 ? "Aucune commande pour le moment." : "Aucune commande ne correspond à cette recherche."}
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((order) => {
            const cfg = STATUS[order.status] || STATUS.pending;
            return (
              <li key={order.id}>
                <button
                  onClick={() => setSelectedId(order.id)}
                  className="w-full rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-left transition-colors hover:bg-white/[0.05]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 shrink-0 rounded-full ${cfg.dot}`} aria-hidden="true" />
                        <p className="truncate text-sm font-bold text-white">{order.clientName || "Client"}</p>
                      </div>
                      <p className="mt-1 truncate text-xs text-zinc-400">
                        {order.serviceTitle || `${(order.items || []).length} service(s)`}
                      </p>
                      <p className="mt-1.5 truncate text-[11px] text-zinc-600">
                        {fullDate(order.createdAt)}
                        {order.companyName ? ` · ${order.companyName}` : ""}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-white">{money(orderTotal(order))}</p>
                      <span className={`mt-1.5 inline-block rounded-full border px-2 py-0.5 text-[10px] font-bold ${cfg.chip}`}>
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <AnimatePresence>
        {selected && (
          <OrderDetail
            order={selected}
            busy={busyId === selected.id}
            onClose={() => setSelectedId(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
