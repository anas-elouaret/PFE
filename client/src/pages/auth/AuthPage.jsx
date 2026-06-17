import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import AuthForm from "../../components/auth/AuthForm";
import DashboardPreview from "../../components/auth/DashboardPreview";
import { getCurrentUser, logout, signin, signup } from "../../api/auth";

const TOKEN_KEY = "auth_token";

export default function AuthPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Ready");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        const data = await getCurrentUser(token);
        setUser(data.user);
        navigate("/", { replace: true });
      } catch (err) {
        localStorage.removeItem(TOKEN_KEY);
        setToken("");
        setUser(null);
        setError(err.message || "Session expirée");
      }
    };
    load();
  }, [navigate, token]);

  const greeting = useMemo(() => {
    if (!user) return null;
    return {
      title: `Bonjour, ${user.name}`,
      subtitle: "Votre compte est actif et prêt.",
    };
  }, [user]);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus(t("common.loading"));
    setLoading(true);
    try {
      const payload = { email: formData.email, password: formData.password };
      const data = mode === "signup"
        ? await signup({ ...payload, name: formData.name })
        : await signin(payload);
      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setUser(data.user);
      setStatus(data.message);
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      setError(err.message || "Authentification échouée");
      setStatus("Prêt");
    } finally {
      setLoading(false);
    }
  };

  const onLogout = async () => {
    setError("");
    setLoading(true);
    try {
      const data = await logout();
      setStatus(data.message || t("auth.success.logout"));
    } catch {
      setStatus(t("auth.success.logout"));
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setToken("");
      setUser(null);
      setLoading(false);
    }
  };

  if (user) {
    return (
      <DashboardPreview user={user} onLogout={onLogout} loading={loading} />
    );
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* LEFT — AUTH FORM */}
      <div className="flex items-center justify-center bg-white px-6 py-12 lg:px-16">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-block text-2xl font-bold tracking-tight text-slate-900 mb-10">
            growstack<span className="text-slate-400">.</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AuthForm
              mode={mode}
              formData={formData}
              onInputChange={onInputChange}
              onSubmit={onSubmit}
              onModeChange={setMode}
              loading={loading}
              error={error}
              status={status}
            />
          </motion.div>
        </div>
      </div>

      {/* RIGHT — DARK SPLIT PANEL */}
      <div
        className="relative flex items-center justify-center bg-black px-6 py-12 lg:px-16"
        style={{
          clipPath: "polygon(10% 0, 100% 0, 100% 100%, 0 100%)",
        }}
      >
        <div className="text-center max-w-sm">
          <p className="text-sm font-bold tracking-[0.25em] text-white/80 uppercase">
            Espace Client
          </p>
          <p className="mt-4 text-base text-zinc-400 leading-relaxed">
            Accès sécurisé à votre tableau de bord et à l&apos;ensemble de vos services.
          </p>
        </div>
      </div>
    </div>
  );
}
