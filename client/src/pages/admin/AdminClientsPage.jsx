import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useProjects } from "../../context/ProjectContext";
import { getAllUsers } from "../../api/admin";
import { Search, Mail, Calendar, Users } from "lucide-react";

export default function AdminClientsPage() {
  const { t } = useTranslation();
  const { projects } = useProjects();
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllUsers()
      .then((users) => setClients(users.filter(u => u.role !== "admin")))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = clients.filter(c =>
    !search.trim() || c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const getClientProjects = (email) => projects.filter(p => p.email === email);

  return (
    <div className="max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-black text-white tracking-tight">{t("admin.clients.title")}</h1>
        <p className="text-sm text-zinc-500 mt-1">{t("admin.clients.count", { count: clients.length })}</p>
      </motion.div>

      <div className="relative max-w-xs mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t("admin.clients.searchPlaceholder")}
          className="w-full bg-white/[0.04] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-[#00AEEF]/40 transition-all" />
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="rounded-2xl border border-white/[0.06] p-5 animate-pulse">
              <div className="h-10 w-10 bg-white/5 rounded-xl mb-3" />
              <div className="h-4 w-32 bg-white/5 rounded mb-2" />
              <div className="h-3 w-48 bg-white/5 rounded" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <Users className="w-10 h-10 text-zinc-600 mb-3" />
          <p className="text-sm font-medium text-zinc-400">{clients.length === 0 ? t("admin.clients.noClients") : t("admin.clients.noMatching")}</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((client, i) => {
            const clientProjects = getClientProjects(client.email);
            return (
              <motion.div key={client.id || client._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                className="rounded-2xl border border-white/[0.06] p-5"
                style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00AEEF] to-[#0095D4] flex items-center justify-center text-sm font-bold text-white">
                    {client.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{client.name}</p>
                    <p className="text-xs text-zinc-500 truncate flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {client.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(client.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {t("admin.clients.projects", { count: clientProjects.length })}
                  </span>
                </div>
                {client.isVerified === false && (
                  <span className="mt-3 inline-flex px-2 py-1 rounded-full text-[10px] font-bold bg-[#00AEEF]/10 text-[#00AEEF] border border-[#00AEEF]/20">
                    {t("admin.clients.unverified")}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
