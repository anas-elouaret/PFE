import { useMemo } from "react";
import { useJsonLd, ORIGIN } from "./useSeo";
import useServiceRatings from "./useServiceRatings";

/**
 * Structured data for a page that lists services.
 *
 * A rating is attached to a service only when real approved reviews exist for
 * it. Search engines treat an aggregateRating as a factual claim, so a service
 * nobody has rated carries none.
 */
export default function useServiceListJsonLd({ services = [], path, name }) {
  const { getRating } = useServiceRatings();

  const data = useMemo(() => {
    if (!services.length) return null;

    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name,
      url: `${ORIGIN}${path}`,
      numberOfItems: services.length,
      itemListElement: services.map((service, index) => {
        const rating = getRating(service.id);
        const item = {
          "@type": "Service",
          name: service.title,
          description: service.description,
          provider: { "@type": "Organization", name: "GROWSTACK", url: ORIGIN },
          areaServed: { "@type": "Country", name: "Maroc" },
          offers: {
            "@type": "Offer",
            price: service.price,
            priceCurrency: "MAD",
            availability: "https://schema.org/InStock",
          },
        };

        if (rating) {
          item.aggregateRating = {
            "@type": "AggregateRating",
            ratingValue: rating.average,
            reviewCount: rating.count,
            bestRating: 5,
            worstRating: 1,
          };
        }

        return { "@type": "ListItem", position: index + 1, item };
      }),
    };
  }, [services, path, name, getRating]);

  useJsonLd(data, `services-${path.replace(/\W+/g, "-")}`);
}
