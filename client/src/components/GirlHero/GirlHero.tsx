import "../../pages/Girl/Girl.css";

function GirlHero() {
  return (
    <section className="girl-hero" aria-labelledby="girl-title">
      <img
        src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1800&h=900&fit=crop&auto=format"
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
