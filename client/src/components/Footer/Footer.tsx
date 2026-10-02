import { Link } from "react-router";
import FooterLinkColumn from "./FooterLinkColumn";
import FooterNewsletter from "./FooterNewsletter";
import "./Footer.css";

const boutiqueLinks = [
  { label: "Home", to: "/" },
  { label: "Femme", to: "/girl" },
  { label: "Accessoires", to: "/" },
  { label: "Nouveautés", to: "/collection/news" },
  { label: "Soldes", to: "/collection/sales" },
];

const aideLinks = [
  { label: "FAQ", to: "/pages/faq" },
  { label: "Livraison", to: "/pages/livraison" },
  { label: "Retours", to: "/pages/retours" },
  { label: "Guide des tailles", to: "/pages/guide-des-tailles" },
  { label: "Contact", to: "/pages/contact" },
];

const marqueLinks = [
  { label: "Notre histoire", to: "/pages/notre-histoire" },
  { label: "Durabilité", to: "/pages/durabilite" },
  { label: "Presse", to: "/pages/presse" },
  { label: "Affiliation", to: "/pages/affiliation" },
  { label: "Carrières", to: "/pages/carrieres" },
];

function Footer() {
  return (
    <footer className="site-footer">
      <FooterNewsletter />

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

        <FooterLinkColumn title="BOUTIQUE" links={boutiqueLinks} />
        <FooterLinkColumn title="AIDE" links={aideLinks} />
        <FooterLinkColumn title="MARQUE" links={marqueLinks} />
      </div>

      <div className="site-footer-bottom">
        <p>© 2026 KORN SAS. Tous droits réservés.</p>
        <div className="bottom-links">
          <Link to="/pages/confidentialite">Confidentialité</Link>
          <Link to="/pages/cgv">CGV</Link>
          <Link to="/pages/mentions-legales">Mentions légales</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
