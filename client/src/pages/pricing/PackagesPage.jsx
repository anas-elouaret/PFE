import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { packageItems } from "../../components/hybrid/hybridData";
import { ScrollReveal, StaggerContainer, HoverGlow } from "../../components/animations";

export default function PackagesPage() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <ScrollReveal>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-500">{t("pricing.pretitle")}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
          {t("pricing.title")}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
          {t("pricing.description")}
        </p>
      </ScrollReveal>
      <StaggerContainer className="mt-10 grid gap-5 md:grid-cols-3" staggerDelay={0.15}>
        {packageItems.map((pack, index) => (
          <HoverGlow key={pack.id} glowColor="rgba(255, 87, 34, 0.15)">
            <article className={`relative border-2 border-slate-200 bg-white p-7 ${index === 1 ? "border-orange-500" : ""}`}>
              {index === 1 && (
                <span className="absolute -top-3 left-6 bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1">
                  Most Popular
                </span>
              )}
              <h2 className="text-xl font-bold tracking-tight text-slate-900">{pack.name}</h2>
              <p className="mt-3 text-4xl font-black tracking-tight text-slate-900">{pack.price}</p>
              <ul className="mt-5 space-y-2 text-sm text-slate-600">
                {pack.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5 shrink-0">◆</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex gap-3">
                <Link
                  to="/get-started"
                  className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-orange-500 bg-orange-500 px-5 py-3 text-sm font-bold text-white hover:bg-orange-600 transition-colors duration-200"
                >
                  <ShoppingCart size={16} />
                  Ajouter au panier
                </Link>
                <Link
                  to="/start-project"
                  className="inline-flex items-center justify-center gap-2 border-2 border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors duration-200"
                >
                  {t("common.details")}
                </Link>
              </div>
            </article>
          </HoverGlow>
        ))}
      </StaggerContainer>
    </section>
  );
}
