import "./MenHero.css";

function MenHero() {
  return (
    <section className="men-hero" aria-labelledby="men-title">
      <img
        src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1800&h=900&fit=crop&auto=format"
        alt="Homme en entraînement dans une salle de sport"
      />
      <div className="men-hero-content">
        <span className="men-hero-eyebrow">Performance masculine</span>
        <h1 id="men-title">HOMME</h1>
      </div>
    </section>
  );
}

export default MenHero;
