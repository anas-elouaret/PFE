import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useCart } from "../../context/CartContext";
import { Fingerprint, LayoutDashboard, PlayCircle, ArrowRight } from "lucide-react";
import NikeServiceCard from "./NikeServiceCard";

const iconProps = {
  strokeWidth: 2.5,
  strokeLinecap: "square",
  strokeLinejoin: "miter",
};

const servicesData = [
  {
    id: "premium_logo",
    accent: "cyan",
    icon: Fingerprint,
    image: "/images/logo-design.jpg",
    titleKey: "premium_logo_title",
    descKey: "premium_logo_desc",
    watermarkKey: "premium_logo_watermark",
    priceKey: "premium_logo_price",
    features: [
      "premium_logo_feature1",
      "premium_logo_feature2",
      "premium_logo_feature3",
      "premium_logo_feature4",
    ],
  },
  {
    id: "premium_brand",
    accent: "blue",
    icon: LayoutDashboard,
    titleKey: "premium_brand_title",
    descKey: "premium_brand_desc",
    watermarkKey: "premium_brand_watermark",
    priceKey: "premium_brand_price",
    features: [
      "premium_brand_feature1",
      "premium_brand_feature2",
      "premium_brand_feature3",
      "premium_brand_feature4",
    ],
  },
  {
    id: "premium_ugc",
    accent: "purple",
    icon: PlayCircle,
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
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <a href="#hero" className="text-2xl font-black tracking-tighter text-black no-underline">
            GROWSTACK
          </a>
          <div className="hidden sm:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.key}
                href={link.href}
                className="text-xs font-bold tracking-[0.15em] text-black/60 hover:text-black transition-colors uppercase no-underline"
              >
                {t(link.key)}
              </a>
            ))}
          </div>
          <a
            href="/get-started"
            className="inline-flex items-center gap-2 border-2 border-black bg-black text-white px-5 py-2 text-xs font-bold tracking-[0.15em] uppercase hover:bg-white hover:text-black transition-colors no-underline"
          >
            {t("showreel_cta")}
            <ArrowRight size={14} {...iconProps} />
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section id="hero" className="bg-neutral-50 border-b-2 border-black">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:py-40">
          <div className="max-w-4xl">
            <span className="inline-block border-2 border-black px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-black/60 uppercase mb-8">
              GROWSTACK
            </span>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.85] text-black">
              {t("premium_section_title")}
            </h1>
            <div className="mt-4 w-16 h-1.5 bg-black" />
            <p className="mt-8 text-base sm:text-lg text-black/50 max-w-xl leading-relaxed font-medium">
              {t("premium_section_desc")}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href="#services"
                className="inline-flex items-center gap-3 border-2 border-black bg-black text-white px-8 py-3.5 text-sm font-bold tracking-[0.15em] uppercase hover:bg-white hover:text-black transition-colors no-underline"
              >
                {t("showreel_cta")}
                <ArrowRight size={16} {...iconProps} />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-3 border-2 border-black text-black/70 px-8 py-3.5 text-sm font-bold tracking-[0.15em] uppercase hover:bg-black hover:text-white transition-colors no-underline"
              >
                {t("showreel_secondary_cta")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section id="services" className="bg-white border-b-2 border-black">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-16">
            <span className="inline-block border-2 border-black px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-black/60 uppercase mb-4">
              {t("showreel_nav_services")}
            </span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-black leading-[0.9]">
              {t("premium_section_title")}
            </h2>
            <div className="mt-4 w-16 h-1.5 bg-black" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
      <footer className="bg-neutral-50 mx-auto max-w-7xl px-6 py-16">
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
              className="inline-flex items-center gap-2 border-2 border-black bg-black text-white px-5 py-2.5 text-xs font-bold tracking-[0.15em] uppercase hover:bg-white hover:text-black transition-colors no-underline"
            >
              {t("showreel_cta")}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
