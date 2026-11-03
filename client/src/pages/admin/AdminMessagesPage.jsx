import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Search, Trash2, MailOpen, Inbox, AlertCircle } from "lucide-react";
import { getAllMessages, markMessageAsRead, deleteMessage } from "../../api/contact";

const fullDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllMessages();
      setMessages(Array.isArray(data?.messages) ? data.messages : []);
    } catch (err) {
      setError(err.message || "Impossible de charger les messages.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return messages
      .filter((m) => (unreadOnly ? !m.isRead : true))
      .filter((m) =>
        !needle
          ? true
          : [m.name, m.email, m.subject, m.message].some((f) => String(f || "").toLowerCase().includes(needle))
      )
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [messages, search, unreadOnly]);

  const handleRead = async (id) => {
    setBusyId(id);
    try {
      await markMessageAsRead(id);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
    } catch (err) {
      setError(err.message || "La mise à jour a échoué.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id) => {
    setBusyId(id);
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      setConfirmingId(null);
    } catch (err) {
      setError(err.message || "La suppression a échoué.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">Messages</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {loading
            ? "Chargement…"
            : `${messages.length} message${messages.length === 1 ? "" : "s"}${unreadCount ? ` · ${unreadCount} non lu${unreadCount === 1 ? "" : "s"}` : ""}`}
        </p>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
          <div className="flex-1 text-sm text-red-200">{error}</div>
          <button onClick={load} className="shrink-0 text-xs font-bold text-red-200 underline underline-offset-2">
            Réessayer
          </button>
        </div>
      )}

      <div className="mb-5 space-y-3">
        <div className="relative">
          <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nom, email, sujet…"
            aria-label="Rechercher un message"
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-3 ps-10 pe-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-orange-400/50"
          />
        </div>
        <button
          onClick={() => setUnreadOnly((v) => !v)}
          aria-pressed={unreadOnly}
          className={`rounded-xl border px-3.5 py-2 text-xs font-bold transition-colors ${
            unreadOnly
              ? "border-orange-400/40 bg-orange-400/10 text-orange-300"
              : "border-white/[0.08] text-zinc-400 hover:bg-white/[0.05]"
          }`}
        >
          Non lus seulement {unreadCount > 0 && <span className="ms-1 text-zinc-500">{unreadCount}</span>}
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-white/[0.03]" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-14 text-center">
          <Inbox className="mx-auto mb-3 h-8 w-8 text-zinc-600" />
          <p className="text-sm font-medium text-zinc-400">
            {messages.length === 0 ? "Aucun message pour le moment." : "Aucun message ne correspond."}
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((message) => (
            <motion.li
              key={message.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`rounded-2xl border p-4 ${
                message.isRead ? "border-white/[0.06] bg-white/[0.02]" : "border-orange-400/20 bg-orange-400/[0.04]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {!message.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-orange-400" aria-label="Non lu" />}
                    <p className="truncate text-sm font-bold text-white">{message.subject}</p>
                  </div>
                  <p className="mt-1 truncate text-xs text-zinc-400">
                    {message.name} · {fullDate(message.createdAt)}
                  </p>
                </div>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-200">{message.message}</p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <a
                  href={`mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject}`)}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-orange-400/30 bg-orange-400/10 px-3 py-2 text-xs font-bold text-orange-300 transition-colors hover:bg-orange-400/20"
                >
                  <Mail className="h-3.5 w-3.5" /> Répondre
                </a>
                {message.phone && (
                  <a
                    href={`tel:${message.phone}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-zinc-300 transition-colors hover:bg-white/[0.06]"
                  >
                    <Phone className="h-3.5 w-3.5" /> {message.phone}
                  </a>
                )}
                {!message.isRead && (
                  <button
                    onClick={() => handleRead(message.id)}
                    disabled={busyId === message.id}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-zinc-300 transition-colors hover:bg-white/[0.06] disabled:opacity-50"
                  >
                    <MailOpen className="h-3.5 w-3.5" /> Marquer comme lu
                  </button>
                )}

                {confirmingId === message.id ? (
                  <span className="ms-auto inline-flex items-center gap-2">
                    <span className="text-xs text-zinc-400">Supprimer ?</span>
                    <button
                      onClick={() => handleDelete(message.id)}
                      disabled={busyId === message.id}
                      className="rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs font-bold text-red-300 disabled:opacity-50"
                    >
                      {busyId === message.id ? "…" : "Oui"}
                    </button>
                    <button
                      onClick={() => setConfirmingId(null)}
                      className="rounded-xl border border-white/10 px-3 py-2 text-xs font-bold text-zinc-300"
                    >
                      Non
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={() => setConfirmingId(message.id)}
                    aria-label="Supprimer le message"
                    className="ms-auto inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 text-zinc-500 transition-colors hover:bg-red-400/10 hover:text-red-300"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <p className="mt-3 truncate text-[11px] text-zinc-600">{message.email}</p>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
