import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { Loader2, ArrowLeft, AlertCircle, CheckCircle2, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const { forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError(t("auth.pleaseEnterEmail"));
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err.message || t("error.generic"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="mx-auto flex w-full max-w-[440px] items-center justify-center px-4">
        <div className="w-full">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-block text-2xl font-bold tracking-tight text-slate-900">
              growstack<span className="text-slate-400">.</span>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10"
          >
            {!sent ? (
              <>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50">
                  <Mail className="h-6 w-6 text-indigo-600" />
                </div>
                <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">
                  {t("auth.resetPassword")}
                </h1>
                <p className="mt-1.5 text-sm text-slate-500">
                  {t("auth.resetPasswordDesc")}
                </p>

                {error && (
                  <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                    <p className="text-sm font-medium text-red-700">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold tracking-wide text-slate-600 uppercase">
                      {t("auth.email")}
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t("auth.emailPlaceholder")}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:border-slate-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t("auth.sending")}
                      </>
                    ) : (
                      t("auth.sendResetLink")
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                  <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">{t("auth.checkInbox")}</h2>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  {t("auth.resetLinkSent")} <span className="font-medium text-slate-700">{email}</span>
                </p>
                <p className="mt-4 text-xs text-slate-400">
                  {t("auth.spamCheck")}{" "}
                  <button
                    onClick={() => { setSent(false); setLoading(false); }}
                    className="font-semibold text-slate-900 hover:underline"
                  >
                    {t("auth.tryAgain")}
                  </button>
                </p>
              </div>
            )}
          </motion.div>

          <div className="mt-6 text-center">
            <Link
              to="/client/login"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 transition-colors hover:text-slate-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t("auth.backToSignIn")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
