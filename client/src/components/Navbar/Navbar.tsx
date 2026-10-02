import { ShoppingBag, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useCartContext } from "../../contexts/CartContext";
import { useActiveSale } from "../../hooks/useActiveSale";
import { useSearchSuggestions } from "../../hooks/useSearchSuggestions";
import NavbarSearch from "./NavbarSearch";
import "../Navbar/Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { itemCount, openCart } = useCartContext();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const activeSale = useActiveSale();
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const { suggestions, isLoading: areSuggestionsLoading } =
    useSearchSuggestions(isSearchOpen ? search : "");

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearch("");
  };

  const goToSearchResults = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigate(`/collection?search=${encodeURIComponent(trimmed)}`);
    setIsSearchOpen(false);
    setSearch("");
  };

  useEffect(() => {
    if (!isSearchOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (
        searchWrapperRef.current &&
        !searchWrapperRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
        setSearch("");
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
        setSearch("");
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSearchOpen]);

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
          {activeSale && (
            <li className="nav-link">
              <Link to="/collection/sales">Soldes</Link>
              <span aria-label={`${activeSale.discount_percent}% de réduction`}>
                -{activeSale.discount_percent}%
              </span>
            </li>
          )}
        </ul>
      </nav>

      <div className="Navbar-actions">
        <NavbarSearch
          searchWrapperRef={searchWrapperRef}
          isSearchOpen={isSearchOpen}
          search={search}
          suggestions={suggestions}
          areSuggestionsLoading={areSuggestionsLoading}
          onSearchChange={setSearch}
          onSubmit={goToSearchResults}
          onToggle={() => {
            if (isSearchOpen) closeSearch();
            else setIsSearchOpen(true);
          }}
          onClose={closeSearch}
        />

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
