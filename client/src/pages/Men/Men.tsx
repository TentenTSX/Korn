import MenCatalogue from "../../components/catalog/Men/MenCatalogue/MenCatalogue";
import MenHero from "../../components/catalog/Men/MenHero/MenHero";
import { useDocumentHead } from "../../hooks/useDocumentHead";

function Men() {
  useDocumentHead({
    title: "Collection Homme",
    description:
      "Découvrez la collection Korn pour homme : t-shirts, pantalons, shorts et sweats techniques pensés pour le sport et le quotidien.",
  });

  return (
    <main className="men-page">
      <MenHero />
      <MenCatalogue />
    </main>
  );
}

export default Men;
