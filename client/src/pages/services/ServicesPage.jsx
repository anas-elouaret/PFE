import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ShoppingBag, Grid3X3 } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { services } from "../../data/socialMediaServicesData";
import ServiceCard from "../../components/services/ServiceCard";
import { Container, Badge } from "../../components/ui";

function formatPrice(amount) {
  return new Intl.NumberFormat("fr-FR").format(amount);
}

export default function ServicesPage() {
  const { t } = useTranslation();
  const { cartItems, addToCart, setIsCartOpen } = useCart();

  const cartServiceIds = useMemo(() => new Set(cartItems.map((i) => i.serviceId)), [cartItems]);

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
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,174,239,0.06),transparent_60%)]" />
      <Container>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto mb-10">
          <Badge variant="premium" className="mb-4">
            <Grid3X3 className="w-3 h-3" />
            {t("services.all")}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            {t("services.allServices")}
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            {t("services.allDesc")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} onAddToCart={handleAddToCart} inCart={cartServiceIds.has(service.id)} />
          ))}
        </div>
      </Container>
    </section>
  );
}
