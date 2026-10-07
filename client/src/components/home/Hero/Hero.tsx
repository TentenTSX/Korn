import { Link } from "react-router";
import "./Hero.css";

function Hero() {
  return (
    <section className="home-hero" aria-label="Collection Korn">
      <div className="home-hero-main">
        <img src="/images/hero/man-red-tee-running.jpg" alt="" />
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
            src="/images/hero/woman-green-set.jpg"
            alt="Femme portant une tenue de mode"
          />
          <span className="grid-img-label">FEMME</span>
        </Link>
        <Link className="home-hero-card home-hero-card-man" to="/men">
          <img
            src="/images/hero/man-black-tank.jpg"
            alt="Homme portant une tenue de mode"
          />
          <span className="grid-img-label">HOMME</span>
        </Link>
        <Link
          className="home-hero-card home-hero-card-news"
          to="/collection/news"
        >
          <img
            src="/images/hero/man-grey-tee.jpg"
            alt="Nouveautés de la collection Korn"
          />
          <span className="grid-img-label">NOUVEAUTES</span>
        </Link>
        <Link
          className="home-hero-card home-hero-card-sale"
          to="/collection/sales"
        >
          <img
            src="/images/hero/man-black-tee-white-pants.jpg"
            alt="Vêtements en promotion pendant les soldes"
          />
          <span className="grid-img-label">SOLDES</span>
        </Link>
      </div>
    </section>
  );
}

export default Hero;
