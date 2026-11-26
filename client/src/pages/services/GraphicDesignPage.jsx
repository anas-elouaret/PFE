import ServiceFamilyPage from "./ServiceFamilyPage";
import { services, bundles, categories } from "../../data/graphicServicesData";

/**
 * Logo and identity work.
 *
 * Deliberately not titled around "création logo maroc": that phrase draws
 * about 10 searches a month in Morocco, and "logo maroc" at 1 600 is people
 * looking for the country's emblems, not for a designer. The title leads on
 * identity and the deliverables instead, which is both honest and closer to
 * what someone commissioning this work would type.
 */
export default function GraphicDesignPage() {
  return (
    <ServiceFamilyPage
      slug="graphic-design"
      i18nKey="graphic"
      name="Design graphique"
      seoTitle="Design graphique et identité visuelle au Maroc"
      seoDescription="Logo, charte graphique, affiches, packaging et cartes de visite, à partir de 1 000 MAD. Fichiers sources inclus, trois séries de révisions, 7 à 14 jours ouvrés."
      services={services}
      bundles={bundles}
      categories={categories}
    />
  );
}
