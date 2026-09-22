import GirlCatalogue from "../../components/GirlCatalogue/GirlCatalogue";
import GirlHero from "../../components/GirlHero/GirlHero";
import "./Girl.css";

function Girl() {
  return (
    <main className="girl-page">
      <GirlHero />
      <GirlCatalogue />
    </main>
  );
}

export default Girl;
