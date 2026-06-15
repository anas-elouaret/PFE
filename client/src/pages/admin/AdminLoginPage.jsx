import { useTranslation } from "react-i18next";
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AdminLoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(email, password, true);
      if (data.user?.role !== "admin") {
        setError("Access denied. Admin privileges required.");
        return;
      }
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen bg-[#070707]">
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#070707] to-[#050508]" />
      <div className="fixed inset-0" style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(0,174,239,0.06) 0%, transparent 60%)" }} />

      <div className="relative z-10 mx-auto flex w-full max-w-[440px] items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 border border-[#00AEEF]/30 bg-[#00AEEF]/10 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-[#00AEEF] mb-6 backdrop-blur-md">
              <Lock className="w-3 h-3" /> {t("admin.badge")}
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">{t("admin.login.title")}</h1>
            <p className="text-sm text-zinc-500 mt-2">{t("admin.login.subtitle")}</p>
          </div>

          <form onSubmit={handleLogin} className="rounded-3xl border border-white/[0.06] p-8 sm:p-10"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))", backdropFilter: "blur(24px)" }}>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </motion.div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">{t("admin.login.email")}</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-[#00AEEF]/40 transition-all"
                  placeholder="admin@growstack.com" required />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5">{t("admin.login.password")}</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 pr-10 text-sm text-white placeholder-zinc-600 outline-none focus:border-[#00AEEF]/40 transition-all"
                    placeholder="••••••••" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full rounded-2xl bg-[#00AEEF] px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-[#00AEEF]/20 transition-all disabled:opacity-50">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  {t("admin.login.signingIn")}
                </span>
              ) : t("admin.login.signIn")}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
