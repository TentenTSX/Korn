import "./GirlHero.css";

function GirlHero() {
  return (
    <section className="girl-hero" aria-labelledby="girl-title">
      <img
        src="/images/hero/woman-green-set.jpg"
        alt="Femme en entraînement dans une salle de sport"
      />
      <div className="girl-hero-content">
        <span className="girl-hero-eyebrow">Performance féminine</span>
        <h1 id="girl-title">FEMME</h1>
      </div>
    </section>
  );
}

export default GirlHero;
