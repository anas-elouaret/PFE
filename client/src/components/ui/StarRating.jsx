import { motion } from "framer-motion";

export default function StarRating({ rating = 0, size = "md", interactive = false, onChange, showValue = false, className = "" }) {
  const sizes = {
    sm: "w-3.5 h-3.5",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-8 h-8",
  };

  const starSize = sizes[size] || sizes.md;

  if (interactive) {
    return (
      <div className={`flex items-center gap-0.5 ${className}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            type="button"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onChange?.(star)}
            className="p-0.5 focus:outline-none"
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            <svg className={`${starSize} transition-colors duration-200 ${star <= rating ? "text-[#00AEEF]" : "text-zinc-600"}`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </motion.button>
        ))}
        {showValue && rating > 0 && (
          <span className="ml-2 text-xs font-bold text-zinc-400">{rating}/5</span>
        )}
      </div>
    );
  }

  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {[...Array(fullStars)].map((_, i) => (
        <svg key={`full-${i}`} className={`${starSize} text-[#00AEEF]`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      {hasHalf && (
        <svg className={starSize} viewBox="0 0 24 24">
          <defs>
            <linearGradient id="halfGrad">
              <stop offset="50%" stopColor="#00AEEF" />
              <stop offset="50%" stopColor="#27272a" />
            </linearGradient>
          </defs>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="url(#halfGrad)" />
        </svg>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <svg key={`empty-${i}`} className={`${starSize} text-zinc-600`} viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      {showValue && rating > 0 && (
        <span className="ml-2 text-xs font-bold text-[#00AEEF]">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
