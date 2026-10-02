import GirlCatalogue from "../../components/catalog/Girl/GirlCatalogue/GirlCatalogue";
import GirlHero from "../../components/catalog/Girl/GirlHero/GirlHero";
import { useDocumentHead } from "../../hooks/useDocumentHead";

function Girl() {
  useDocumentHead({
    title: "Collection Femme",
    description:
      "Découvrez la collection Korn pour femme : brassières, leggings, shorts et sweats techniques pensés pour le sport et le quotidien.",
  });

  return (
    <main className="girl-page">
      <GirlHero />
      <GirlCatalogue />
    </main>
  );
}

export default Girl;
