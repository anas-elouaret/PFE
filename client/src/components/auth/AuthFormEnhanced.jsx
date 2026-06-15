import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const fieldVariant = {
  hidden: { opacity: 0, y: 12 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

function validate(fields) {
  const e = {};
  if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = "auth.errors.invalidEmail";
  if (fields.password && fields.password.length < 6) e.password = "auth.errors.passwordLength";
  if (fields.name !== undefined && !fields.name.trim()) e.name = "auth.errors.required";
  return e;
}

export default function AuthFormEnhanced({
  formData, onInputChange, onSubmit, loading, isSignup, mode, onModeChange,
}) {
  const { t } = useTranslation();
  const [touched, setTouched] = useState({});
  const [focused, setFocused] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const errors = validate(formData);

  const showError = (field) => touched[field] && errors[field];

  const Field = ({ name, label, type = "text", placeholder, autoComplete, index }) => (
    <motion.div
      custom={index}
      variants={fieldVariant}
      initial="hidden"
      animate="visible"
      className="space-y-1.5"
    >
      <label
        htmlFor={name}
        className="block text-[10px] font-semibold tracking-[0.15em] text-white/35 uppercase"
      >
        {label}
      </label>
      <div
        className={`group relative overflow-hidden rounded-xl transition-all duration-500 ${
          showError(name)
            ? "ring-2 ring-red-500/40"
            : focused === name
              ? "ring-2 ring-[#00AEEF]/50"
              : "ring-1 ring-white/[0.07]"
        }`}
        style={{
          background: focused === name
            ? "linear-gradient(135deg, rgba(0,174,239,0.06), rgba(255,255,255,0.02))"
            : "rgba(255,255,255,0.025)",
        }}
      >
        <div className="relative flex items-center">
          <input
            id={name}
            name={name}
            type={name === "password" && !showPassword ? "password" : type}
            placeholder={placeholder}
            autoComplete={autoComplete}
            value={formData[name] || ""}
            onChange={onInputChange}
            onFocus={() => setFocused(name)}
            onBlur={() => {
              setFocused(null);
              setTouched((p) => ({ ...p, [name]: true }));
            }}
            className="w-full bg-transparent px-4 py-[13px] text-sm text-white outline-none placeholder:text-white/15"
          />
          {name === "password" && (
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 p-1 text-white/25 hover:text-white/60 transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Masquer" : "Afficher"}
            >
              {showPassword ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              )}
            </button>
          )}
        </div>
        <AnimatePresence>
          {focused === name && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute inset-0 rounded-xl"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 0%, rgba(0,174,239,0.06) 0%, transparent 70%)",
              }}
            />
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {showError(name) && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-[11px] text-red-400"
          >
            {t(errors[name])}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {isSignup && (
        <Field
          name="name"
          label={t("auth.register.name")}
          placeholder="votre nom"
          autoComplete="name"
          index={0}
        />
      )}

      <Field
        name="email"
        label={t("auth.login.email")}
        type="email"
        placeholder="vous@exemple.com"
        autoComplete="email"
        index={isSignup ? 1 : 0}
      />

      <Field
        name="password"
        label={t("auth.login.password")}
        placeholder="••••••••"
        autoComplete={isSignup ? "new-password" : "current-password"}
        index={isSignup ? 2 : 1}
      />

      <motion.div
        variants={fieldVariant}
        custom={isSignup ? 3 : 2}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-between"
      >
        <label className="flex cursor-pointer items-center gap-2.5 group">
          <div className="relative">
            <input
              type="checkbox"
              defaultChecked
              className="peer sr-only"
            />
            <div className="h-[18px] w-[32px] rounded-full bg-white/[0.06] ring-1 ring-white/[0.08] transition-all duration-300 peer-checked:bg-[#00AEEF]/30 peer-checked:ring-[#00AEEF]/30" />
            <div className="pointer-events-none absolute left-[3px] top-[3px] h-3 w-3 rounded-full bg-white/20 transition-all duration-300 peer-checked:translate-x-[14px] peer-checked:bg-[#00AEEF]" />
          </div>
          <span className="text-[11px] text-white/40 group-hover:text-white/60 transition-colors">
            Se souvenir de moi
          </span>
        </label>
        <button
          type="button"
          className="text-[11px] text-[#00AEEF]/60 hover:text-[#00AEEF] transition-colors"
        >
          {t("auth.login.forgotPassword")}
        </button>
      </motion.div>

      <motion.div
        variants={fieldVariant}
        custom={isSignup ? 4 : 3}
        initial="hidden"
        animate="visible"
      >
        <motion.button
          type="submit"
          disabled={loading}
          className="group relative w-full overflow-hidden rounded-xl py-3.5"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
        >
          <div
            className="absolute inset-0 rounded-xl opacity-90 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background: "linear-gradient(135deg, #00AEEF, #0095D4, #0095D4)",
              boxShadow: "0 0 40px rgba(0,174,239,0.25)",
            }}
          />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/20 to-transparent opacity-25" />
          <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: "linear-gradient(135deg, #00AEEF, #00AEEF, #0095D4)",
            }}
          />
          <span className="relative z-10 flex items-center justify-center gap-2.5 text-sm font-bold tracking-wider text-white uppercase">
            {loading ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {t("common.loading")}
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                  <polyline points="10 17 15 12 10 7"/>
                  <line x1="15" y1="12" x2="3" y2="12"/>
                </svg>
                {t("auth.login.btn")}
              </>
            )}
          </span>
        </motion.button>
      </motion.div>
    </form>
  );
}
