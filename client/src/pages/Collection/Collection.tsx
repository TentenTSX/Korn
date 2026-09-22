import CollectionCatalogue from "../../components/CollectionCatalogue/CollectionCatalogue";
import CollectionHero from "../../components/CollectionHero/CollectionHero";
import "./Collection.css";

function Collection() {
  return (
    <main className="collection-page">
      <CollectionHero />
      <CollectionCatalogue />
    </main>
  );
}

export default Collection;
