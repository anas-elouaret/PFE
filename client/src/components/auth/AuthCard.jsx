import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import gsap from "gsap";
import AuthFormEnhanced from "./AuthFormEnhanced";

const cardReveal = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0, y: -30, scale: 0.96,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerItem = (i) => ({
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1, y: 0,
    transition: { delay: 0.3 + i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
});

export default function AuthCard({
  mode, formData, onInputChange, onSubmit, onModeChange, loading, error, status,
}) {
  const { t } = useTranslation();
  const isSignup = mode === "signup";
  const cardRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.3 }
    );
  }, []);

  return (
    <motion.div
      ref={cardRef}
      variants={cardReveal}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="group relative w-full max-w-[420px]"
    >
      <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-[#00AEEF]/20 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />

      <div className="relative overflow-hidden rounded-3xl backdrop-blur-2xl"
        style={{
          background: "linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <div className="absolute inset-0 rounded-3xl"
          style={{
            background: "radial-gradient(ellipse 140% 40% at 50% 0%, rgba(0,174,239,0.06) 0%, transparent 60%)",
          }}
        />

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-[#00AEEF]/30 to-transparent" />

        <div className="relative space-y-6 p-8 sm:p-10">
          <motion.div custom={0} variants={staggerItem} initial="hidden" animate="visible" className="text-center">
            <motion.div
              className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
              style={{
                background: "linear-gradient(135deg, rgba(0,174,239,0.15), rgba(0,174,239,0.04))",
                border: "1px solid rgba(0,174,239,0.15)",
                boxShadow: "0 0 40px rgba(0,174,239,0.06)",
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#00AEEF]">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </motion.div>

            <h1 className="text-[28px] font-bold tracking-tight text-white sm:text-[32px]">
              {t("auth.space_title")}
            </h1>
            <p className="mt-2 text-sm text-white/40">
              {t("auth.secure_access")}
            </p>
          </motion.div>

          <motion.div custom={1} variants={staggerItem} initial="hidden" animate="visible">
            <div className="flex rounded-xl bg-white/[0.03] p-1 ring-1 ring-white/[0.06]">
              {[
                { key: "signin", label: t("auth.login.btn") },
                { key: "signup", label: t("auth.register.btn") },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => onModeChange(key)}
                  className={`relative flex-1 rounded-lg px-4 py-2.5 text-xs font-bold tracking-[0.15em] uppercase transition-all duration-300 ${
                    mode === key
                      ? "text-[#00AEEF]"
                      : "text-white/25 hover:text-white/50"
                  }`}
                >
                  {mode === key && (
                    <motion.div
                      layoutId="modePill"
                      className="absolute inset-0 rounded-lg bg-white/[0.06]"
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div custom={2} variants={staggerItem} initial="hidden" animate="visible">
            {(status || error) && (
              <div
                className={`rounded-xl px-4 py-3 text-sm ${
                  error
                    ? "border border-red-500/20 bg-red-500/10 text-red-300"
                    : "border border-white/10 bg-white/[0.03] text-white/50"
                }`}
              >
                {error || status}
              </div>
            )}
          </motion.div>

          <AuthFormEnhanced
            formData={formData}
            onInputChange={onInputChange}
            onSubmit={onSubmit}
            loading={loading}
            isSignup={isSignup}
            mode={mode}
            onModeChange={onModeChange}
          />

          <motion.div
            custom={4}
            variants={staggerItem}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.06]" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[rgba(10,10,15,0.8)] px-4 text-white/20 backdrop-blur-sm">
                {t("auth.or_continue_with")}
              </span>
            </div>
          </motion.div>

          <motion.div
            custom={5}
            variants={staggerItem}
            initial="hidden"
            animate="visible"
            className="flex gap-3"
          >
            {[
              { name: "Google", path: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" },
              { name: "GitHub", path: "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" },
            ].map(({ name, path }) => (
              <button
                key={name}
                type="button"
                className="group/btn flex flex-1 items-center justify-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] px-4 py-3 text-xs font-semibold text-white/40 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-white/70"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d={path} />
                </svg>
                {name}
              </button>
            ))}
          </motion.div>

          <motion.div
            custom={6}
            variants={staggerItem}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <p className="text-[10px] tracking-[0.2em] text-white/30 uppercase">
              © {new Date().getFullYear()} — {t("auth.all_rights_reserved")}
            </p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
