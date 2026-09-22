import "./Hero.css";

function Hero() {
  return (
    <section className="home-hero" aria-label="Collection Korn">
      <div className="home-hero-main">
        <img
          src="https://images.unsplash.com/photo-1618453292507-4959ece6429e?w=1800&h=1200&fit=crop&auto=format"
          alt=""
        />
        <div className="hero-text-div">
          <i className="home-hero-text">Collection été 2027</i>
          <h1 className="home-hero-label">DEFINE YOUR FORM.</h1>
          <div className="hero-actions">
            <a className="hero-button hero-button-primary" href="/collection">
              Découvrir la collection
            </a>
            <a className="hero-button hero-button-secondary" href="/soldes">
              Voir les soldes
            </a>
          </div>
        </div>
      </div>

      <div className="home-hero-grid">
        <a className="home-hero-card home-hero-card-woman" href="/femme">
          <img
            src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=900&h=700&fit=crop&auto=format"
            alt="Femme portant une tenue de mode"
          />
          <span className="grid-img-label">FEMME</span>
        </a>
        <a className="home-hero-card home-hero-card-man" href="/homme">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&h=700&fit=crop&auto=format"
            alt="Homme portant une tenue de mode"
          />
          <span className="grid-img-label">HOMME</span>
        </a>
        <a className="home-hero-card home-hero-card-news" href="/news">
          <img
            src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=900&h=700&fit=crop&auto=format"
            alt="Nouveautés de la collection Korn"
          />
          <span className="grid-img-label">NOUVEAUTES</span>
        </a>
        <a className="home-hero-card home-hero-card-sale" href="/soldes">
          <img
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=900&h=700&fit=crop&auto=format"
            alt="Vêtements en promotion pendant les soldes"
          />
          <span className="grid-img-label">SOLDES</span>
        </a>
      </div>
    </section>
  );
}

export default Hero;
