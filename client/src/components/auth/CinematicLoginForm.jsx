import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

export default function CinematicLoginForm({
  mode,
  formData,
  onInputChange,
  onSubmit,
  onModeChange,
  loading,
  error,
  status,
  isLampOn,
}) {
  const { t } = useTranslation();
  const isSignup = mode === "signup";
  const [focusedField, setFocusedField] = useState(null);
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const errors = {};
  if (touched.email && formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "auth.errors.invalidEmail";
  }
  if (touched.password && formData.password && formData.password.length < 6) {
    errors.password = "auth.errors.passwordLength";
  }
  if (isSignup && touched.name && !formData.name.trim()) {
    errors.name = "auth.errors.required";
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.97 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.08 },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.97,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isLampOn && (
        <motion.div
          key="login-card"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="relative w-full max-w-md overflow-hidden rounded-3xl"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] backdrop-blur-2xl" />
          <div className="absolute inset-0 rounded-3xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" />

          <div
            className="absolute -inset-1 rounded-3xl opacity-30"
            style={{
              background:
                "radial-gradient(ellipse at 50% 0%, rgba(0,174,239,0.2) 0%, transparent 60%)",
            }}
          />

          <div className="relative space-y-6 p-8 sm:p-10">
            <motion.div variants={itemVariants} className="text-center">
              <motion.div
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(0,174,239,0.2), rgba(0,174,239,0.05))",
                  border: "1px solid rgba(0,174,239,0.2)",
                  boxShadow: "0 0 30px rgba(0,174,239,0.1)",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-[#00AEEF]"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-3xl font-bold tracking-tight text-white"
              >
                {t(isSignup ? "auth.register.title" : "auth.login.title")}
              </motion.h1>
              <motion.p
                variants={itemVariants}
                className="mt-2 text-sm text-white/50"
              >
                {t(isSignup ? "auth.register.subtitle" : "auth.login.subtitle")}
              </motion.p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="flex rounded-xl bg-white/[0.03] p-1 ring-1 ring-white/[0.06]">
                {[
                  { mode: "signin", label: t("auth.login.btn") },
                  { mode: "signup", label: t("auth.register.btn") },
                ].map(({ mode: m, label }) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => onModeChange(m)}
                    className={`relative flex-1 rounded-lg px-4 py-2 text-xs font-semibold tracking-widest uppercase transition-all duration-300 ${
                      mode === m
                        ? "text-[#00AEEF]"
                        : "text-white/30 hover:text-white/60"
                    }`}
                  >
                    {mode === m && (
                      <motion.div
                        layoutId="mode-bg"
                        className="absolute inset-0 rounded-lg bg-white/[0.06]"
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      />
                    )}
                    <span className="relative z-10">{label}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {(status || error) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-xl px-4 py-3 text-sm ${
                  error
                    ? "border border-red-500/20 bg-red-500/10 text-red-300"
                    : "border border-white/10 bg-white/[0.03] text-white/60"
                }`}
              >
                {error || status}
              </motion.div>
            )}

            <motion.form
              variants={itemVariants}
              onSubmit={onSubmit}
              className="space-y-4"
            >
              {isSignup && (
                <FieldWrapper
                  label={t("auth.register.name")}
                  focused={focusedField === "name"}
                  error={errors.name}
                  isLampOn={isLampOn}
                >
                  <input
                    type="text"
                    name="name"
                    placeholder="your name"
                    value={formData.name}
                    onChange={onInputChange}
                    onFocus={() => setFocusedField("name")}
                    onBlur={() => {
                      setFocusedField(null);
                      setTouched((prev) => ({ ...prev, name: true }));
                    }}
                    className="w-full bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/20"
                    required
                  />
                </FieldWrapper>
              )}

              <FieldWrapper
                label={t("auth.login.email")}
                focused={focusedField === "email"}
                error={errors.email}
                isLampOn={isLampOn}
              >
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={onInputChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => {
                    setFocusedField(null);
                    setTouched((prev) => ({ ...prev, email: true }));
                  }}
                  className="w-full bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/20"
                  required
                />
              </FieldWrapper>

              <FieldWrapper
                label={t("auth.login.password")}
                focused={focusedField === "password"}
                error={errors.password}
                isLampOn={isLampOn}
              >
                <div className="relative flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={onInputChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => {
                      setFocusedField(null);
                      setTouched((prev) => ({ ...prev, password: true }));
                    }}
                    className="w-full bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/20"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 text-white/30 hover:text-white/60"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </FieldWrapper>

              {isSignup && (
                <motion.label
                  variants={itemVariants}
                  className="flex items-start gap-3 text-xs text-white/40"
                >
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 rounded border-white/20 bg-white/5 accent-[#00AEEF]"
                    required
                  />
                  <span>I agree to the terms & privacy policy</span>
                </motion.label>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-xl py-3.5 text-sm font-bold tracking-wider text-white uppercase"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className="absolute inset-0 rounded-xl opacity-90 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(135deg, #00AEEF, #0095D4, #0095D4)",
                    boxShadow: "0 0 30px rgba(0,174,239,0.3)",
                  }}
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 to-transparent opacity-30" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {t("common.loading")}
                    </>
                  ) : isSignup ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                      {t("auth.register.btn")}
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                      {t("auth.login.btn")}
                    </>
                  )}
                </span>
              </motion.button>
            </motion.form>

            <motion.div variants={itemVariants} className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.06]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[rgba(0,0,0,0.5)] px-3 text-white/30 backdrop-blur-sm">
                  or continue with
                </span>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex gap-3"
            >
              {["Google", "GitHub"].map((provider) => (
                <button
                  key={provider}
                  type="button"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-xs font-semibold text-white/50 transition-all duration-300 hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white/80"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d={provider === "Google" ? "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" : "M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"} />
                  </svg>
                  {provider}
                </button>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FieldWrapper({ label, focused, error, isLampOn, children }) {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-1.5"
    >
      <label className="block text-[11px] font-semibold tracking-widest text-white/40 uppercase">
        {label}
      </label>
      <div
        className={`group relative overflow-hidden rounded-xl transition-all duration-500 ${
          error
            ? "ring-2 ring-red-500/40"
            : focused
              ? "ring-2 ring-[#00AEEF]/50"
              : "ring-1 ring-white/[0.08]"
        }`}
        style={{
          background: focused
            ? "rgba(0,174,239,0.05)"
            : "rgba(255,255,255,0.03)",
        }}
      >
        {children}
        <div
          className={`pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-700 ${
            focused && isLampOn ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(0,174,239,0.08) 0%, transparent 70%)",
          }}
        />
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-red-400"
        >
          {t(error)}
        </motion.p>
      )}
    </motion.div>
  );
}
