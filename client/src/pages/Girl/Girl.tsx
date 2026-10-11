import Catalogue from "../../components/catalog/Catalogue/Catalogue";
import GirlHero from "../../components/catalog/Girl/GirlHero/GirlHero";
import { useDocumentHead } from "../../hooks/useDocumentHead";

function Girl() {
  useDocumentHead({
    title: "Collection Femme",
    description:
      "Découvrez la collection Korn pour femme : brassières, leggings, shorts et sweats techniques pensés pour le sport et le quotidien.",
  });

  return (
    <main className="catalogue-page">
      <GirlHero />
      <Catalogue gender="Femme" />
    </main>
  );
}

export default Girl;
