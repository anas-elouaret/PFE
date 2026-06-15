import { useTranslation } from "react-i18next";
import { useState } from "react";
import { submitContact } from "../../api/contact";

export default function ContactForm() {
  const { t } = useTranslation();
  const [values, setValues] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await submitContact(values);
      setSubmitted(true);
      setValues({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err.message || "Failed to send message");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-2xl sm:rounded-[2rem] border border-white/10 bg-[#0c0718]/90 p-6 sm:p-8 shadow-2xl shadow-black/30">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.32em] text-indigo-300/80">{t("contact")}</p>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold text-white">Let's start your next project.</h2>
          <p className="mt-4 text-sm leading-7 text-white/70">Tell us about your goals and we'll recommend a tailored creative solution.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-xs text-red-400">{error}</div>
          )}
          <div className="grid gap-6 sm:grid-cols-2">
            <label className="space-y-2 text-sm text-white/70">
              {t("contact.name")}
              <input type="text" name="name" value={values.name} onChange={handleChange} required
                className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10" />
            </label>
            <label className="space-y-2 text-sm text-white/70">
              {t("contact.emailLabel")}
              <input type="email" name="email" value={values.email} onChange={handleChange} required
                className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10" />
            </label>
          </div>

          <label className="space-y-2 text-sm text-white/70">
            {t("contact.subject")}
            <input type="text" name="subject" value={values.subject} onChange={handleChange} required
              className="w-full rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10" />
          </label>

          <label className="space-y-2 text-sm text-white/70">
            {t("contact.message")}
            <textarea name="message" rows="5" value={values.message} onChange={handleChange} required
              className="w-full rounded-[1.75rem] border border-white/10 bg-white/5 px-4 py-4 text-white outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10" />
          </label>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button type="submit" disabled={submitting}
              className="inline-flex items-center justify-center rounded-full bg-indigo-400 px-8 py-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#09040d] transition hover:-translate-y-0.5 hover:bg-indigo-300 disabled:opacity-50">
              {submitting ? <span className="w-5 h-5 border-2 border-[#09040d]/30 border-t-[#09040d] rounded-full animate-spin" /> : t("contact.submit")}
            </button>
            {submitted ? (
              <p className="text-sm text-emerald-300">Message sent successfully! We'll be back to you soon.</p>
            ) : (
              <p className="text-sm text-white/50">Response typically within 24 hours.</p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
