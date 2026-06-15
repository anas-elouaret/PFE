import { useTranslation } from "react-i18next";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { playClickSound, playHoverSound } from "../../utils/sounds";

export default function AddToCartButton({ item, className = "" }) {
  const { t } = useTranslation();
  const { addToCart, setIsCartOpen, setFlyingItem, muted } = useCart();
  const [showFeedback, setShowFeedback] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);
  const buttonRef = useRef();

  const handleAddToCart = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    setFlyingItem({ image: item.serviceImage || item.image, startRect: rect });
    if (!muted) playClickSound();
    addToCart(item);
    setIsCartOpen(true);
    setShowFeedback(true);
    setIsPulsing(true);

    setTimeout(() => {
      setShowFeedback(false);
      setIsPulsing(false);
    }, 2000);
  };

  return (
    <div className="relative">
      <motion.button
        ref={buttonRef}
        onClick={handleAddToCart}
        onMouseEnter={() => { if (!muted) playHoverSound(); }}
        className={`relative overflow-hidden inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white rounded-full border border-white/20 bg-black/20 backdrop-blur-md shadow-lg ${className}`}
        animate={{
          y: [0, -3, 0],
          boxShadow: [
            "0 0 20px rgba(147, 51, 234, 0.5)",
            "0 0 25px rgba(59, 130, 246, 0.5)",
            "0 0 20px rgba(147, 51, 234, 0.5)"
          ]
        }}
        whileHover={{
          scale: 1.05,
          boxShadow: "0 0 30px rgba(147, 51, 234, 0.8), 0 0 40px rgba(59, 130, 246, 0.6)"
        }}
        whileTap={{ scale: 0.95 }}
        transition={{
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
        style={{
          willChange: "transform, box-shadow"
        }}
      >
        {/* Gradient Sweep */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 4, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
        />

        {/* Pulse Animation */}
        {isPulsing && (
          <motion.div
            className="absolute inset-0 rounded-full bg-purple-500/30"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 0.6, repeat: 2 }}
          />
        )}

        {/* Subtle Particles */}
        <motion.div
          className="absolute top-1 left-2 w-1 h-1 bg-white/60 rounded-full"
          animate={{
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: 0.5
          }}
        />
        <motion.div
          className="absolute bottom-1 right-2 w-0.5 h-0.5 bg-blue-400/60 rounded-full"
          animate={{
            opacity: [0, 1, 0],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: 1
          }}
        />

        <ShoppingCart size={16} />
        {t("serviceCard.addToCart")}
      </motion.button>

      {showFeedback && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded whitespace-nowrap shadow-lg"
        >
          {t("serviceCard.addedToCart")}
        </motion.span>
      )}
    </div>
  );
}
