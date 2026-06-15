import { useState, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  ShoppingBag, Tag, Zap, Info,
  ChevronDown, ChevronUp, Grid3X3, Eye
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { categoryGroups } from "../../data/servicesHubData";
import ServiceCard from "../../components/services/ServiceCard";
import { Button, Container } from "../../components/ui";
import BackButton from "../../components/ui/BackButton";

function formatPrice(amount) {
  return new Intl.NumberFormat("fr-FR").format(amount);
}

function CategoryNav({ groups, activeId, onSelect }) {
  const scrollRef = useRef(null);

  return (
    <div className="sticky top-[68px] z-40 bg-white border-b border-slate-100">
      <Container>
        <div ref={scrollRef} className="flex gap-1.5 overflow-x-auto scrollbar-none py-3">
          {groups.map((g) => (
            <button
              key={g.id}
              onClick={() => onSelect(g.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                activeId === g.id
                  ? "bg-indigo-50 text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="text-base">{g.icon}</span>
              <span>{g.name}</span>
              <span className={`text-[10px] ml-1 ${activeId === g.id ? "text-indigo-400" : "text-slate-400"}`}>
                {g.services.length}
              </span>
            </button>
          ))}
        </div>
        <style>{`
          .scrollbar-none::-webkit-scrollbar { display: none; }
          .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </Container>
    </div>
  );
}

function CategorySection({ group, isExpanded, onToggle, cartServiceIds, onAddToCart }) {
  const { t } = useTranslation();
  const sectionRef = useRef(null);

  const handleExplore = () => {
    onToggle(group.id);
    setTimeout(() => {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div ref={sectionRef} className="scroll-mt-32 mb-10" id={`category-${group.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="bg-white border border-slate-100 rounded-xl shadow-sm"
      >
        <div className="p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                <span className="text-xl">{group.icon}</span>
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-0.5">
                  {group.name}
                </h2>
                <p className="text-sm text-slate-500 max-w-xl mb-2">
                  {group.description}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-600">
                    {group.services.length} {t("common.services")}
                  </span>
                  <span className="text-slate-200">·</span>
                  <button
                    onClick={handleExplore}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    {isExpanded ? t("services.hide") : t("services.explore")}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={handleExplore}
              className="w-8 h-8 rounded-lg border border-slate-200 bg-white flex items-center justify-center transition-all duration-200 hover:bg-slate-50 shrink-0"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-500" />
              )}
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {group.services.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    onAddToCart={onAddToCart}
                    inCart={cartServiceIds.has(service.id)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ServicesHubPage() {
  const { t } = useTranslation();
  const { cartItems, addToCart, setIsCartOpen, getCartCount, getTotalPrice } = useCart();
  const [expandedCategories, setExpandedCategories] = useState(new Set(["graphic-design", "social-media", "marketing-strategy", "ugc", "photography"]));
  const [activeNavId, setActiveNavId] = useState("graphic-design");
  const [showDiscountBanner, setShowDiscountBanner] = useState(true);

  const cartServiceIds = useMemo(() => new Set(cartItems.map((i) => i.serviceId)), [cartItems]);
  const cartCount = getCartCount();
  const totalPrice = getTotalPrice();

  const discountPercent = cartCount >= 4 ? 20 : cartCount >= 3 ? 15 : cartCount >= 2 ? 10 : 0;
  const discountedTotal = discountPercent > 0 ? totalPrice * (1 - discountPercent / 100) : totalPrice;

  const totalServices = useMemo(
    () => categoryGroups.reduce((sum, g) => sum + g.services.length, 0),
    []
  );

  const toggleCategory = useCallback((id) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
    setActiveNavId(id);
  }, []);

  const handleNavSelect = useCallback((id) => {
    setActiveNavId(id);
    const el = document.getElementById(`category-${id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

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
    <>
      <BackButton />
      <section className="relative pt-28 pb-6 bg-white">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-6"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.1em] border border-slate-200 bg-slate-50 text-slate-500 mb-4">
              <Grid3X3 className="w-3 h-3" />
              {t("services.hub.marketplace")}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
              {t("services.hub.title")}{" "}
              <span className="text-indigo-600">
                {t("services.hub.titleHighlight")}
              </span>
            </h1>
            <p className="text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
              {t("services.hub.subtitle", { count: totalServices, categories: categoryGroups.length })}
            </p>
          </motion.div>

          {cartCount > 0 && showDiscountBanner && discountPercent > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                      <Tag className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{t("services.cartTitle")}</p>
                      <p className="text-xs text-slate-500">
                        {cartCount === 1 ? t("services.cartCount", { count: cartCount }) : t("services.cartCount_plural", { count: cartCount })} ·
                        <span className="text-indigo-600 font-medium ml-1">{t("services.percentOff", { percent: discountPercent })}</span>
                        ·
                        <span className="text-indigo-600 font-medium ml-1">
                          {t("services.saved", { amount: formatPrice(totalPrice - discountedTotal) })}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-xs text-slate-400 line-through">{formatPrice(totalPrice)} MAD</p>
                      <p className="text-lg font-extrabold text-slate-900">
                        {formatPrice(discountedTotal)} MAD
                      </p>
                    </div>
                    <Button size="sm" variant="gradient" onClick={() => setIsCartOpen(true)}>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      {t("cart.title")} ({cartCount})
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </Container>
      </section>

      <CategoryNav
        groups={categoryGroups}
        activeId={activeNavId}
        onSelect={handleNavSelect}
      />

      <section className="relative pb-20 bg-slate-50">
        <Container>
          {categoryGroups.map((group) => (
            <CategorySection
              key={group.id}
              group={group}
              isExpanded={expandedCategories.has(group.id)}
              onToggle={toggleCategory}
              cartServiceIds={cartServiceIds}
              onAddToCart={handleAddToCart}
            />
          ))}
        </Container>
      </section>

      <section className="relative py-16 border-t border-slate-100 bg-white">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Eye, titleKey: "services.hub.feature1.title", descKey: "services.hub.feature1.desc" },
              { icon: Zap, titleKey: "services.hub.feature2.title", descKey: "services.hub.feature2.desc" },
              { icon: Info, titleKey: "services.hub.feature3.title", descKey: "services.hub.feature3.desc" },
            ].map((item) => (
              <div key={item.titleKey} className="text-center p-6 rounded-xl bg-white border border-slate-100 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1.5">{t(item.titleKey)}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{t(item.descKey)}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
