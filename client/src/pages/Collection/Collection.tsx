import CollectionCatalogue from "../../components/catalog/Collection/CollectionCatalogue/CollectionCatalogue";
import CollectionHero from "../../components/catalog/Collection/CollectionHero/CollectionHero";

function Collection() {
  return (
    <main className="collection-page">
      <CollectionHero />
      <CollectionCatalogue />
    </main>
  );
}

export default Collection;
