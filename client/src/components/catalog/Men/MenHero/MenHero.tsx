import "./MenHero.css";

function MenHero() {
  return (
    <section className="men-hero" aria-labelledby="men-title">
      <img
        src="/images/hero/man-red-tee-running.webp"
        alt="Homme en entraînement dans une salle de sport"
        width={805}
        height={1200}
      />
      <div className="men-hero-content">
        <span className="men-hero-eyebrow">Performance masculine</span>
        <h1 id="men-title">HOMME</h1>
      </div>
    </section>
  );
}

export default MenHero;
