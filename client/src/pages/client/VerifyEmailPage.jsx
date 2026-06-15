import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useSearchParams, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

export default function VerifyEmailPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { verifyEmail } = useAuth();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage(t("auth.missingToken"));
      return;
    }

    verifyEmail(token)
      .then((data) => {
        setStatus("success");
        setMessage(data.message || t("auth.emailVerifiedSuccess"));
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.message || t("auth.invalidVerificationLink"));
      });
  }, [token, verifyEmail]);

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#070707]">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#070707] to-[#050508]" />
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-[440px] items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full text-center"
        >
          <div className="mb-8">
            <Link to="/" className="inline-block text-2xl font-black tracking-[-0.02em] text-white">
              growstack<span className="text-[#00AEEF]">.</span>
            </Link>
          </div>

          <div
            className="rounded-3xl border border-white/[0.06] p-10"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
              backdropFilter: "blur(24px)",
            }}
          >
            {status === "loading" && (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-[#00AEEF]" />
                <p className="text-sm text-zinc-400">{t("auth.verifyingEmail")}</p>
              </div>
            )}

            {status === "success" && (
              <div>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#00AEEF]/10">
                  <CheckCircle2 className="h-8 w-8 text-[#33C8FF]" />
                </div>
                <h2 className="text-xl font-bold text-white">{t("auth.emailVerified")}</h2>
                <p className="mt-2 text-sm text-zinc-400">{message}</p>
                <Link
                  to="/client/dashboard"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#00AEEF] to-[#0095D4] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#00AEEF]/20 transition-all hover:shadow-xl"
                >
                  {t("auth.goToDashboard")}
                </Link>
              </div>
            )}

            {status === "error" && (
              <div>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
                  <AlertCircle className="h-8 w-8 text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-white">{t("auth.verificationFailed")}</h2>
                <p className="mt-2 text-sm text-zinc-400">{message}</p>
                <Link
                  to="/client/login"
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#00AEEF]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t("auth.backToSignIn")}
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
