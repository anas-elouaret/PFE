import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { updateProfile, changePassword } from "../../api/users";
import { Save, User, Key, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }) };

export default function DashboardSettingsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { addToast } = useNotifications();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    city: user?.city || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileSave = async () => {
    setError("");
    setSaving(true);
    try {
      await updateProfile(profile);
      addToast(t("dashboard.settings.save"), "success");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setError("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setSaving(true);
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      addToast("Password changed successfully", "success");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 lg:p-10 max-w-4xl">
      <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
        <h1 className="text-2xl font-black text-white tracking-tight">{t("dashboard.settings.title")}</h1>
        <p className="text-sm text-zinc-500 mt-1">{t("dashboard.settings.subtitle")}</p>
      </motion.div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <p className="text-xs text-red-400">{error}</p>
        </motion.div>
      )}

      <SettingsSection icon={User} title={t("dashboard.settings.profile")} custom={1}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">{t("dashboard.settings.profile")}</label>
            <input type="text" value={profile.name} onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-[#00AEEF]/40 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">{t("contact.emailLabel")}</label>
            <input type="email" value={user?.email || ""} readOnly
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white/60 placeholder-zinc-600 outline-none cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Phone</label>
            <input type="text" value={profile.phone} onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-[#00AEEF]/40 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">City</label>
            <input type="text" value={profile.city} onChange={(e) => setProfile(p => ({ ...p, city: e.target.value }))}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-[#00AEEF]/40 transition-all" />
          </div>
        </div>
        <div className="mt-4">
          <button onClick={handleProfileSave} disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#00AEEF] px-6 py-3 text-sm font-bold text-[#000000] shadow-lg shadow-[#00AEEF]/20 hover:bg-[#0095D4] transition-all disabled:opacity-50">
            <Save className="w-4 h-4" /> {t("dashboard.settings.save")}
          </button>
        </div>
      </SettingsSection>

      <SettingsSection icon={Key} title="Change Password" custom={2}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Current Password</label>
            <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-[#00AEEF]/40 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">New Password</label>
            <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-[#00AEEF]/40 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Confirm New Password</label>
            <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-[#00AEEF]/40 transition-all" />
          </div>
        </div>
        <div className="mt-4">
          <button onClick={handlePasswordChange} disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#00AEEF] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[#00AEEF]/20 hover:bg-[#0095D4] transition-all disabled:opacity-50">
            <Key className="w-4 h-4" /> Change Password
          </button>
        </div>
      </SettingsSection>
    </div>
  );
}

function SettingsSection({ icon: Icon, title, custom, children }) {
  return (
    <motion.div custom={custom} variants={fadeUp} initial="hidden" animate="visible"
      className="rounded-2xl border border-white/[0.06] p-6 mb-6"
      style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))" }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-zinc-400" />
        </div>
        <h2 className="text-sm font-bold text-white">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}
