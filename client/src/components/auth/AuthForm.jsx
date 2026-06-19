import { useTranslation } from "react-i18next";

export default function AuthForm({
  mode,
  formData,
  onInputChange,
  onSubmit,
  onModeChange,
  loading,
  error,
  status,
}) {
  const { t } = useTranslation();
  const isSignup = mode === "signup";

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-50">
          {t(isSignup ? "auth.register.title" : "auth.login.title")}
        </h1>
        <div className="mt-2 w-10 h-1 bg-orange-500 rounded-none" />
        <p className="mt-3 text-sm text-slate-400">
          {t(isSignup ? "auth.register.subtitle" : "auth.login.subtitle")}
        </p>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-1 rounded-none bg-slate-950 p-1 border border-slate-800">
        <button
          type="button"
          onClick={() => onModeChange("signin")}
          className={`rounded-none px-4 py-2.5 text-sm font-medium transition ${
            !isSignup ? "bg-slate-900 text-slate-50 border border-slate-800" : "text-slate-400 hover:text-slate-50 hover:bg-slate-900"
          }`}
        >
          {t("auth.login.btn")}
        </button>
        <button
          type="button"
          onClick={() => onModeChange("signup")}
          className={`rounded-none px-4 py-2.5 text-sm font-medium transition ${
            isSignup ? "bg-slate-900 text-slate-50 border border-slate-800" : "text-slate-400 hover:text-slate-50 hover:bg-slate-900"
          }`}
        >
          {t("auth.register.btn")}
        </button>
      </div>

      {status && !error && (
        <p className="mb-4 rounded-none bg-slate-900 border border-slate-800 px-4 py-3 text-sm text-slate-300">
          {status}
        </p>
      )}

      {error && (
        <p className="mb-4 rounded-none border border-red-500/20 bg-red-900 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {isSignup && (
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-slate-600 uppercase tracking-wide">
              {t("auth.register.name")}
            </label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={onInputChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-0"
              required
            />
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-600 uppercase tracking-wide">
            {t("auth.login.email")}
          </label>
          <input
            type="email"
            name="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={onInputChange}
            className="w-full rounded-none border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-50 outline-none transition placeholder:text-slate-500 focus:border-orange-500 focus:ring-0"
            required
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-semibold text-slate-400 uppercase tracking-wide">
            {t("auth.login.password")}
          </label>
          <input
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={onInputChange}
            className="w-full rounded-none border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-50 outline-none transition placeholder:text-slate-500 focus:border-orange-500 focus:ring-0"
            required
            minLength={6}
          />
        </div>

        {isSignup && (
          <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-400">
            <input
              type="checkbox"
              className="mt-0.5 h-4 w-4 rounded-none border-slate-700 bg-slate-900 text-orange-400 focus:ring-orange-500/20"
              required
            />
            <span>
              J&apos;accepte les conditions d&apos;utilisation et la politique de confidentialité.
            </span>
          </label>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-none bg-orange-500 px-4 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? t("common.loading") : t(isSignup ? "auth.register.btn" : "auth.login.btn")}
        </button>
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-slate-500">
          {t(isSignup ? "auth.register.hasAccount" : "auth.login.noAccount")}{" "}
          <button
            type="button"
            onClick={() => onModeChange(isSignup ? "signin" : "signup")}
            className="font-semibold text-orange-400 hover:underline"
          >
            {t(isSignup ? "auth.register.signIn" : "auth.register.btn")}
          </button>
        </p>
      </div>
    </div>
  );
}
