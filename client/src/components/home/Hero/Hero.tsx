import { Link } from "react-router";
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
            <Link className="hero-button hero-button-primary" to="/collection">
              Découvrir la collection
            </Link>
            <Link
              className="hero-button hero-button-secondary"
              to="/collection/sales"
            >
              Voir les soldes
            </Link>
          </div>
        </div>
      </div>

      <div className="home-hero-grid">
        <Link className="home-hero-card home-hero-card-woman" to="/girl">
          <img
            src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=900&h=700&fit=crop&auto=format"
            alt="Femme portant une tenue de mode"
          />
          <span className="grid-img-label">FEMME</span>
        </Link>
        <Link className="home-hero-card home-hero-card-man" to="/men">
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&h=700&fit=crop&auto=format"
            alt="Homme portant une tenue de mode"
          />
          <span className="grid-img-label">HOMME</span>
        </Link>
        <Link
          className="home-hero-card home-hero-card-news"
          to="/collection/news"
        >
          <img
            src="https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=900&h=700&fit=crop&auto=format"
            alt="Nouveautés de la collection Korn"
          />
          <span className="grid-img-label">NOUVEAUTES</span>
        </Link>
        <Link
          className="home-hero-card home-hero-card-sale"
          to="/collection/sales"
        >
          <img
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=900&h=700&fit=crop&auto=format"
            alt="Vêtements en promotion pendant les soldes"
          />
          <span className="grid-img-label">SOLDES</span>
        </Link>
      </div>
    </section>
  );
}

export default Hero;
