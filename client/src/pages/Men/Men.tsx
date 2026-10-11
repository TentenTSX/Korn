import Catalogue from "../../components/catalog/Catalogue/Catalogue";
import MenHero from "../../components/catalog/Men/MenHero/MenHero";
import { useDocumentHead } from "../../hooks/useDocumentHead";

function Men() {
  useDocumentHead({
    title: "Collection Homme",
    description:
      "Découvrez la collection Korn pour homme : t-shirts, pantalons, shorts et sweats techniques pensés pour le sport et le quotidien.",
  });

  return (
    <main className="catalogue-page">
      <MenHero />
      <Catalogue gender="Homme" />
    </main>
  );
}

export default Men;
