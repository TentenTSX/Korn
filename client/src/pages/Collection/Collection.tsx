import Catalogue from "../../components/catalog/Catalogue/Catalogue";
import CollectionHero from "../../components/catalog/Collection/CollectionHero/CollectionHero";
import { useDocumentHead } from "../../hooks/useDocumentHead";

function Collection() {
  useDocumentHead({
    title: "Collection",
    description:
      "Toute la collection Korn : nouveautés, meilleures ventes et soldes sur nos vêtements de sport et streetwear.",
  });

  return (
    <main className="catalogue-page">
      <CollectionHero />
      <Catalogue />
    </main>
  );
}

export default Collection;
