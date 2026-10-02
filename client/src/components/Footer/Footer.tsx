import { Link } from "react-router";
import "./Footer.css";

const boutiqueLinks = [
  { label: "Home", to: "/" },
  { label: "Femme", to: "/girl" },
  { label: "Accessoires", to: "/" },
  { label: "Nouveautés", to: "/collection/news" },
  { label: "Soldes", to: "/collection/sales" },
];

const aideLinks = [
  "FAQ",
  "Livraison",
  "Retours",
  "Guide des tailles",
  "Contact",
];

const marqueLinks = [
  "Notre histoire",
  "Durabilité",
  "Presse",
  "Affiliation",
  "Carrières",
];

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-newsletter">
        <div className="newsletter-header">
          <span className="newsletter-letter">K</span>
          <h2>REJOIGNEZ LA COMMUNAUTÉ</h2>
        </div>

        <p className="newsletter-copy">
          Accédez en avant-première aux nouvelles collections, drops exclusifs
          et offres membres.
        </p>

        <form className="newsletter-form">
          <label className="sr-only" htmlFor="newsletter-email">
            Votre adresse email
          </label>
          <input
            id="newsletter-email"
            type="email"
            placeholder="VOTRE ADRESSE EMAIL"
          />
          <button type="submit">S'INSCRIRE</button>
        </form>

        <p className="newsletter-note">
          Pas de spam. Désinscription à tout moment.
        </p>
      </div>

      <div className="site-footer-grid">
        <div className="footer-brand">
          <div className="brand-name">
            <span className="brand-letter">K</span>
            <span>ORN</span>
          </div>
          <p>Performance. Style. Sans compromis.</p>
          <div className="brand-socials" aria-label="Réseaux sociaux">
            <span>IG</span>
            <span>TK</span>
            <span>YT</span>
          </div>
        </div>

        <div className="footer-column">
          <h3>BOUTIQUE</h3>
          <ul>
            {boutiqueLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-column">
          <h3>AIDE</h3>
          <ul>
            {aideLinks.map((link) => (
              <li key={link}>
                <Link to="/">{link}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-column">
          <h3>MARQUE</h3>
          <ul>
            {marqueLinks.map((link) => (
              <li key={link}>
                <Link to="/">{link}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="site-footer-bottom">
        <p>© 2026 KORN SAS. Tous droits réservés.</p>
        <div className="bottom-links">
          <Link to="/">Confidentialité</Link>
          <Link to="/">CGV</Link>
          <Link to="/">Mentions légales</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
