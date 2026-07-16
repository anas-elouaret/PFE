import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useCart } from "../../context/CartContext";
import { Megaphone, Code2, PenTool, TrendingUp, Clapperboard, Camera, ArrowRight } from "lucide-react";
import NikeServiceCard from "./NikeServiceCard";

const iconProps = {
  strokeWidth: 2.5,
  strokeLinecap: "square",
  strokeLinejoin: "miter",
};

const servicesData = [
  {
    id: "premium_graphic",
    accent: "violet",
    icon: PenTool,
    titleKey: "premium_graphic_title",
    descKey: "premium_graphic_desc",
    watermarkKey: "premium_graphic_watermark",
    priceKey: "premium_graphic_price",
    features: [
      "premium_graphic_feature1",
      "premium_graphic_feature2",
      "premium_graphic_feature3",
      "premium_graphic_feature4",
    ],
  },
  {
    id: "premium_social",
    accent: "orange",
    icon: Megaphone,
    titleKey: "premium_social_title",
    descKey: "premium_social_desc",
    watermarkKey: "premium_social_watermark",
    priceKey: "premium_social_price",
    features: [
      "premium_social_feature1",
      "premium_social_feature2",
      "premium_social_feature3",
      "premium_social_feature4",
    ],
  },
  {
    id: "premium_strategy",
    accent: "blue",
    icon: TrendingUp,
    titleKey: "premium_strategy_title",
    descKey: "premium_strategy_desc",
    watermarkKey: "premium_strategy_watermark",
    priceKey: "premium_strategy_price",
    features: [
      "premium_strategy_feature1",
      "premium_strategy_feature2",
      "premium_strategy_feature3",
      "premium_strategy_feature4",
    ],
  },
  {
    id: "premium_ugc",
    accent: "purple",
    icon: Clapperboard,
    titleKey: "premium_ugc_title",
    descKey: "premium_ugc_desc",
    watermarkKey: "premium_ugc_watermark",
    priceKey: "premium_ugc_price",
    features: [
      "premium_ugc_feature1",
      "premium_ugc_feature2",
      "premium_ugc_feature3",
      "premium_ugc_feature4",
    ],
  },
  {
    id: "premium_photo",
    accent: "cyan",
    icon: Camera,
    titleKey: "premium_photo_title",
    descKey: "premium_photo_desc",
    watermarkKey: "premium_photo_watermark",
    priceKey: "premium_photo_price",
    features: [
      "premium_photo_feature1",
      "premium_photo_feature2",
      "premium_photo_feature3",
      "premium_photo_feature4",
    ],
  },
  {
    id: "premium_web",
    accent: "slate",
    icon: Code2,
    titleKey: "premium_web_title",
    descKey: "premium_web_desc",
    watermarkKey: "premium_web_watermark",
    priceKey: "premium_web_price",
    features: [
      "premium_web_feature1",
      "premium_web_feature2",
      "premium_web_feature3",
      "premium_web_feature4",
    ],
  },
];

const navLinks = [
  { key: "showreel_nav_services", href: "#services" },
  { key: "showreel_nav_contact", href: "/contact" },
];

export default function ServicesSection() {
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
      serviceImage: svc.accent,
      basePrice: price,
      finalPrice: price,
      category: svc.accent,
      tags: [svc.accent],
      selectedChoicesData: [],
    });
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans pt-16">
      {/* ── Fixed Navbar ── */}
      <nav className="fixed top-0 left-0 w-full z-[9999] bg-white border-b-2 border-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <a href="#hero" className="text-2xl font-black tracking-tighter text-black no-underline">
            GROWSTACK
          </a>
          <div className="hidden sm:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="text-[10px] lg:text-xs font-bold tracking-[0.15em] text-black/60 hover:text-black transition-colors uppercase no-underline"
              >
                {t(link.key)}
              </a>
            ))}
          </div>
          <a
            href="/get-started"
            className="inline-flex items-center gap-1.5 sm:gap-2 border-2 border-black bg-black text-[#ffffff] px-3 sm:px-5 py-1.5 sm:py-2 text-[10px] sm:text-xs font-bold tracking-[0.15em] uppercase hover:bg-white hover:text-black transition-colors no-underline"
          >
            {t("showreel_cta")}
            <ArrowRight size={12} className="sm:size-14" {...iconProps} />
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section id="hero" className="bg-neutral-50 border-b-2 border-black">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 md:py-32 lg:py-40">
          <div className="max-w-4xl">
            <span className="inline-block border-2 border-black px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold tracking-[0.2em] text-black/60 uppercase mb-6 sm:mb-8">
              GROWSTACK
            </span>
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.85] text-black">
              {t("premium_section_title")}
            </h1>
            <div className="mt-4 w-16 h-1.5 bg-black" />
            <p className="mt-8 text-base sm:text-lg text-black/50 max-w-xl leading-relaxed font-medium">
              {t("premium_section_desc")}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a
                href="#services"
                className="inline-flex items-center justify-center gap-3 border-2 border-black bg-black text-[#ffffff] px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-bold tracking-[0.15em] uppercase hover:bg-white hover:text-black transition-colors no-underline"
              >
                {t("showreel_cta")}
                <ArrowRight size={16} {...iconProps} />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-3 border-2 border-black text-black/70 px-6 sm:px-8 py-3 sm:py-3.5 text-xs sm:text-sm font-bold tracking-[0.15em] uppercase hover:bg-black hover:text-[#ffffff] transition-colors no-underline"
              >
                {t("showreel_secondary_cta")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section id="services" className="bg-white border-b-2 border-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
          <div className="mb-16">
            <span className="inline-block border-2 border-black px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold tracking-[0.2em] text-black/60 uppercase mb-3 sm:mb-4">
              {t("showreel_nav_services")}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-black leading-[0.9]">
              {t("premium_section_title")}
            </h2>
            <div className="mt-4 w-16 h-1.5 bg-black" />
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {servicesData.map((svc) => {
              const inCart = cartServiceIds.has(svc.id);
              return (
                <NikeServiceCard
                  key={svc.id}
                  service={svc}
                  inCart={inCart}
                  onAddToCart={handleAddToCart}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-neutral-50 mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="border-t-2 border-black pt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="text-2xl font-black tracking-tighter text-black">
              GROWSTACK
            </span>
            <p className="mt-2 text-xs font-medium tracking-[0.1em] text-black/30 uppercase">
              {t("showreel_nav_services")} &mdash; NEO-BRUTALIST TECH
            </p>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-black/60 hover:text-black uppercase transition-colors no-underline"
            >
              {t("showreel_nav_contact")}
            </a>
            <a
              href="/get-started"
              className="inline-flex items-center gap-2 border-2 border-black bg-black text-[#ffffff] px-5 py-2.5 text-xs font-bold tracking-[0.15em] uppercase hover:bg-white hover:text-black transition-colors no-underline"
            >
              {t("showreel_cta")}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
