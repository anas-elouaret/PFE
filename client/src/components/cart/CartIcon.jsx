import { ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { playPopSound, playHoverSound } from "../../utils/sounds";

export default function CartIcon() {
  const { getCartCount, setIsCartOpen, muted } = useCart();
  const count = getCartCount();
  const [displayedCount, setDisplayedCount] = useState(count);
  const [isBouncing, setIsBouncing] = useState(false);
  const prevCount = useRef(count);

  useEffect(() => {
    if (displayedCount === count) return;
    const direction = count > displayedCount ? 1 : -1;
    const timer = setInterval(() => {
      setDisplayedCount((prev) => {
        const next = prev + direction;
        if ((direction > 0 && next >= count) || (direction < 0 && next <= count)) {
          clearInterval(timer);
          return count;
        }
        return next;
      });
    }, 25);
    return () => clearInterval(timer);
  }, [count, displayedCount]);

  useEffect(() => {
    if (count !== prevCount.current) {
      if (count > prevCount.current) {
        setIsBouncing(true);
        if (!muted) playPopSound();
        setTimeout(() => setIsBouncing(false), 500);
      }
      prevCount.current = count;
    }
  }, [count, muted]);

  return (
    <motion.button
      onClick={() => setIsCartOpen(true)}
      onMouseEnter={() => { if (!muted) playHoverSound(); }}
      className="relative p-2 rounded-lg text-slate-700 hover:text-indigo-600 hover:bg-slate-50 transition-all duration-200"
      whileTap={{ scale: 0.9 }}
    >
      <ShoppingCart size={18} strokeWidth={1.75} />

      {count > 0 && (
        <motion.span
          className="absolute -top-1 -right-1 flex items-center justify-center h-4.5 w-4.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full"
          animate={{ scale: isBouncing ? [1, 1.3, 1] : 1 }}
          key={count}
          initial={{ scale: 0, y: -10, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0, y: 10, opacity: 0 }}
        >
          {displayedCount}
        </motion.span>
      )}
    </motion.button>
  );
}
