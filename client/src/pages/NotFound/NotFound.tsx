import { Link } from "react-router";
import "./NotFound.css";

function NotFound() {
  return (
    <main className="not-found-page">
      <img
        src="https://images.unsplash.com/photo-1483721310020-03333e577078?w=1800&h=1400&fit=crop&auto=format"
        alt=""
      />
      <div className="not-found-content">
        <i className="not-found-eyebrow">Erreur 404</i>
        <p className="not-found-code">404</p>
        <h1>Cette page s'est perdue en route.</h1>
        <p className="not-found-text">
          Le lien que tu as suivi est cassé, ou la page a été déplacée.
        </p>
        <div className="not-found-actions">
          <Link className="not-found-button not-found-button-primary" to="/">
            Retour à l'accueil
          </Link>
          <Link
            className="not-found-button not-found-button-secondary"
            to="/collection"
          >
            Voir la collection
          </Link>
        </div>
      </div>
    </main>
  );
}

export default NotFound;
