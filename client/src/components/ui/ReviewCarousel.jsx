import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReviewCard from "./ReviewCard";
import StarRating from "./StarRating";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

export default function ReviewCarousel({ reviews = [], stats = { averageRating: 0, totalReviews: 0 }, onLike }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const intervalRef = useRef(null);

  const itemsPerView = 3;
  const totalSlides = Math.max(1, Math.ceil(reviews.length / itemsPerView));
  const maxStart = Math.max(0, reviews.length - itemsPerView);

  const paginatedReviews = [];
  for (let i = 0; i < reviews.length; i += itemsPerView) {
    paginatedReviews.push(reviews.slice(i, i + itemsPerView));
  }

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % paginatedReviews.length);
  }, [paginatedReviews.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + paginatedReviews.length) % paginatedReviews.length);
  }, [paginatedReviews.length]);

  useEffect(() => {
    if (paginatedReviews.length <= 1) return;
    intervalRef.current = setInterval(next, 5000);
    return () => clearInterval(intervalRef.current);
  }, [next, paginatedReviews.length]);

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  const dotCount = paginatedReviews.length;

  if (!reviews.length) {
    return (
      <div className="text-center py-20">
        <Quote className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
        <p className="text-zinc-500 font-medium">No reviews yet. Be the first to leave a review!</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Stats Header */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <StarRating rating={stats.averageRating} size="lg" />
          </div>
          <span className="text-3xl font-black text-white">{stats.averageRating.toFixed(1)}</span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <div className="text-center">
            <span className="block text-2xl font-bold text-white">{stats.totalReviews}</span>
            <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Reviews</span>
          </div>
          <div className="w-px h-10 bg-white/[0.06]" />
          <div className="text-center">
            <span className="block text-2xl font-bold text-white">{stats.averageRating >= 4.5 ? "Excellent" : stats.averageRating >= 4 ? "Great" : stats.averageRating >= 3 ? "Good" : "Average"}</span>
            <span className="text-zinc-500 text-xs font-medium uppercase tracking-wider">Rating</span>
          </div>
        </div>
      </div>

      {/* Rating distribution */}
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {[5, 4, 3, 2, 1].map((star) => (
          <div key={star} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
            <Star className="w-3 h-3 text-[#00AEEF] fill-[#00AEEF]" />
            <span className="text-xs font-bold text-zinc-300">{star}</span>
            <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00AEEF] to-[#0095D4] rounded-full transition-all duration-500"
                style={{ width: `${stats.totalReviews > 0 ? ((stats.distribution?.[star - 1] || 0) / stats.totalReviews) * 100 : 0}%` }}
              />
            </div>
            <span className="text-[10px] text-zinc-600 w-6 text-right">{stats.distribution?.[star - 1] || 0}</span>
          </div>
        ))}
      </div>

      {/* Carousel */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {paginatedReviews[current]?.map((review) => (
              <ReviewCard key={review._id} review={review} onLike={onLike} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      {dotCount > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={prev}
            className="w-10 h-10 rounded-full border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>

          <div className="flex items-center gap-2">
            {Array.from({ length: dotCount }).map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                className={`transition-all duration-300 rounded-full ${i === current ? "w-6 h-2 bg-gradient-to-r from-[#00AEEF] to-[#33C8FF]" : "w-2 h-2 bg-white/[0.12] hover:bg-white/[0.2]"}`}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={next}
            className="w-10 h-10 rounded-full border border-white/[0.08] bg-white/[0.03] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>
      )}
    </div>
  );
}
