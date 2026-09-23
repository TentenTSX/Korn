import GirlCatalogue from "../../components/catalog/Girl/GirlCatalogue/GirlCatalogue";
import GirlHero from "../../components/catalog/Girl/GirlHero/GirlHero";

function Girl() {
  return (
    <main className="girl-page">
      <GirlHero />
      <GirlCatalogue />
    </main>
  );
}

export default Girl;
