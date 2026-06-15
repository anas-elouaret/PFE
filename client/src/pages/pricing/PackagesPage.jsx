import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { packageItems } from "../../components/hybrid/hybridData";
import AddToCartButton from "../../components/cart/AddToCartButton";
import { ScrollReveal, StaggerContainer, HoverGlow } from "../../components/animations";

export default function PackagesPage() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <ScrollReveal>
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-indigo-600">{t("pricing.pretitle")}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
          {t("pricing.title")}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-300 sm:text-base">
          {t("pricing.description")}
        </p>
      </ScrollReveal>
      <StaggerContainer className="mt-10 grid gap-5 md:grid-cols-3" staggerDelay={0.15}>
        {packageItems.map((pack) => (
          <HoverGlow key={pack.id} glowColor="rgba(0, 174, 239, 0.2)">
            <article className="rounded-2xl border border-slate-200 bg-white shadow-sm p-7">
              <h2 className="text-xl font-bold tracking-tight">{pack.name}</h2>
              <p className="mt-3 text-4xl font-black tracking-tight">{pack.price}</p>
              <ul className="mt-5 space-y-2 text-sm text-zinc-300">
                {pack.features.map((feature) => (
                  <li key={feature}>- {feature}</li>
                ))}
              </ul>
              <div className="mt-7 flex gap-3">
                <AddToCartButton
                  item={{
                    id: pack.id,
                    name: pack.name,
                    price: pack.priceNum,
                  }}
                />
                <Link
                  to="/start-project"
                  className="rounded-full border border-slate-200 bg-slate-50 px-6 py-2.5 text-sm font-bold text-slate-900 transition hover:bg-slate-100"
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
