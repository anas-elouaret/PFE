import { useRef, useState } from "react";
import { motion } from "framer-motion";
import NeoStarRating from "../ui/NeoStarRating";
import { ShoppingCart, Check, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCart } from "../../context/CartContext";

const iconMap = {
  "🎯": "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  "✨": "M12 2l1.5 6.5L20 9l-5 4.5 1.5 7L12 16l-6.5 4.5L7 13.5 2 9l6.5-.5L12 2z",
  "📱": "M4 4a2 2 0 012-2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm4 0v2h8V4H8z",
  "📄": "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6",
  "🖥️": "M20 4a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2h16zm-4 16H8",
  "📦": "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z",
  "🎬": "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l7 4.5-7 4.5z",
  "📊": "M3 3v18h18M9 15v-4M13 15V9M17 15V6",
  "🖼️": "M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM9 11l3 3 2-2 5 5M9 7a1 1 0 100-2 1 1 0 000 2z",
  "✍️": "M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z",
  "📑": "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  "🎭": "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-3 7a1 1 0 110 2 1 1 0 010-2zm6 0a1 1 0 110 2 1 1 0 010-2zm-5 7c-3 0-4-2-4-2h8s-1 2-4 2z",
  "📅": "M19 4H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm-2 14H7v-2h10v2zm0-4H7v-2h10v2zm0-4H7V8h10v2zM7 2v4M17 2v4",
  "🧠": "M12 2a7 7 0 00-7 7c0 2.1.9 4 2.5 5.3C9 15 9 17 9 17h6s0-2 1.5-2.7C18.1 13 19 11.1 19 9a7 7 0 00-7-7zM9 17v2c0 1.1.9 2 2 2h2a2 2 0 002-2v-2",
  "🚀": "M12 2l2.5 6.5L21 9l-5 4.5 1.5 7L12 16l-6.5 4.5L7 13.5 2 9l6.5-.5L12 2z",
  "🔍": "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  "📈": "M3 3v18h18M9 15l3-3 3 3 4-4M17 9h4v4",
  "🎵": "M9 18V5l12-2v13M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z",
  "🎞️": "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2zm0 0l4 4M21 7l-4 4M7 17l-4-4M17 17l4-4",
  "▶️": "M8 5v14l11-7L8 5z",
  "📖": "M4 6h16M4 12h16M4 18h16M8 2v20M16 2v20",
  "🔄": "M1 4v6h6M23 20v-6h-6M3.51 15a9 9 0 0015.36-5.36M20.49 9a9 9 0 00-15.36 5.36",
  "📘": "M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM4 10h16M4 14h16M10 6v12",
  "📸": "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2v11zM12 17a4 4 0 100-8 4 4 0 000 8z",
  "🎨": "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z",
  "⚡": "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  "💬": "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z",
  "🔥": "M12 2c-4 0-6 4-6 8 0 3.5 2 6 4 8s-1 4-1 4h6s-1-2-1-4 4-4.5 4-8c0-4-2-8-6-8zM12 2v20",
  "#️⃣": "M7 3l-2 18M17 3l-2 18M3 8h18M3 16h18",
  "🔵": "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z",
  "📉": "M3 3v18h18M9 17l3-3 3 3 4-4M17 15v4h4",
  "🔬": "M8 3h8v2H8V3zm1 4h6v2H9V7zm-2 4h10v2H7v-2zm3 4h4v6h-4v-6z",
  "💡": "M9.663 17h4.673M12 3v1m0 16v1m-8-9H3m18 0h-1M5.636 5.636l.707.707m11.314 0l.707-.707M12 12a3 3 0 100 6 3 3 0 000-6z",
  "🤝": "M16 8a4 4 0 01-4 4H8a4 4 0 010-8h4a4 4 0 014 4zm0 0v2a4 4 0 01-4 4H4m0 0v6",
  "📋": "M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2m4-2v4M12 2a2 2 0 00-2 2h4a2 2 0 00-2-2zM9 14l2 2 4-4",
  "🌱": "M12 2v12m0 0a4 4 0 01-4-4m4 4a4 4 0 004-4M12 14v8M8 22h8",
  "🪝": "M18 8A6 6 0 006 8c0 3-2 4-2 8h16c0-4-2-5-2-8zM12 16v4",
  "⚙️": "M12 15a3 3 0 100-6 3 3 0 000 6zm0-11v2m0 16v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42",
  "🧪": "M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a1 1 0 00-1.4-1.4L17 7.3l-1.3-1.3a1 1 0 00-1.4 0zM9 12l-5 5v2h2l5-5",
};

