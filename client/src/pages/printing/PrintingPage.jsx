import { useTranslation } from "react-i18next";
import { printingItems } from "../../components/hybrid/hybridData";

export default function PrintingPage() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto max-w-7xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">{t("printing.pretitle")}</p>
      <h1 className="mt-4 text-4xl font-black sm:text-5xl text-slate-900">{t("printing.title")}</h1>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {printingItems.map((item) => (
          <article key={item.title} className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
            <div className="mb-4 h-24 rounded-xl bg-gradient-to-br from-indigo-100 to-indigo-50/50" />
            <h2 className="text-lg font-bold text-slate-900">{item.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
            <p className="mt-2 text-2xl font-black tracking-tighter text-slate-900">{item.price}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
