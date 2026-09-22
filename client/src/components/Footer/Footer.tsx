import "./Footer.css";

const boutiqueLinks = ["Home", "Femme", "Accessoires", "Nouveautés", "Soldes"];

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
              <li key={link}>
                <a href="/">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-column">
          <h3>AIDE</h3>
          <ul>
            {aideLinks.map((link) => (
              <li key={link}>
                <a href="/">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-column">
          <h3>MARQUE</h3>
          <ul>
            {marqueLinks.map((link) => (
              <li key={link}>
                <a href="/">{link}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="site-footer-bottom">
        <p>© 2026 KORN SAS. Tous droits réservés.</p>
        <div className="bottom-links">
          <a href="/">Confidentialité</a>
          <a href="/">CGV</a>
          <a href="/">Mentions légales</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
