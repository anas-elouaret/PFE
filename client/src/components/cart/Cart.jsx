import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, ShoppingBag, Trash2, Plus, Minus, ArrowRight,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
import { Button } from "../ui";

function formatPrice(amount) {
  return new Intl.NumberFormat("fr-FR").format(Math.round(amount));
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -30, scale: 0.95 },
  visible: {
    opacity: 1, x: 0, scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  exit: {
    opacity: 0, x: 60, scale: 0.9,
    transition: { duration: 0.25, ease: "easeInOut" },
  },
};

function CartItem({ item, onRemove, onQuantityChange }) {
  const unitPrice = item.finalPrice || item.price || 0;
  const qty = item.quantity ?? 1;
  const lineTotal = unitPrice * qty;

  return (
    <motion.div
      variants={itemVariants}
      layout
      className="group relative rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(139,92,246,0.1)]"
    >
      <div className="relative p-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/20 to-cyan-600/10 border border-white/[0.06] flex items-center justify-center text-lg shrink-0">
            {item.image || item.serviceImage || "📦"}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-white truncate">
                  {item.serviceName}
                </h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  {item.category || "Service"}
                </p>
              </div>
              <button
                onClick={() => onRemove(item.cartItemId)}
                className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg bg-white/[0.03] border border-white/[0.05] text-zinc-500 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {item.selectedChoicesData?.filter((c) => c.price > 0).length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {item.selectedChoicesData
                  .filter((c) => c.price > 0)
                  .slice(0, 2)
                  .map((c) => (
                    <span
                      key={c.id}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.05] text-zinc-500"
                    >
                      {c.label}
                    </span>
                  ))}
                {item.selectedChoicesData.filter((c) => c.price > 0).length > 2 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.04] text-zinc-600">
                    +{item.selectedChoicesData.filter((c) => c.price > 0).length - 2}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onQuantityChange(item.cartItemId, qty - 1)}
                  disabled={qty <= 1}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <motion.span
                  key={qty}
                  initial={{ scale: 1.3, y: -4 }}
                  animate={{ scale: 1, y: 0 }}
                  className="w-6 text-center text-sm font-medium text-white tabular-nums"
                >
                  {qty}
                </motion.span>
                <button
                  onClick={() => onQuantityChange(item.cartItemId, qty + 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-colors"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <div className="text-right">
                <motion.span
                  key={lineTotal}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="text-sm font-bold text-cyan-400 tabular-nums"
                >
                  {formatPrice(lineTotal)} MAD
                </motion.span>
                {qty > 1 && (
                  <div className="text-[10px] text-zinc-600">
                    {formatPrice(unitPrice)} MAD / unit
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyCart() {
  const { setIsCartOpen } = useCart();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-6"
      >
        <ShoppingBag className="w-8 h-8 text-zinc-500" />
      </motion.div>
      <p className="text-base font-semibold text-zinc-300 mb-2">{t("cart.empty")}</p>
      <p className="text-sm text-zinc-500 mb-8 max-w-xs">{t("cart.emptySubtitle")}</p>
      <Button variant="secondary" onClick={() => setIsCartOpen(false)}>
        {t("cart.browseServices")}
      </Button>
    </div>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const {
    cartItems, isCartOpen, setIsCartOpen, removeFromCart,
    updateCartItemQuantity, addToCart, getTotalPrice, clearCart,
  } = useCart();
  const totalPrice = useMemo(() => getTotalPrice(), [cartItems, getTotalPrice]);
  const finalTotal = totalPrice;
  const itemCount = cartItems.length;

  const handleCheckout = () => {
    if (itemCount === 0) return;
    setIsCartOpen(false);
    navigate("/get-started");
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-[90]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xl"
      />

      <div className="absolute left-4 right-4 lg:left-6 lg:right-6 top-20 lg:top-24 bottom-4 lg:bottom-6 flex items-start justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300, mass: 0.8 }}
          className="relative w-full max-w-6xl max-h-full flex flex-col lg:flex-row gap-4 pointer-events-auto"
          style={{ height: "min(100%, 820px)" }}
        >
          {/* ── Cart Items Panel ── */}
          <div className="relative flex-1 flex flex-col rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/[0.06] shadow-2xl shadow-purple-500/5 overflow-hidden min-h-0">
            {/* Header */}
            <div className="relative flex items-center justify-between px-5 py-4 border-b border-white/[0.06] shrink-0">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-4 h-4 text-purple-400" />
                <h2 className="text-base font-bold text-white">{t("cart.title")}</h2>
                {itemCount > 0 && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
                    {itemCount} {itemCount === 1 ? t("common.service") : t("common.services")}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] transition-colors"
              >
                <X className="w-4 h-4 text-zinc-400" />
              </button>
            </div>

            {/* Items */}
            <div className="relative flex-1 overflow-y-auto overscroll-contain px-4 py-4 scrollbar-thin">
              {itemCount === 0 ? (
                <EmptyCart />
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item) => (
                      <CartItem
                        key={item.cartItemId}
                        item={item}
                        onRemove={removeFromCart}
                        onQuantityChange={updateCartItemQuantity}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

            {/* Bottom bar */}
            {itemCount > 0 && (
              <div className="relative shrink-0 border-t border-white/[0.06] px-5 py-3">
                <div className="flex items-center justify-between text-xs">
                  <button
                    onClick={clearCart}
                    className="text-zinc-500 hover:text-red-400 transition-colors font-medium"
                  >
                    {t("cart.clear") || "Clear all"}
                  </button>
                  <span className="text-zinc-500">
                    {itemCount} {itemCount === 1 ? t("common.service") : t("common.services")}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ── Summary Panel ── */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-4">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="relative rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/[0.06] overflow-hidden shadow-2xl shadow-purple-500/5"
            >
              <div className="p-5">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-[0.12em] mb-4">
                  {t("cart.summary")}
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-400">{t("cart.subtotal")}</span>
                    <span className="text-zinc-200 font-medium tabular-nums">
                      {formatPrice(totalPrice)} MAD
                    </span>
                  </div>

                  <div className="border-t border-white/[0.06]" />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">{t("cart.total")}</span>
                    <motion.span
                      key={finalTotal}
                      initial={{ scale: 1.1 }}
                      animate={{ scale: 1 }}
                      className="text-xl font-bold bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent tabular-nums"
                    >
                      {formatPrice(finalTotal)} MAD
                    </motion.span>
                  </div>
                </div>

                <div className="mt-5 space-y-2.5">
                  <Button
                    onClick={handleCheckout}
                    disabled={itemCount === 0}
                    className="w-full"
                  >
                    {t("cart.checkout")} <ArrowRight className="w-4 h-4" />
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => setIsCartOpen(false)}
                      className="flex-1 text-xs"
                    >
                      {t("cart.continueShopping")}
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex-1 text-xs"
                    >
                      {t("getStarted.title")}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
