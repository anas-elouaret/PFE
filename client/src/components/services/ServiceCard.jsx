import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useTranslation } from "react-i18next";
import ServiceRating from "./ServiceRating";
import ServiceVisual from "./ServiceVisual";
import useServiceRatings from "../../hooks/useServiceRatings";
import { localizedServiceTitle } from "../../data/serviceTranslations";

function formatPrice(amount) {
  return new Intl.NumberFormat("fr-FR").format(amount);
}

export default function ServiceCard({ service, onAddToCart }) {
  const { t, i18n } = useTranslation();
  const title = localizedServiceTitle(service, i18n.language);
  const { getRating } = useServiceRatings();
  const rating = getRating(service.id);

  return (
    <motion.div
      className="h-full"
    >
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
        <ServiceVisual service={service} language={i18n.language} popular={service.popular} />

        <div className="flex flex-1 flex-col gap-2.5 p-5">
          <h3 className="text-base font-bold leading-snug text-slate-900">{title}</h3>

          <p className="text-xl font-extrabold text-slate-900">
            {formatPrice(service.price)}
            <span className="ms-1 text-xs font-bold text-slate-500">MAD</span>
          </p>

          <ServiceRating service={service} rating={rating} />

          <button
            type="button"
            onClick={() => onAddToCart && onAddToCart(service)}
            className="mt-auto flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 text-sm font-bold text-white transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
          >
            <ShoppingCart className="h-4 w-4 shrink-0" aria-hidden="true" />
            {t("services_add_to_cart")}
          </button>
        </div>
      </article>
    </motion.div>
  );
}
