import { useTranslation } from "react-i18next";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import BackButton from "../../components/ui/BackButton";
import { User, Lock, Eye, EyeOff, Loader2, Mail, ChevronRight } from "lucide-react";

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const resetForm = () => {
    setError("");
    setSuccess("");
    setPassword("");
    setConfirmPassword("");
  };

  const toggleMode = () => {
    setIsSignUp((prev) => !prev);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError(t("val_required"));
      return;
    }

    if (isSignUp && !name) {
      setError(t("val_name_required"));
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError(t("login_passwords_match"));
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        await signup(name, email, password);
        setSuccess(t("auth_account_created"));
        setTimeout(() => navigate("/client/dashboard", { replace: true }), 1500);
      } else {
        const data = await login(email, password, remember);
        if (data.user?.isVerified === false) {
          setSuccess(t("auth_login_verify"));
        }
        navigate("/client/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.message || t("error_generic"));
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    enter: { opacity: 0, y: 12 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -12 },
  };

  const panelLeft = isSignUp ? "0%" : "45%";

  const panelClipPath = isSignUp
    ? "polygon(0% 0%, 85% 0%, 100% 100%, 0% 100%)"
    : "polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)";

  const formLeft = isSignUp ? "45%" : "0%";

  const formRight = isSignUp ? "0%" : "45%";

  return (
    <>
      <BackButton />
      <div className="min-h-screen bg-slate-50 overflow-hidden flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl min-h-[560px] overflow-hidden rounded-2xl border border-slate-200/60 shadow-sm bg-white">

        {/* ─── WHITE FORM PANEL ─── */}
        <div
          className="absolute inset-y-0 bg-white flex items-center justify-center transition-all duration-700 ease-in-out z-10"
          style={{ left: formLeft, right: formRight }}
        >
          <div className="w-full max-w-md px-8 lg:px-12 py-10">
            <Link to="/" className="inline-block text-2xl font-bold tracking-tight text-slate-900 mb-8">
              growstack<span className="text-slate-400">.</span>
            </Link>

            <AnimatePresence mode="wait">
              <motion.div
                key={isSignUp ? "signup" : "login"}
                variants={formVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {!isSignUp ? (
                  <>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t("login_title")}</h1>
                    <div className="mt-2 w-10 h-1 bg-slate-900 rounded-full" />

                    {error && (
                      <div className="mt-6 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                        <span className="text-sm font-medium text-red-700">{error}</span>
                      </div>
                    )}
                    {success && (
                      <div className="mt-6 flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3">
                        <span className="text-sm font-medium text-emerald-700">{success}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                      <div className="relative border-b border-slate-200 focus-within:border-slate-900 transition-colors">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t("login_email")}
                          className="w-full bg-transparent py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none"
                        />
                        <User size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>

                      <div className="relative border-b border-slate-200 focus-within:border-slate-900 transition-colors">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={t("login_password")}
                          className="w-full bg-transparent py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none"
                        />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <Lock size={16} className="text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex cursor-pointer items-center gap-2">
                          <input
                            type="checkbox"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/30"
                          />
                          <span className="text-sm text-slate-500">{t("login_remember")}</span>
                        </label>
                        <Link
                          to="/client/forgot-password"
                          className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
                        >
                          {t("login_forgot")}
                        </Link>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-full bg-black text-white py-2.5 text-sm font-semibold hover:bg-slate-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 size={16} className="animate-spin" />
                            {t("login_signing_in")}
                          </span>
                        ) : (
                          <span>{t("login_submit")}</span>
                        )}
                      </button>
                    </form>

                    <div className="mt-6 text-center">
                      <p className="text-sm text-slate-500">
                        {t("login_no_account")}{" "}
                        <button onClick={toggleMode} className="font-semibold text-slate-900 hover:underline">
                          {t("login_signup_link")}
                        </button>
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t("login_signup_title")}</h1>
                    <div className="mt-2 w-10 h-1 bg-slate-900 rounded-full" />

                    {error && (
                      <div className="mt-6 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
                        <span className="text-sm font-medium text-red-700">{error}</span>
                      </div>
                    )}
                    {success && (
                      <div className="mt-6 flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3">
                        <span className="text-sm font-medium text-emerald-700">{success}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                      <div className="relative border-b border-slate-200 focus-within:border-slate-900 transition-colors">
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={t("login_name")}
                          className="w-full bg-transparent py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none"
                        />
                        <User size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>

                      <div className="relative border-b border-slate-200 focus-within:border-slate-900 transition-colors">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={t("login_email")}
                          className="w-full bg-transparent py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none"
                        />
                        <Mail size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>

                      <div className="relative border-b border-slate-200 focus-within:border-slate-900 transition-colors">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder={t("login_password")}
                          className="w-full bg-transparent py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none"
                        />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                          <Lock size={16} className="text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      <div className="relative border-b border-slate-200 focus-within:border-slate-900 transition-colors">
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder={t("login_confirm")}
                          className="w-full bg-transparent py-2.5 pr-10 text-sm text-slate-900 placeholder-slate-400 outline-none"
                        />
                        <Lock size={16} className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed">{t("login_terms")}</p>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-full bg-black text-white py-2.5 text-sm font-semibold hover:bg-slate-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 size={16} className="animate-spin" />
                            {t("login_creating")}
                          </span>
                        ) : (
                          <span>{t("login_signup_submit")}</span>
                        )}
                      </button>
                    </form>

                    <div className="mt-6 text-center">
                      <p className="text-sm text-slate-500">
                        {t("login_has_account")}{" "}
                        <button onClick={toggleMode} className="font-semibold text-slate-900 hover:underline">
                          {t("login_login_link")}
                        </button>
                      </p>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ─── DARK SLIDER PANEL ─── */}
        <div
          className="absolute inset-y-0 bg-slate-950 flex items-center justify-center transition-all duration-700 ease-in-out z-20"
          style={{ width: "55%", left: panelLeft, clipPath: panelClipPath }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? "panel-signup" : "panel-login"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="text-center px-8 lg:px-14 max-w-sm"
            >
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 mb-2">
                {isSignUp ? t("panel_already_member") : t("panel_new_here")}
              </h4>
              <h3 className="text-3xl sm:text-4xl font-extrabold leading-tight text-white mb-4">
                {isSignUp ? t("panel_welcome_back") : t("panel_get_started")}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed mb-8">
                {isSignUp ? t("panel_login_desc") : t("panel_signup_desc")}
              </p>
              <button
                type="button"
                onClick={toggleMode}
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-slate-950 transition-all duration-300"
              >
                {isSignUp ? t("panel_login_btn") : t("panel_signup_btn")}
                <ChevronRight size={14} />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
    </>
  );
}
