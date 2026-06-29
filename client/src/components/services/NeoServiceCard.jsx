import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check, Package, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCart } from "../../context/CartContext";

const PHASE_DROP = "drop";
const PHASE_CATCH = "catch";
const PHASE_SUCCESS = "success";
const PHASE_IDLE = "idle";

export default function NeoServiceCard({ service, onAddToCart, inCart }) {
  const { t } = useTranslation();
  const { setIsCartOpen } = useCart();
  const [phase, setPhase] = useState(PHASE_IDLE);
  const timers = useRef([]);
  const addingRef = useRef(false);

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const handleClick = () => {
    if (inCart) {
      setIsCartOpen(true);
      return;
    }
    if (addingRef.current) return;
    addingRef.current = true;
    clearTimers();
    onAddToCart(service);
    setPhase(PHASE_DROP);
    timers.current.push(setTimeout(() => setPhase(PHASE_CATCH), 480));
    timers.current.push(setTimeout(() => setPhase(PHASE_SUCCESS), 780));
    timers.current.push(setTimeout(() => {
      setPhase(PHASE_IDLE);
      addingRef.current = false;
    }, 3500));
  };

  const price =
    typeof service.price === "number"
      ? service.price
      : parseInt(String(service.price ?? "0").replace(/[^0-9]/g, ""), 10) || 0;

  const formattedPrice = new Intl.NumberFormat("fr-FR").format(price);

  const Icon = service.icon;

  const iconProps = {
    strokeWidth: 2.5,
    strokeLinecap: "square",
    strokeLinejoin: "miter",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
    >
      <div className="border-2 border-black bg-white">
        <div className="p-6 flex flex-col h-full justify-between gap-4">
          {/* Icon + Popular badge */}
          <div className="flex items-start justify-between gap-3">
            {typeof Icon === "function" ? (
              <div className="w-12 h-12 border-2 border-black flex items-center justify-center bg-neutral-50 shrink-0">
                <Icon size={22} {...iconProps} />
              </div>
            ) : (
              <div className="w-12 h-12 border-2 border-black flex items-center justify-center text-xl bg-neutral-50 shrink-0">
                {Icon}
              </div>
            )}
            {service.popular && (
              <span className="flex items-center gap-1 px-2 py-0.5 border-2 border-black bg-black text-[#ffffff] text-[9px] font-bold uppercase tracking-widest shrink-0">
                <Sparkles size={10} {...iconProps} />
                {t("neo_card_popular")}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-black tracking-tight text-black leading-tight">
            {service.title}
          </h3>

          {/* Price */}
          <div className="text-2xl font-black text-black">
            {formattedPrice}
          </div>

          {/* Description */}
          {service.description && (
            <p className="text-sm text-black/60 leading-relaxed line-clamp-2">
              {service.description}
            </p>
          )}

          {/* Features */}
          {service.features?.length > 0 && (
            <ul className="space-y-1.5">
              {service.features.slice(0, 3).map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check size={13} className="text-black mt-0.5 shrink-0" {...iconProps} />
                  <span className="text-black/60">{f}</span>
                </li>
              ))}
              {service.features.length > 3 && (
                <li className="text-xs font-bold text-black/40 tracking-wider uppercase pl-5">
                  +{service.features.length - 3} {t("neo_card_features")}
                </li>
              )}
            </ul>
          )}

          {/* ── Animated Add to Cart Button ── */}
          <div className="h-12">
            <button
              onClick={handleClick}
              className="relative w-full h-full border-2 border-black bg-black text-[#ffffff] overflow-hidden cursor-pointer"
            >
              <AnimatePresence mode="wait" initial={false}>
                {phase === PHASE_IDLE && (
                  <motion.span
                    key="idle"
                    exit={{ y: -50, opacity: 0 }}
                    transition={{ duration: 0.18, ease: "easeIn" }}
                    className="absolute inset-0 flex items-center justify-center gap-2"
                  >
                    {inCart ? (
                      <>
                        <Check size={16} {...iconProps} />
                        <span className="text-xs font-bold tracking-widest uppercase">
                          {t("premium_in_cart")}
                        </span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={16} {...iconProps} />
                        <span className="text-xs font-bold tracking-widest uppercase">
                          {t("premium_add_to_cart")}
                        </span>
                      </>
                    )}
                  </motion.span>
                )}

                {phase === PHASE_DROP && (
                  <motion.span
                    key="drop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <motion.span
                      initial={{ y: -50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 350, damping: 14, mass: 0.8 }}
                    >
                      <Package size={20} {...iconProps} />
                    </motion.span>
                  </motion.span>
                )}

                {phase === PHASE_CATCH && (
                  <motion.span
                    key="catch"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    className="absolute inset-0 flex items-center justify-center gap-1.5"
                  >
                    <motion.span
                      initial={{ y: 0 }}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <Package size={20} {...iconProps} />
                    </motion.span>
                    <motion.span
                      initial={{ x: -40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 16 }}
                    >
                      <ShoppingCart size={20} {...iconProps} />
                    </motion.span>
                  </motion.span>
                )}

                {phase === PHASE_SUCCESS && (
                  <motion.span
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    className="absolute inset-0 flex items-center justify-center gap-1.5"
                  >
                    <motion.span
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.35, 1] }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      <ShoppingCart size={20} {...iconProps} />
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut", delay: 0.05 }}
                      className="text-xs font-black tracking-widest"
                    >
                      {t("neo_card_added")}
                    </motion.span>
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
