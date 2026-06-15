import { useState } from "react";
import { Star } from "lucide-react";

export default function NeoStarRating({ rating = 0, onChange }) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || rating);
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange?.(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="p-0.5 focus:outline-none"
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
          >
            <Star
              size={16}
              className={`transition-colors duration-150 ${
                filled ? "fill-yellow-400 text-yellow-400" : "fill-none text-slate-400"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
