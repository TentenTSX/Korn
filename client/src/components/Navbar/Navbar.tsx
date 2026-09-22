import { Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useState } from "react";
import "../Navbar/Navbar.css";

function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const soldes = [
    { name: "Winter", discount: -20 },
    { name: "Summer", discount: -30 },
    { name: "Spring", discount: -30 },
  ];

  return (
    <header className="Navbar">
      <a href="/" className="Navbar-logo" aria-label="Korn — accueil">
        Korn
      </a>

      <nav className="Navbar-nav" aria-label="Navigation principale">
        <ul className="Nav-links">
          <li className="nav-link">
            <a href="/men">Homme</a>
          </li>
          <li className="nav-link">
            <a href="/girl">Femme</a>
          </li>
          <li className="nav-link">
            <a href="/">Nouveautés</a>
          </li>
          <li className="nav-link">
            <a href="/collection">Collection</a>
          </li>
          <li className="nav-link">
            <a href="/collection">Soldes</a>
            <span aria-label={`${soldes[0].discount}% de réduction`}>
              {soldes[0].discount}%
            </span>
          </li>
        </ul>
      </nav>

      <div className="Navbar-actions">
        <form
          className={`Navbar-search ${isSearchOpen ? "is-open" : ""}`}
          aria-label="Recherche"
          onSubmit={(event) => event.preventDefault()}
        >
          <label htmlFor="main-search" className="sr-only">
            Rechercher un article
          </label>
          <input
            id="main-search"
            className="Nav-Search-Inupt"
            type="search"
            aria-label="Rechercher un article"
            placeholder="Rechercher..."
            aria-expanded={isSearchOpen}
          />
        </form>

        <button
          className="Nav-Search-button"
          type="button"
          aria-label={
            isSearchOpen ? "Fermer la recherche" : "Ouvrir la recherche"
          }
          aria-expanded={isSearchOpen}
          aria-controls="main-search"
          onClick={() => setIsSearchOpen((current) => !current)}
        >
          {isSearchOpen ? <X size={18} /> : <Search size={18} />}
        </button>

        <a
          className="Nav-profile-button"
          href="/profile"
          aria-label="Voir le profil"
        >
          <UserRound size={18} strokeWidth={1.8} />
        </a>

        <a className="Nav-bag-button" href="/cart" aria-label="Voir le panier">
          <ShoppingBag size={18} strokeWidth={1.8} />
        </a>
      </div>
    </header>
  );
}

export default Navbar;
