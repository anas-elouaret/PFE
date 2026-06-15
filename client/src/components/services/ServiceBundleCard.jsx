import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Check, Zap, Sparkles, Crown } from "lucide-react";
import { Button } from "../ui";

const bundleIcons = {
  starter: Zap,
  business: Sparkles,
  premium: Crown,
};

const bundleAccents = {
  starter: "text-indigo-600 bg-indigo-50 border-indigo-100",
  business: "text-indigo-600 bg-indigo-50 border-indigo-100",
  premium: "text-amber-600 bg-amber-50 border-amber-100",
};

function formatPrice(amount) {
  return new Intl.NumberFormat("fr-FR").format(amount);
}

export default function ServiceBundleCard({ bundle, services, onAddBundle, inCart }) {
  const { t } = useTranslation();
  const Icon = bundleIcons[bundle.id] || Sparkles;
  const accent = bundleAccents[bundle.id] || bundleAccents.starter;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      whileHover={{ y: -4 }}
      className="relative rounded-xl border border-slate-200/60 bg-white shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="relative p-5">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent.split(" ").slice(1).join(" ")}`}>
            <Icon className={`w-4.5 h-4.5 ${accent.split(" ")[0]}`} />
          </div>
          <span className={`text-[10px] font-bold uppercase tracking-widest ${accent.split(" ")[0]}`}>
            {bundle.savings}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-1">{bundle.name}</h3>
        <p className="text-sm text-slate-500 mb-3">{bundle.description}</p>

        <div className="text-2xl font-extrabold text-slate-900 mb-1">
          {formatPrice(bundle.price)} <span className="text-sm font-medium text-slate-400">MAD</span>
        </div>

        <div className="space-y-1.5 mb-5 mt-4">
          {bundle.services.map((sid) => {
            const s = services.find((sv) => sv.id === sid);
            if (!s) return null;
            return (
              <div key={sid} className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px]">
                  {s.icon}
                </div>
                <span className="text-sm text-slate-600">{s.title}</span>
              </div>
            );
          })}
        </div>

        <Button
          variant={inCart ? "secondary" : "gradient"}
          className="w-full"
          onClick={() => onAddBundle(bundle)}
          disabled={inCart}
        >
          {inCart ? (
            <span className="flex items-center gap-2"><Check className="w-4 h-4" /> {t("serviceCard.addedToCart")}</span>
          ) : (
            <span className="flex items-center gap-2">{t("serviceBundle.addBundle")}</span>
          )}
        </Button>
      </div>
    </motion.div>
  );
}
