import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { updateProfile, changePassword } from "../../api/users";
import { Save, User, Key, AlertCircle } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }) };

export default function DashboardSettingsPage() {
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
      addToast("Enregistrer", "success");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setError("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    setSaving(true);
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      addToast("Mot de passe modifié avec succès", "success");
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
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Paramètres</h1>
        <p className="text-sm text-slate-500 mt-1">Gérez les paramètres de votre compte</p>
      </motion.div>

      {error && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mb-6 border-2 border-red-300 bg-red-50 px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <p className="text-xs text-red-600">{error}</p>
        </motion.div>
      )}

      <SettingsSection icon={User} title="Profil" custom={1}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Profil</label>
            <input type="text" value={profile.name} onChange={(e) => setProfile(p => ({ ...p, name: e.target.value }))}
              className="w-full bg-slate-50 border-2 border-black px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-orange-500 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Adresse Email</label>
            <input type="email" value={user?.email || ""} readOnly
              className="w-full bg-slate-50 border-2 border-black px-4 py-2.5 text-sm text-slate-400 placeholder-slate-400 outline-none cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Téléphone</label>
            <input type="text" value={profile.phone} onChange={(e) => setProfile(p => ({ ...p, phone: e.target.value }))}
              className="w-full bg-slate-50 border-2 border-black px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-orange-500 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Ville</label>
            <input type="text" value={profile.city} onChange={(e) => setProfile(p => ({ ...p, city: e.target.value }))}
              className="w-full bg-slate-50 border-2 border-black px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-orange-500 transition-all" />
          </div>
        </div>
        <div className="mt-4">
          <button onClick={handleProfileSave} disabled={saving}
            className="inline-flex items-center gap-2 bg-orange-500 border-2 border-orange-500 px-6 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-all disabled:opacity-50">
            <Save className="w-4 h-4" /> Enregistrer
          </button>
        </div>
      </SettingsSection>

      <SettingsSection icon={Key} title="Changer le Mot de Passe" custom={2}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Mot de Passe Actuel</label>
            <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm(p => ({ ...p, currentPassword: e.target.value }))}
              className="w-full bg-slate-50 border-2 border-black px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-orange-500 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Nouveau Mot de Passe</label>
            <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm(p => ({ ...p, newPassword: e.target.value }))}
              className="w-full bg-slate-50 border-2 border-black px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-orange-500 transition-all" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">Confirmer le Nouveau Mot de Passe</label>
            <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm(p => ({ ...p, confirmPassword: e.target.value }))}
              className="w-full bg-slate-50 border-2 border-black px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-orange-500 transition-all" />
          </div>
        </div>
        <div className="mt-4">
          <button onClick={handlePasswordChange} disabled={saving}
            className="inline-flex items-center gap-2 bg-orange-500 border-2 border-orange-500 px-6 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-all disabled:opacity-50">
            <Key className="w-4 h-4" /> Changer le Mot de Passe
          </button>
        </div>
      </SettingsSection>
    </div>
  );
}

function SettingsSection({ icon: Icon, title, custom, children }) {
  return (
    <motion.div custom={custom} variants={fadeUp} initial="hidden" animate="visible"
      className="bg-slate-50 border-2 border-black p-6 mb-6 transition-all duration-300 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-slate-100 border-2 border-black flex items-center justify-center">
          <Icon className="w-4 h-4 text-slate-600" />
        </div>
        <h2 className="text-sm font-bold text-slate-900">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}
