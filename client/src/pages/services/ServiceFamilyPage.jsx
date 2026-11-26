import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Grid3X3 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import ServiceCard from "../../components/services/ServiceCard";
import { Badge, Container } from "../../components/ui";
import useSeo, { useJsonLd } from "../../hooks/useSeo";
import { buildServiceSchema } from "../../utils/serviceSchema";
import useServiceListJsonLd from "../../hooks/useServiceListJsonLd";
import { localizedServiceTitle } from "../../data/serviceTranslations";

function formatPrice(amount) {
  return new Intl.NumberFormat("fr-FR").format(amount);
}

/**
 * A service-family page, driven by its data file.
 *
 * The four older family pages each carry their own copy of this markup. This
 * exists because two families — web development and graphic design — had
 * data, prices and a link in the navigation but no page at all, and writing
 * the same 120 lines twice more to fill the gap would have made the drift
 * worse rather than better.
 */
export default function ServiceFamilyPage({
  slug,
  name,
  seoTitle,
  seoDescription,
  services,
  bundles = [],
  categories = [],
  i18nKey,
}) {
  const path = `/services/${slug}`;

  useSeo({ title: seoTitle, description: seoDescription, path });
  useJsonLd(
    buildServiceSchema({ name, description: seoDescription, path, services }),
    "service"
  );
  useServiceListJsonLd({ services, path, name });

  const { t, i18n } = useTranslation();
  const { cartItems, addToCart, setIsCartOpen } = useCart();
  const [activeCategory, setActiveCategory] = useState("all");

  const cartServiceIds = useMemo(
    () => new Set(cartItems.map((i) => i.serviceId)),
    [cartItems]
  );

  const filtered =
    activeCategory === "all"
      ? services
      : services.filter((s) => (s.tags || []).includes(activeCategory));

  const handleAddToCart = (service) => {
    if (cartServiceIds.has(service.id)) {
      setIsCartOpen(true);
      return;
    }
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
    <section className="relative min-h-screen bg-white pb-20 pt-20 md:pt-32">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-10 max-w-3xl text-center"
        >
          <Badge variant="premium" className="mb-4">
            <Grid3X3 className="h-3 w-3" />
            {t(`services.${i18nKey}.heroBadge`)}
          </Badge>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            {t(`services.${i18nKey}.title`)}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-zinc-500">
            {t(`services.${i18nKey}.heroDesc`)}
          </p>
        </motion.div>

        {categories.length > 1 && (
          <div className="mb-10 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                activeCategory === "all"
                  ? "border border-slate-200 bg-orange-50 text-orange-700"
                  : "border border-slate-200 bg-white text-zinc-500 hover:text-slate-900"
              }`}
            >
              {t("common.all")}
            </button>
            {categories
              .filter((c) => c.id !== "all")
              .map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-xl px-4 py-2 text-xs font-semibold capitalize transition-all ${
                    activeCategory === cat.id
                      ? "border border-slate-200 bg-orange-50 text-orange-700"
                      : "border border-slate-200 bg-white text-zinc-500 hover:text-slate-900"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onAddToCart={handleAddToCart}
              inCart={cartServiceIds.has(service.id)}
            />
          ))}
        </div>

        {bundles.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-center text-2xl font-bold text-slate-900">
              {t("services.bundles")}
            </h2>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {bundles.map((bundle) => (
                <div
                  key={bundle.id}
                  className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-orange-50 text-2xl">
                      {bundle.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-1 text-lg font-bold text-slate-900">
                        {localizedServiceTitle(bundle, i18n.language)}
                      </h3>
                      <p className="mb-2 text-sm text-zinc-500">{bundle.description}</p>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-zinc-400 line-through">
                          {formatPrice(bundle.price + bundle.savings)} MAD
                        </span>
                        <span className="text-lg font-bold text-orange-700">
                          {formatPrice(bundle.price)} MAD
                        </span>
                        <span className="rounded-full border border-green-200 bg-green-50 px-1.5 py-0.5 text-[10px] text-green-700">
                          −{formatPrice(bundle.savings)} MAD
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
