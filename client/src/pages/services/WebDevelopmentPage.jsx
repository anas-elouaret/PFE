import ServiceFamilyPage from "./ServiceFamilyPage";
import { services, bundles, categories } from "../../data/webDevelopmentServicesData";

/**
 * The family with the most search demand in Morocco and, until now, no page.
 *
 * Keyword research for the Moroccan market put "création site web maroc" at
 * about 1 000 searches a month and "agence web maroc" at 480 with a
 * difficulty of 0, against 10 a month for "création logo maroc". The title
 * leads with those two phrases because that is what people actually type.
 */
export default function WebDevelopmentPage() {
  return (
    <ServiceFamilyPage
      slug="web-development"
      i18nKey="web"
      name="Développement web"
      seoTitle="Agence web au Maroc — création de site internet"
      seoDescription="Création de sites vitrines et e-commerce, refonte et référencement naturel, à partir de 1 500 MAD. Tarifs affichés, livraison en 7 à 14 jours ouvrés."
      services={services}
      bundles={bundles}
      categories={categories}
    />
  );
}
