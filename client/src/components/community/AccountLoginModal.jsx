import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { X, LogIn, UserPlus, Building2, Briefcase, Sparkles, Check, UploadCloud } from "lucide-react";
import { useCommunityAuth } from "../../context/CommunityAuthContext";
import { useAuth } from "../../context/AuthContext";
import { fileToDataURL, initialsAvatar } from "../../utils/communityStorage";
import Button from "../ui/Button";

const INDUSTRY_OPTIONS = [
  "ecommerce", "technology", "fashion",
  "food", "health", "realestate", "b2b", "other",
];

export default function AccountLoginModal({ isOpen, onClose, onAuthed }) {
  const { t } = useTranslation();
  const community = useCommunityAuth();
  const { user: realUser } = useAuth();
  const [tab, setTab] = useState("signin");
  const [form, setForm] = useState({
    name: "",
    email: "",
    companyName: "",
    industry: "technology",
    avatar: null,
  });
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const reset = () => {
    setTab("signin");
    setForm({ name: "", email: "", companyName: "", industry: "technology", avatar: null });
    setErrors({});
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await fileToDataURL(file);
    setForm((prev) => ({ ...prev, avatar: url }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = t("validation.required");
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    if (!form.email.trim()) e.email = t("validation.required");
    else if (!emailOk) e.email = t("validation.invalidEmail");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = () => {
    if (!validate()) return;
    community.signup(form);
    onAuthed?.();
    onClose();
    reset();
  };

  const handleLogin = (accountId) => {
    community.loginAs(accountId);
    onAuthed?.();
    onClose();
    reset();
  };

  const handleSimulate = () => {
    community.simulateClient();
    onAuthed?.();
    onClose();
    reset();
  };

  const avatarSrc = form.avatar || initialsAvatar(form.name || "?");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleClose}
          className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-12"
        >
          <div className="absolute inset-0 bg-black/60" />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg border border-slate-200 bg-white shadow-xl flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-bold text-slate-900">
                {tab === "signin" ? t("community.accountTitle") : t("community.createAccountTitle")}
              </h2>
              <button
                onClick={handleClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="grid grid-cols-2 border-b border-slate-200">
              {[
                { id: "signin", label: t("community.signinTab") },
                { id: "create", label: t("community.createTab") },
              ].map((tb) => (
                <button
                  key={tb.id}
                  onClick={() => setTab(tb.id)}
                  className={`flex items-center justify-center gap-2 py-3 text-sm font-bold transition-colors ${
                    tab === tb.id
                      ? "text-orange-600 bg-orange-50 border-b-2 border-orange-500"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {tb.id === "signin" ? <LogIn size={16} /> : <UserPlus size={16} />}
                  {tb.label}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1 px-5 py-4">
              {tab === "signin" ? (
                <div className="space-y-4">
                  {realUser && (
                    <button
                      onClick={() =>
                        handleLogin(
                          community.accounts.find(
                            (a) => a.email?.toLowerCase() === realUser.email?.toLowerCase()
                          )?.id || null
                        )
                      }
                      className="w-full flex items-center gap-3 border border-orange-500 bg-orange-50 px-4 py-3 hover:bg-orange-100 transition-colors"
                    >
                      <div className="w-9 h-9 flex items-center justify-center bg-orange-500 text-white text-sm font-bold uppercase shrink-0">
                        {(realUser.name || realUser.email || "U")[0]}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-bold text-slate-900 truncate">{realUser.name}</p>
                        <p className="text-xs text-slate-500 truncate">
                          {realUser.email} · {t("community.linkedClient")}
                        </p>
                      </div>
                      <LogIn size={16} className="text-orange-600 shrink-0" />
                    </button>
                  )}

                  <Button variant="primary" onClick={handleSimulate} className="w-full">
                    <Sparkles size={16} />
                    {t("community.simulateClient")}
                  </Button>

                  <div className="flex items-center gap-3">
                    <span className="h-px flex-1 bg-slate-200" />
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {t("community.or")}
                    </span>
                    <span className="h-px flex-1 bg-slate-200" />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      {t("community.pickAccount")}
                    </p>
                    {community.accounts.slice(0, 12).map((account) => (
                      <button
                        key={account.id}
                        onClick={() => handleLogin(account.id)}
                        className="w-full flex items-center gap-3 border border-slate-200 px-4 py-3 hover:border-orange-500 hover:bg-orange-50 transition-colors"
                      >
                        <img
                          src={account.avatar}
                          alt={account.name}
                          className="w-9 h-9 object-cover border border-slate-200 shrink-0"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = initialsAvatar(account.name);
                          }}
                        />
                        <div className="flex-1 min-w-0 text-left">
                          <p className="text-sm font-bold text-slate-900 truncate">{account.name}</p>
                          <p className="text-xs text-slate-500 truncate">
                            {account.role}
                            {account.companyName ? ` @ ${account.companyName}` : ""}
                          </p>
                        </div>
                        <LogIn size={15} className="text-slate-300 group-hover:text-orange-500 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Avatar */}
                  <div className="flex items-center gap-4">
                    <img
                      src={avatarSrc}
                      alt={form.name || "Avatar"}
                      className="w-16 h-16 object-cover border-2 border-slate-200"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = initialsAvatar(form.name || "?");
                      }}
                    />
                    <div className="flex-1">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatar}
                        className="hidden"
                        id="community-avatar-input"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full sm:w-auto"
                      >
                        <UploadCloud size={15} />
                        {form.avatar ? t("community.changePhoto") : t("community.uploadPhoto")}
                      </Button>
                      <p className="text-[11px] text-slate-400 mt-1.5">
                        {t("community.avatarHint")}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      {t("community.name")} *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      placeholder={t("community.namePlaceholder")}
                      className={`w-full rounded-lg bg-white border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-all ${
                        errors.name ? "border-red-400" : ""
                      }`}
                    />
                    {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      {t("community.email")} *
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder={t("community.emailPlaceholder")}
                      className={`w-full rounded-lg bg-white border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-all ${
                        errors.email ? "border-red-400" : ""
                      }`}
                    />
                    {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-1.5">
                        <Building2 size={14} className="text-orange-500" />
                        {t("getStarted.companyName")}
                      </label>
                      <input
                        type="text"
                        value={form.companyName}
                        onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))}
                        placeholder={t("getStarted.companyNamePlaceholder")}
                        className="w-full rounded-lg bg-white border border-slate-200 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-1.5">
                        <Briefcase size={14} className="text-orange-500" />
                        {t("getStarted.industry")}
                      </label>
                      <select
                        value={form.industry}
                        onChange={(e) => setForm((p) => ({ ...p, industry: e.target.value }))}
                        className="w-full rounded-lg bg-white border border-slate-200 px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-orange-500 transition-all"
                      >
                        {INDUSTRY_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {t(`getStarted.industry_options_${opt}`)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Button variant="primary" onClick={handleSignup} className="w-full">
                    <Check size={16} />
                    {t("community.createAccount")}
                  </Button>
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="border-t border-slate-200 px-5 py-3">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {tab === "signin"
                  ? t("community.accountHintSignin")
                  : t("community.accountHintCreate")}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}