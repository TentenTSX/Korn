import CollectionCatalogue from "../../components/catalog/Collection/CollectionCatalogue/CollectionCatalogue";
import CollectionHero from "../../components/catalog/Collection/CollectionHero/CollectionHero";
import { useDocumentHead } from "../../hooks/useDocumentHead";

function Collection() {
  useDocumentHead({
    title: "Collection",
    description:
      "Toute la collection Korn : nouveautés, meilleures ventes et soldes sur nos vêtements de sport et streetwear.",
  });

  return (
    <main className="collection-page">
      <CollectionHero />
      <CollectionCatalogue />
    </main>
  );
}

export default Collection;
