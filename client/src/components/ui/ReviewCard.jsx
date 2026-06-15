import { motion } from "framer-motion";
import StarRating from "./StarRating";
import { Heart, CheckCircle, MessageSquare } from "lucide-react";

const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23525252'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

function formatDate(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;

  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function ReviewCard({ review, onLike, className = "" }) {
  const initials = review.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 transition-all duration-500 hover:border-white/[0.12] hover:shadow-lg hover:shadow-black/20 ${className}`}
    >
      <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex items-start gap-4 mb-4">
        <div className="relative shrink-0">
          {review.avatar ? (
            <img
              src={review.avatar}
              alt={review.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white/[0.08]"
              loading="lazy"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center border border-white/[0.08]">
              <span className="text-sm font-bold text-zinc-300">{initials}</span>
            </div>
          )}
          <div className="absolute -bottom-0.5 -right-0.5 w-4.5 h-4.5 bg-[#00AEEF] rounded-full border-2 border-black flex items-center justify-center">
            <CheckCircle className="w-3 h-3 text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm font-bold text-white truncate">{review.name}</h4>
            <span className="shrink-0 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-[#00AEEF]/10 text-[#00AEEF] rounded-md border border-[#00AEEF]/20">
              Verified
            </span>
          </div>
          <StarRating rating={review.rating} size="sm" />
        </div>

        <span className="shrink-0 text-[10px] font-medium text-zinc-600 mt-1">
          {formatDate(review.createdAt)}
        </span>
      </div>

      <p className="text-sm text-zinc-400 leading-relaxed mb-4 line-clamp-4">
        {review.comment}
      </p>

      <div className="flex items-center gap-4 pt-3 border-t border-white/[0.04]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onLike?.(review._id)}
          className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-[#00AEEF] transition-colors group/btn"
        >
          <Heart className="w-3.5 h-3.5 group-hover/btn:fill-[#00AEEF]/30 transition-all" />
          <span>{review.likes || 0}</span>
        </motion.button>
        <span className="flex items-center gap-1.5 text-xs font-medium text-zinc-600">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Review</span>
        </span>
      </div>
    </motion.div>
  );
}
