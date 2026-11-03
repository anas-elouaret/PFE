import { useState } from "react";
import { Star, X, Send, CheckCircle2, AlertCircle, BadgeCheck } from "lucide-react";
import { submitReview } from "../../services/reviewApi";
import { invalidateServiceRatings } from "../../hooks/useServiceRatings";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Read-only stars for an average value, filled by proportion. */
function Stars({ value = 0, size = "w-4 h-4" }) {
  return (
    <span className="flex items-center gap-0.5" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${size} ${
            star <= Math.round(value) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"
          }`}
        />
      ))}
    </span>
  );
}

function RateModal({ service, onClose }) {
  const [rating, setRating] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", comment: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState("");

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!rating) next.rating = "Choisissez une note.";
    if (!form.name.trim()) next.name = "Votre nom est requis.";
    if (!EMAIL_REGEX.test(form.email.trim())) next.email = "Email invalide.";
    if (form.comment.trim().length < 10) next.comment = "Au moins 10 caractères.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      await submitReview({
        name: form.name.trim(),
        email: form.email.trim(),
        rating,
        comment: form.comment.trim(),
        serviceId: service.id,
        serviceTitle: service.title,
      });
      invalidateServiceRatings();
      setDone(true);
    } catch (err) {
      setServerError(err.message || "L'envoi a échoué. Réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Noter ${service.title}`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-6 shadow-xl sm:rounded-2xl"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-lg font-black text-slate-900">Noter ce service</h2>
            <p className="truncate text-sm text-slate-500">{service.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {done ? (
          <div className="py-6 text-center">
            <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-emerald-500" />
            <p className="text-base font-bold text-slate-900">Merci !</p>
            <p className="mt-1 text-sm text-slate-500">
              Votre avis sera publié après vérification.
            </p>
            <button
              onClick={onClose}
              className="mt-5 w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <span className="mb-2 block text-sm font-medium text-slate-700">Votre note</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => {
                      setRating(star);
                      setErrors((prev) => ({ ...prev, rating: "" }));
                    }}
                    aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
                    aria-pressed={rating === star}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= rating ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {errors.rating && <p className="mt-1 text-xs text-red-600">{errors.rating}</p>}
            </div>

            <div>
              <label htmlFor="rate-name" className="mb-1.5 block text-sm font-medium text-slate-700">
                Nom
              </label>
              <input
                id="rate-name"
                value={form.name}
                onChange={update("name")}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="rate-email" className="mb-1.5 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="rate-email"
                type="email"
                value={form.email}
                onChange={update("email")}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
              />
              <p className="mt-1 text-xs text-slate-400">
                Utilisé pour vérifier l'avis. Il n'est pas affiché sur le site.
              </p>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="rate-comment" className="mb-1.5 block text-sm font-medium text-slate-700">
                Votre avis
              </label>
              <textarea
                id="rate-comment"
                rows={4}
                value={form.comment}
                onChange={update("comment")}
                className="w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-400"
              />
              {errors.comment && <p className="mt-1 text-xs text-red-600">{errors.comment}</p>}
            </div>

            {serverError && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <p className="text-xs text-red-700">{serverError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-sm font-bold text-white transition-colors hover:bg-orange-600 disabled:opacity-50"
            >
              {submitting ? "Envoi…" : (<>Envoyer mon avis <Send className="h-4 w-4" /></>)}
            </button>
            <p className="text-center text-xs text-slate-400">
              Publié après vérification par l'équipe.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

/**
 * The rating line on a service card. Shows the real average when the service
 * has approved ratings, and invites the first one when it has none — it never
 * displays stars that nobody gave.
 */
export default function ServiceRating({ service, rating, compact = false }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {rating ? (
        <div className="flex flex-wrap items-center gap-2">
          <Stars value={rating.average} />
          <span className="text-sm font-bold text-slate-900">{rating.average.toFixed(1)}</span>
          <span className="text-xs text-slate-500">
            ({rating.count} avis)
          </span>
          {!compact && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="ms-auto text-xs font-semibold text-orange-600 underline-offset-2 hover:underline"
            >
              Noter
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">
          <Stars value={0} />
          <span className="text-xs text-slate-400">Pas encore d'avis</span>
          {!compact && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="ms-auto text-xs font-semibold text-orange-600 underline-offset-2 hover:underline"
            >
              Soyez le premier
            </button>
          )}
        </div>
      )}

      {open && <RateModal service={service} onClose={() => setOpen(false)} />}
    </>
  );
}

export { Stars, BadgeCheck };
