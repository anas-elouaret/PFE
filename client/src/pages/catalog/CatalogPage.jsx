import { useTranslation } from "react-i18next";
import CreatorCatalogSection from "../../components/home/CreatorCatalogSection";

export default function CatalogPage() {
  const { t } = useTranslation();
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">{t("catalog.pretitle")}</p>
        <h1 className="mt-4 text-4xl font-black sm:text-5xl text-slate-900">{t("catalog.title")}</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          {t("catalog.description")}
        </p>
      </section>
      <div className="pb-12">
        <CreatorCatalogSection />
      </div>
    </>
  );
}
