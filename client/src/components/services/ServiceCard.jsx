import { useRef, useState } from "react";
import { motion } from "framer-motion";
import NeoStarRating from "../ui/NeoStarRating";
import {
  ShoppingCart, Check, Sparkles,
  Palette, Camera, Play, Clapperboard, Package,
  Film, Book, Lightbulb, RefreshCw, Rocket,
  Smartphone, BookOpen, MessageSquare, Calendar,
  Handshake, BarChart3, TrendingUp,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCart } from "../../context/CartContext";

const iconMap = {
  "🎨": Palette,
  "📸": Camera,
  "▶️": Play,
  "🎬": Clapperboard,
  "📦": Package,
  "🎞️": Film,
  "📖": Book,
  "💡": Lightbulb,
  "🔄": RefreshCw,
  "🚀": Rocket,
  "📱": Smartphone,
  "📘": BookOpen,
  "💬": MessageSquare,
  "📅": Calendar,
  "🤝": Handshake,
  "📊": BarChart3,
  "📈": TrendingUp,
};

const DefaultIcon = Sparkles;

function formatPrice(amount) {
  return new Intl.NumberFormat("fr-FR").format(amount);
}

export default function ServiceCard({ service, onAddToCart, inCart, isSelected }) {
  const { t } = useTranslation();
  const { addFlyingItem } = useCart();
  const buttonRef = useRef(null);
  const [rating, setRating] = useState(0);
  const IconComponent = iconMap[service.icon] || DefaultIcon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className="h-full"
    >
      <div className="group relative bg-white border-2 border-black shadow-xl p-6 h-full flex flex-col transition-all duration-300 hover:-translate-y-1 cursor-pointer">
        <div className="w-12 h-12 flex items-center justify-center border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-4">
          <IconComponent className="text-black w-6 h-6" />
        </div>

        <div className="flex items-start gap-2 mb-2">
          <h3 className="text-xl font-bold text-slate-900">
            {service.title}
          </h3>
          {service.popular && (
            <span className="flex items-center gap-1 px-2 py-0.5 border-2 border-black bg-yellow-400 text-black text-[9px] font-black uppercase tracking-wider shrink-0 mt-1">
              <Sparkles className="w-2.5 h-2.5" />
              {t("serviceCard.popular")}
            </span>
          )}
        </div>

        <div className="text-2xl font-black text-slate-900 mb-1">
          <span className="text-xs font-medium text-slate-500">{t("serviceCard.currency")}</span>{" "}
          {formatPrice(service.price)}
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-2">
          {service.description}
        </p>

        <ul className="space-y-2 text-sm text-slate-700 mb-6">
          {service.features.slice(0, 3).map((f) => (
            <li key={f} className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-black mt-0.5 shrink-0" />
              <span>{f}</span>
            </li>
          ))}
          {service.features.length > 3 && (
            <li className="text-slate-400 pl-5">
              +{service.features.length - 3} {t("serviceCard.features")}
            </li>
          )}
        </ul>

        <div className="flex-1" />

        <div className="mb-4">
          <NeoStarRating rating={rating} onChange={setRating} />
        </div>

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
          className={`w-full py-3 border-2 border-black font-bold text-sm transition-all duration-200 ${
            inCart
              ? "bg-yellow-400 text-black hover:bg-black hover:text-white"
              : "bg-black text-white hover:bg-white hover:text-black"
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
    </motion.div>
  );
}