function formatPrice(amount) {
  return new Intl.NumberFormat("fr-FR").format(amount);
}

export default function ServiceCard({ service, onAddToCart, inCart, isSelected }) {
  const { t } = useTranslation();
  const { addFlyingItem } = useCart();
  const buttonRef = useRef(null);
  const [rating, setRating] = useState(0);
  const path = iconMap[service.icon] || iconMap["🎯"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
    >
      <div className="group relative bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm overflow-hidden transition-all duration-500 ease-in-out hover:-translate-y-2 cursor-pointer">
        {/* The Fill-Up Sliding Layer from bottom to top */}
        <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-0" />

        {/* Core Content Container - Must be relative and z-10 */}
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            {/* Icon Badge Container */}
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900 mb-4 transition-all duration-300 group-hover:bg-white/10 group-hover:text-white group-hover:-translate-y-1">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-slate-900 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={path} />
              </svg>
            </div>

            {/* Service Title + Popular badge */}
            <div className="flex items-start gap-2 mb-2">
              <h3 className="text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-white">
                {service.title}
              </h3>
              {service.popular && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 group-hover:bg-white/20 group-hover:text-white text-[9px] font-semibold uppercase tracking-wider shrink-0 mt-1 transition-colors duration-300">
                  <Sparkles className="w-2.5 h-2.5" />
                  {t("serviceCard.popular")}
                </span>
              )}
            </div>

            {/* Service Price */}
            <div className="text-2xl font-black text-slate-900 mb-1 transition-colors duration-300 group-hover:text-white">
              <span className="text-xs font-medium text-slate-400 group-hover:text-white/60 transition-colors duration-300">{t("serviceCard.currency")}</span>{" "}
              {formatPrice(service.price)}
            </div>

            {/* Description */}
            <p className="text-sm text-slate-500 group-hover:text-white/80 leading-relaxed mb-4 line-clamp-2 transition-colors duration-300">
              {service.description}
            </p>

            {/* Features List */}
            <ul className="space-y-2 text-sm text-slate-600 mb-6 transition-colors duration-300 group-hover:text-slate-100">
              {service.features.slice(0, 3).map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-indigo-500 group-hover:text-white mt-0.5 shrink-0 transition-colors duration-300" />
                  <span>{f}</span>
                </li>
              ))}
              {service.features.length > 3 && (
                <li className="text-slate-400 group-hover:text-white/60 transition-colors duration-300 pl-5">
                  +{service.features.length - 3} {t("serviceCard.features")}
                </li>
              )}
            </ul>

            <div className="mt-3">
              <NeoStarRating rating={rating} onChange={setRating} />
            </div>
          </div>

          {/* The Inverted Action Button */}
          <motion.button
            ref={buttonRef}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const rect = buttonRef.current?.getBoundingClientRect();
              if (rect) {
                addFlyingItem({
                  id: `${service.id}-${Date.now()}-${Math.random()}`,
                  image: service.icon,
                  startRect: rect,
                  title: service.title,
                });
              }
              onAddToCart(service);
            }}
            className={`w-full py-3 rounded-full font-semibold text-sm transition-all duration-300 shadow-sm ${
              inCart
                ? "bg-slate-100 text-slate-600 border border-slate-200 group-hover:bg-white group-hover:text-slate-950 group-hover:border-white"
                : "bg-slate-900 text-white group-hover:bg-white group-hover:text-slate-950"
            }`}
          >
            {inCart ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                {t("serviceCard.addedToCart")}
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                {t("serviceCard.addToCart")}
              </span>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
