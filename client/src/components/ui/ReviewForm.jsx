import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StarRating from "./StarRating";
import { Send, CheckCircle, AlertCircle, User, Mail, MessageSquare } from "lucide-react";

export default function ReviewForm() {
  const [form, setForm] = useState({ name: "", email: "", rating: 0, comment: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const errs = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = "Name must be at least 2 characters";
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Invalid email address";
    if (form.rating === 0) errs.rating = "Please select a rating";
    if (!form.comment.trim() || form.comment.trim().length < 10) errs.comment = "Review must be at least 10 characters";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const { submitReview } = await import("../../services/reviewApi");
      await submitReview(form);
      setSuccess(true);
      setForm({ name: "", email: "", rating: 0, comment: "" });
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-[#00AEEF]/20 bg-gradient-to-b from-[#00AEEF]/5 to-transparent p-10 text-center"
      >
        <div className="w-16 h-16 rounded-full bg-[#00AEEF]/10 border border-[#00AEEF]/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-[#00AEEF]" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
        <p className="text-zinc-400 text-sm max-w-md mx-auto mb-6">
          Your review has been submitted successfully and is pending moderation. We appreciate your feedback!
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSuccess(false)}
          className="px-6 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-sm font-medium text-zinc-300 hover:text-white transition-all"
        >
          Submit Another Review
        </motion.button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {serverError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{serverError}</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
            <User className="w-3 h-3" />
            Full Name
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="John Doe"
            className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-all ${
              errors.name ? "border-red-500/40 focus:ring-red-500/40" : "border-white/[0.08] focus:ring-[#00AEEF]/40 focus:border-[#00AEEF]/30"
            }`}
          />
          {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
            <Mail className="w-3 h-3" />
            Email Address
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="john@example.com"
            className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-all ${
              errors.email ? "border-red-500/40 focus:ring-red-500/40" : "border-white/[0.08] focus:ring-[#00AEEF]/40 focus:border-[#00AEEF]/30"
            }`}
          />
          {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Rating</label>
        <div className="flex items-center gap-1 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <StarRating rating={form.rating} size="xl" interactive onChange={(v) => setForm({ ...form, rating: v })} showValue />
        </div>
        {errors.rating && <p className="text-xs text-red-400 mt-1">{errors.rating}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
          <MessageSquare className="w-3 h-3" />
          Your Review
        </label>
        <textarea
          value={form.comment}
          onChange={(e) => setForm({ ...form, comment: e.target.value })}
          placeholder="Share your experience working with us..."
          rows={4}
          className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-1 transition-all resize-none ${
            errors.comment ? "border-red-500/40 focus:ring-red-500/40" : "border-white/[0.08] focus:ring-[#00AEEF]/40 focus:border-[#00AEEF]/30"
          }`}
        />
        {errors.comment && <p className="text-xs text-red-400 mt-1">{errors.comment}</p>}
      </div>

      <motion.button
        type="submit"
        disabled={submitting}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#00AEEF] to-[#33C8FF] text-white font-bold px-8 py-4 rounded-xl text-sm uppercase tracking-widest shadow-lg shadow-[#00AEEF]/20 hover:shadow-[#00AEEF]/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Submitting...
          </span>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Submit Review
          </>
        )}
      </motion.button>
    </form>
  );
}
