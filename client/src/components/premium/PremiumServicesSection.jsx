import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Fingerprint, LayoutDashboard, PlayCircle, Check, ShoppingCart, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";

const accentStyles = {
  cyan: {
    iconWrap: "bg-cyan-100",
    checkColor: "text-cyan-600",
    glow: "rgba(6,182,212,0.3)",
    gradientFrom: "#06b6d4",
    gradientTo: "#0284c7"
  },
  blue: {
    iconWrap: "bg-blue-100",
    checkColor: "text-blue-600",
    glow: "rgba(59,130,246,0.3)",
    gradientFrom: "#3b82f6",
    gradientTo: "#6366f1"
  },
  purple: {
    iconWrap: "bg-purple-100",
    checkColor: "text-purple-600",
    glow: "rgba(168,85,247,0.3)",
    gradientFrom: "#a855f7",
    gradientTo: "#7c3aed"
  }
};

const IconMap = { Fingerprint, LayoutDashboard, PlayCircle };

const servicesData = [
  {
    id: "premium_logo",
    accent: "cyan",
    icon: "Fingerprint",
    titleKey: "premium_logo_title",
    descKey: "premium_logo_desc",
    watermarkKey: "premium_logo_watermark",
    priceKey: "premium_logo_price",
    features: ["premium_logo_feature1", "premium_logo_feature2", "premium_logo_feature3", "premium_logo_feature4"],
    image: "/images/logo-design.jpg"
  },
  {
    id: "premium_brand",
    accent: "blue",
    icon: "LayoutDashboard",
    titleKey: "premium_brand_title",
    descKey: "premium_brand_desc",
    watermarkKey: "premium_brand_watermark",
    priceKey: "premium_brand_price",
    features: ["premium_brand_feature1", "premium_brand_feature2", "premium_brand_feature3", "premium_brand_feature4"],
    image: "/images/brand-identity.jpg"
  },
  {
    id: "premium_ugc",
    accent: "purple",
    icon: "PlayCircle",
    titleKey: "premium_ugc_title",
    descKey: "premium_ugc_desc",
    watermarkKey: "premium_ugc_watermark",
    priceKey: "premium_ugc_price",
    features: ["premium_ugc_feature1", "premium_ugc_feature2", "premium_ugc_feature3", "premium_ugc_feature4"],
    image: "/images/social-media.jpg"
  }
];

export default function PremiumServicesSection() {
  const { t } = useTranslation();
  const { cartItems, addToCart, setIsCartOpen } = useCart();

  const cartServiceIds = useMemo(
    () => new Set(cartItems.map((i) => i.serviceId)),
    [cartItems]
  );

  const handleAddToCart = (svc) => {
    if (cartServiceIds.has(svc.id)) {
      setIsCartOpen(true);
      return;
    }
    const price = parseInt(t(svc.priceKey).replace(/[^0-9]/g, ""), 10) || 0;
    addToCart({
      serviceId: svc.id,
      serviceName: t(svc.titleKey),
      serviceImage: svc.icon,
      basePrice: price,
      finalPrice: price,
      category: svc.accent,
      tags: [svc.accent],
      selectedChoicesData: []
    });
  };

  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <span className="inline-block border-2 border-black px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-black/60 uppercase mb-4">
            {t("services_title")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight">
            {t("premium_section_title")}
          </h2>
          <p className="mt-4 text-base text-black/50 max-w-2xl mx-auto leading-relaxed font-medium">
            {t("premium_section_desc")}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {servicesData.map((svc) => {
            const accent = accentStyles[svc.accent];
            const IconComponent = IconMap[svc.icon];
            const inCart = cartServiceIds.has(svc.id);

            return (
              <div
                key={svc.id}
                className="group relative flex flex-col overflow-hidden border-2 border-black bg-white shadow-sm transition-all duration-500 min-h-[520px]"
              >
                <img
                  src={svc.image}
                  alt={t(svc.titleKey)}
                  className="w-full h-44 object-cover rounded-t-xl mb-0"
                />

                <div className="relative flex-1">
                  <span className="absolute inset-0 flex items-center justify-center text-[7rem] sm:text-[9rem] lg:text-[10rem] font-black italic text-black/[0.04] select-none transition-all duration-700 group-hover:opacity-0 group-hover:scale-110">
                    {t(svc.watermarkKey)}
                  </span>

                  <div className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 group-hover:-translate-y-10 group-hover:scale-90">
                    <div className={`relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 ${accent.iconWrap} border-2 border-black transition-all duration-500 group-hover:shadow-md`}>
                      <IconComponent
                        size={52}
                        className="text-black"
                        strokeWidth={2.5}
                      />
                    </div>
                  </div>

                  <h3 className="absolute bottom-6 left-6 right-6 text-xl sm:text-2xl font-bold text-black transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-4">
                    {t(svc.titleKey)}
                  </h3>

                  <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                    <div className="bg-white p-5 space-y-3.5 border-t-2 border-black">
                      <p className="text-xs sm:text-sm text-black/70 leading-relaxed line-clamp-3">
                        {t(svc.descKey)}
                      </p>

                      <ul className="space-y-1.5">
                        {svc.features.map((fk) => (
                          <li key={fk} className="flex items-start gap-2">
                            <Check size={13} className={`${accent.checkColor} mt-0.5 shrink-0`} strokeWidth={3} />
                            <span className="text-xs text-black/60">{t(fk)}</span>
                          </li>
                        ))}
                      </ul>

                      <button
                        onClick={() => handleAddToCart(svc)}
                        disabled={inCart}
                        style={{
                          background: inCart
                            ? "#f5f5f5"
                            : `linear-gradient(135deg, ${accent.gradientFrom}, ${accent.gradientTo})`,
                          boxShadow: inCart ? "none" : `0 4px 14px ${accent.glow}`
                        }}
                        className={`w-full text-white text-xs font-black uppercase tracking-wider py-2.5 flex items-center justify-center gap-2 border-2 border-black transition-all duration-300 ${
                          inCart ? "cursor-default opacity-60 text-black" : "hover:opacity-90 active:scale-[0.98] cursor-pointer"
                        }`}
                        onMouseEnter={(e) => {
                          if (!inCart) e.currentTarget.style.boxShadow = `0 8px 25px ${accent.glow}`;
                        }}
                        onMouseLeave={(e) => {
                          if (!inCart) e.currentTarget.style.boxShadow = `0 4px 14px ${accent.glow}`;
                        }}
                      >
                        {inCart ? (
                          <><ShoppingBag size={14} strokeWidth={2.5} /> {t("premium_in_cart")}</>
                        ) : (
                          <><ShoppingCart size={14} strokeWidth={2.5} /> {t("premium_add_to_cart")}</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
