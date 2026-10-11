import "./GirlHero.css";

function GirlHero() {
  return (
    <section className="girl-hero" aria-labelledby="girl-title">
      <img
        src="/images/hero/woman-bra-detail-bordeaux.webp"
        alt="Femme en entraînement dans une salle de sport"
        width={1920}
        height={2862}
      />
      <div className="girl-hero-content">
        <span className="girl-hero-eyebrow">Performance féminine</span>
        <h1 id="girl-title">FEMME</h1>
      </div>
    </section>
  );
}

export default GirlHero;
