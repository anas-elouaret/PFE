import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ShoppingBag, Tag, Sparkles, ArrowRight, Grid3X3 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { services, bundles, categories } from "../../data/marketingStrategyData";
import ServiceCard from "../../components/services/ServiceCard";
import { Button, Container, Badge } from "../../components/ui";

function formatPrice(amount) {
  return new Intl.NumberFormat("fr-FR").format(amount);
}

export default function MarketingStrategyPage() {
  const { t } = useTranslation();
  const { cartItems, addToCart, setIsCartOpen, getCartCount, getTotalPrice } = useCart();
  const [activeCategory, setActiveCategory] = useState("all");

  const cartServiceIds = useMemo(() => new Set(cartItems.map((i) => i.serviceId)), [cartItems]);
  const filtered = activeCategory === "all" ? services : services.filter((s) => s.tags.includes(activeCategory));

  const handleAddToCart = (service) => {
    if (cartServiceIds.has(service.id)) { setIsCartOpen(true); return; }
    addToCart({
      serviceId: service.id,
      serviceName: service.title,
      serviceImage: service.icon,
      basePrice: service.price,
      finalPrice: service.price,
      category: service.category,
      tags: service.tags,
      selectedChoicesData: [],
    });
  };

  return (
    <section className="relative pt-32 pb-20 min-h-screen bg-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.03),_transparent_60%)]" />
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-indigo-50" />
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-indigo-50" />
      <Container>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-10">
          <Badge variant="premium" className="mb-4">
            <Grid3X3 className="w-3 h-3" />
            {t("services.marketingStrategy.heroBadge")}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            {t("services.marketingStrategy")}
          </h1>
          <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
            {t("services.marketingStrategy.heroDesc")}
          </p>
        </motion.div>

        <div className="flex flex-wrap gap-2 justify-center mb-10">
          <button onClick={() => setActiveCategory("all")} className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${activeCategory === "all" ? "bg-indigo-50 border border-slate-200 text-indigo-600" : "bg-white border border-slate-200 text-zinc-500 hover:text-slate-900"}`}>
            {t("common.all")}
          </button>
          {categories.filter((c) => c.id !== "all").map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${activeCategory === cat.id ? "bg-indigo-50 border border-slate-200 text-indigo-600" : "bg-white border border-slate-200 text-zinc-500 hover:text-slate-900"}`}>
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((service) => (
            <ServiceCard key={service.id} service={service} onAddToCart={handleAddToCart} inCart={cartServiceIds.has(service.id)} />
          ))}
        </div>

        {bundles.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">{t("services.bundles")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {bundles.map((bundle) => (
                <div key={bundle.id} className="relative rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-slate-200 flex items-center justify-center text-2xl">
                      {bundle.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{bundle.title}</h3>
                      <p className="text-sm text-zinc-500 mb-2">{bundle.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-400 line-through">{formatPrice(bundle.price + bundle.savings)} MAD</span>
                        <span className="text-lg font-bold text-indigo-600">{formatPrice(bundle.price)} MAD</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-600">
                          Save {formatPrice(bundle.savings)} MAD
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
