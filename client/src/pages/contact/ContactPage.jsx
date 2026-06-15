import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useState } from "react";
import { Send, CheckCircle, MessageCircle, Mail, MapPin, Clock, ArrowRight, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { submitContact } from "../../api/contact";

const INSTAGRAM_URL = "https://www.instagram.com/ste_2m/";
function InstagramIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

const infoCards = [
  { icon: MessageCircle, labelKey: "contact.phone", value: "+212 663-460466" },
  { icon: Mail, labelKey: "contact.email", value: "contact@growstack.com" },
  { icon: MapPin, labelKey: "contact.address", value: "Casablanca, Maroc" },
  { icon: Clock, labelKey: "contact.availability", value: "Lun-Ven 9h-19h" },
  { icon: InstagramIcon, labelKey: "contact.instagram", value: "@ste_2m", isExternal: true },
];

export default function ContactPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = t("validation.required");
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = t("validation.invalidEmail");
    if (!form.subject.trim()) e.subject = t("validation.required");
    if (!form.message.trim()) e.message = t("validation.required");
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSubmitting(true);
    try {
      await submitContact(form);
      setSubmitted(true);
    } catch (err) {
      setServerError(err.message || "Failed to send message");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  if (submitted) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 pb-20">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-lg mx-auto">
          <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-indigo-100/60 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-indigo-600" />
          </div>
          <h2 className="text-4xl font-black mb-4 text-slate-900">{t("contact.successTitle")}</h2>
          <p className="text-slate-500 mb-8">{t("contact.successDescription")}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/" className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 font-medium px-6 py-3 rounded-full text-sm hover:bg-slate-200 transition-colors">{t("contact.backToHome")}</Link>
            <Link to="/services" className="inline-flex items-center gap-2 bg-indigo-600 text-white font-bold px-6 py-3 rounded-full text-sm transition-all shadow-md hover:shadow-md">{t("contact.seeServices")}<ArrowRight className="w-4 h-4" /></Link>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-600 mb-4">{t("contact.pretitle")}</p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4 text-slate-900">{t("contact.title")}</h1>
        <p className="max-w-2xl mx-auto text-slate-500">{t("contact.description")}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 items-start">
        <div className="space-y-4">
          {infoCards.map((item, i) => {
            const Icon = item.icon;
            const isInstagram = item.isExternal;
            const content = (
              <motion.div key={item.label} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                className={`flex items-center gap-4 p-5 rounded-2xl border border-slate-100 bg-slate-50 transition-all duration-300 group ${isInstagram ? "hover:border-[#E1306C]/30 hover:bg-[#E1306C]/[0.02]" : "hover:bg-slate-100"}`}>
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ${isInstagram ? "bg-[#E1306C]/10 border-[#E1306C]/20 text-[#E1306C]" : "bg-indigo-100 border-indigo-200 text-indigo-600"}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{t(item.labelKey)}</p>
                  <p className={`text-base font-semibold ${isInstagram ? "text-[#E1306C]" : "text-slate-900"}`}>{isInstagram ? "@ste_2m" : item.value}</p>
                </div>
              </motion.div>
            );
            return isInstagram ? <a key={item.label} href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">{content}</a> : content;
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl border border-slate-200 bg-white p-8 shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            {serverError && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <p className="text-xs text-red-400">{serverError}</p>
              </div>
            )}
            <div className="grid gap-6 sm:grid-cols-2">
              <Field label={t("contact.fullName")} value={form.name} onChange={handleChange("name")} error={errors.name} placeholder={t("contact.namePlaceholder")} />
              <Field label={t("contact.email")} type="email" value={form.email} onChange={handleChange("email")} error={errors.email} placeholder={t("contact.emailPlaceholder")} />
            </div>
            <Field label={t("contact.subject")} value={form.subject} onChange={handleChange("subject")} error={errors.subject} placeholder={t("contact.subjectPlaceholder")} />
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">{t("contact.message")}</label>
              <textarea value={form.message} onChange={handleChange("message")} rows={5} placeholder={t("contact.messagePlaceholder")}
                className={`w-full rounded-xl bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 border ${errors.message ? "border-red-500/50" : "border-slate-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"}`} />
              {errors.message && <p className="mt-1 text-xs text-red-400">{errors.message}</p>}
            </div>
            <button type="submit" disabled={submitting}
              className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white font-bold py-4 rounded-xl text-sm uppercase tracking-widest shadow-md transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? (
                <span className="w-5 h-5 border-2 border-indigo-300 border-t-white rounded-full animate-spin" />
              ) : (
                <>{t("contact.send")}<Send className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

function Field({ label, type = "text", value, onChange, error, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-2">{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        className={`w-full rounded-xl bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all duration-200 border ${error ? "border-red-500/50" : "border-slate-200 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400"}`} />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
