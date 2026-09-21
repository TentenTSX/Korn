import { Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import "../Navbar/Navbar.css";
function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const soldes = [
    {
      name: "Winter",
      discount: -20,
    },
    {
      name: "Summer",
      discount: -30,
    },
    {
      name: "Spring",
      discount: -30,
    },
  ];
  return (
    <nav className="Navbar">
      <h1 className="Navbar-logo">Korn</h1>
      <ul className="Nav-links">
        <li className="nav-link">
          <a href="/homme">Homme</a>
        </li>
        <li className="nav-link">
          <a href="/femme">Femme</a>
        </li>
        <li className="nav-link">
          <a href="/news">Nouveautés</a>
        </li>
        <li className="nav-link">
          <a href="/collection">Collection</a>
        </li>
        <li className="nav-link">
          <a href="/soldes">Soldes</a>
          <span>{soldes[0].discount}%</span>
        </li>
      </ul>
      <button
        className="Nav-Search-button"
        type="button"
        aria-label={
          isSearchOpen ? "Fermer la recherche" : "Ouvrir la recherche"
        }
        onClick={() => setIsSearchOpen(!isSearchOpen)}
      >
        {isSearchOpen ? <X size={18} /> : <Search size={18} />}
      </button>

      {isSearchOpen && (
        <input
          className="Nav-Search-Inupt"
          type="text"
          aria-label="Rechercher un article"
          placeholder="Rechercher..."
        />
      )}
      <button
        className="Nav-bag-button"
        type="button"
        aria-label="Voir le panier"
      >
        <ShoppingBag size={18} strokeWidth={1.8} />
      </button>
    </nav>
  );
}

export default Navbar;
