import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Check, Shirt } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCart } from "../../context/CartContext";

const PHASE_DROP = "drop";
const PHASE_CATCH = "catch";
const PHASE_SUCCESS = "success";
const PHASE_IDLE = "idle";

const accentMap = {
  cyan: { borderGlow: "group-hover:border-cyan-300" },
  blue: { borderGlow: "group-hover:border-blue-300" },
  purple: { borderGlow: "group-hover:border-purple-300" },
  orange: { borderGlow: "group-hover:border-orange-400" },
  slate: { borderGlow: "group-hover:border-slate-400" },
  violet: { borderGlow: "group-hover:border-violet-400" },
};

const iconProps = {
  strokeWidth: 2.5,
  strokeLinecap: "square",
  strokeLinejoin: "miter",
};

export default function NikeServiceCard({ service, inCart, onAddToCart }) {
  const { t } = useTranslation();
  const { setIsCartOpen } = useCart();
  const [phase, setPhase] = useState(PHASE_IDLE);
  const timers = useRef([]);
  const addingRef = useRef(false);

  const accent = accentMap[service.accent] || accentMap.cyan;
  const IconComponent = service.icon;

  useEffect(() => {
    return () => timers.current.forEach(clearTimeout);
  }, []);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const handleAddToCart = () => {
    if (inCart) {
      setIsCartOpen(true);
      return;
    }
    if (addingRef.current) return;
    addingRef.current = true;
    clearTimers();
    onAddToCart(service);
    setPhase(PHASE_DROP);
    timers.current.push(setTimeout(() => setPhase(PHASE_CATCH), 420));
    timers.current.push(setTimeout(() => setPhase(PHASE_SUCCESS), 720));
    timers.current.push(setTimeout(() => {
      setPhase(PHASE_IDLE);
      addingRef.current = false;
    }, 3000));
  };

  return (
    <div className="group relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden border-2 border-black bg-white">
      {/* Watermark — fades & scales out on hover */}
      <span className="absolute inset-0 flex items-center justify-center text-[7rem] sm:text-[9rem] lg:text-[10rem] font-black italic text-black/[0.04] select-none transition-all duration-700 group-hover:opacity-0 group-hover:scale-125 pointer-events-none">
        {t(service.watermarkKey)}
      </span>

      {/* Central visual — slides up and shrinks on hover */}
      <div className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-out group-hover:-translate-y-12 group-hover:scale-[0.85]">
        {service.image ? (
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 border-2 border-black overflow-hidden transition-all duration-500 ease-out group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <img
              src={service.image}
              alt={t(service.titleKey)}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 border-2 border-black transition-all duration-500 ease-out group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {typeof IconComponent === "function" ? (
              <IconComponent size={52} className="text-slate-900 group-hover:text-orange-500 transition-colors duration-300" {...iconProps} />
            ) : (
              <IconComponent />
            )}
          </div>
        )}
      </div>

      {/* Title — slides down and fades on hover */}
      <h3 className="absolute bottom-6 left-6 right-6 text-xl sm:text-2xl font-bold text-black transition-all duration-500 ease-out group-hover:opacity-0 group-hover:translate-y-6">
        {t(service.titleKey)}
      </h3>

      {/* Bottom panel — hidden by default, slides up on hover */}
      <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
        <div className="bg-white p-5 space-y-3 border-t-2 border-black">
          <p className="text-xs sm:text-sm text-black/70 leading-relaxed line-clamp-3">
            {t(service.descKey)}
          </p>

          <ul className="space-y-1">
            {service.features.map((fk) => (
              <li key={fk} className="flex items-start gap-2">
                <Check size={13} className="text-black mt-0.5 shrink-0" {...iconProps} />
                <span className="text-xs text-black/60">{t(fk)}</span>
              </li>
            ))}
          </ul>

          {/* ── Animated Add to Cart Button ── */}
          <div className="h-11">
            <button
              onClick={handleAddToCart}
              className="relative w-full h-full border-2 border-black bg-black text-white overflow-hidden cursor-pointer"
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
                        <Check size={15} {...iconProps} />
                        <span className="text-[11px] font-bold tracking-widest uppercase">
                          {t("premium_in_cart")}
                        </span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={15} {...iconProps} />
                        <span className="text-[11px] font-bold tracking-widest uppercase">
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
                    transition={{ duration: 0.1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <motion.span
                      initial={{ y: -60, opacity: 0, rotate: -15 }}
                      animate={{ y: 0, opacity: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 12, mass: 0.7 }}
                    >
                      <Shirt size={20} {...iconProps} />
                    </motion.span>
                  </motion.span>
                )}

                {phase === PHASE_CATCH && (
                  <motion.span
                    key="catch"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    className="absolute inset-0 flex items-center justify-center gap-1.5"
                  >
                    <motion.span
                      initial={{ y: 0 }}
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                    >
                      <Shirt size={20} {...iconProps} />
                    </motion.span>
                    <motion.span
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 18 }}
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
                    transition={{ duration: 0.1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <motion.span
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                      <ShoppingCart size={20} className="text-green-400" {...iconProps} />
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut", delay: 0.08 }}
                      className="text-[11px] font-black tracking-widest text-green-400 ml-1.5"
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
    </div>
  );
}
