import { Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useCartContext } from "../../contexts/CartContext";
import "../Navbar/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { itemCount, openCart } = useCartContext();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const soldes = [
    { name: "Winter", discount: -20 },
    { name: "Summer", discount: -30 },
    { name: "Spring", discount: -30 },
  ];

  return (
    <header className="Navbar">
      <Link to="/" className="Navbar-logo" aria-label="Korn — accueil">
        Korn
      </Link>

      <nav className="Navbar-nav" aria-label="Navigation principale">
        <ul className="Nav-links">
          <li className="nav-link">
            <Link to="/men">Homme</Link>
          </li>
          <li className="nav-link">
            <Link to="/girl">Femme</Link>
          </li>
          <li className="nav-link">
            <Link to="/collection/news">Nouveautés</Link>
          </li>
          <li className="nav-link">
            <Link to="/collection">Collection</Link>
          </li>
          <li className="nav-link">
            <Link to="/collection/sales">Soldes</Link>
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
          onSubmit={(event) => {
            event.preventDefault();
            const query = search.trim();
            if (query)
              navigate(`/collection?search=${encodeURIComponent(query)}`);
          }}
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
            value={search}
            onChange={(event) => setSearch(event.target.value)}
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

        <Link
          className="Nav-profile-button"
          to="/profile"
          aria-label="Voir le profil"
        >
          <UserRound size={18} strokeWidth={1.8} />
        </Link>

        <button
          className="Nav-bag-button"
          type="button"
          onClick={openCart}
          aria-label={`Ouvrir le panier, ${itemCount} article${itemCount === 1 ? "" : "s"}`}
          title="Ouvrir le panier"
        >
          <ShoppingBag size={18} strokeWidth={1.8} />
          {itemCount > 0 && <span className="Nav-bag-count">{itemCount}</span>}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
