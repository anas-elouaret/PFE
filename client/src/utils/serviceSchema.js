import { ORIGIN } from "../hooks/useSeo";

/**
 * Structured data for a service family page.
 *
 * Builds the Service, its catalogue of offers and the breadcrumb from the
 * page's own data file, so the prices a search engine is told are the prices
 * on the page. Anything else drifts the first time a price changes, and a
 * price in structured data that does not match the page is a manual action,
 * not a ranking boost.
 */
export function buildServiceSchema({ name, description, path, services = [] }) {
  const url = `${ORIGIN}${path}`;
  const priced = services.filter((s) => typeof s.price === "number");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name,
        description,
        url,
        serviceType: name,
        provider: { "@id": `${ORIGIN}/#organisation` },
        areaServed: { "@type": "Country", name: "Maroc" },
        availableLanguage: ["fr", "ar", "en"],
        ...(priced.length
          ? {
              offers: {
                "@type": "AggregateOffer",
                priceCurrency: "MAD",
                lowPrice: Math.min(...priced.map((s) => s.price)),
                highPrice: Math.max(...priced.map((s) => s.price)),
                offerCount: priced.length,
              },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name,
                itemListElement: priced.slice(0, 20).map((s) => ({
                  "@type": "Offer",
                  priceCurrency: "MAD",
                  price: s.price,
                  itemOffered: { "@type": "Service", name: s.title },
                })),
              },
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: `${ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: "Services", item: `${ORIGIN}/services` },
          { "@type": "ListItem", position: 3, name, item: url },
        ],
      },
    ],
  };
}

export default buildServiceSchema;
