import { Menu, ShoppingBag, UserRound, X } from "lucide-react";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const activeSale = useActiveSale();
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const mobileNavRef = useRef<HTMLElement>(null);
  const mobileMenuToggleRef = useRef<HTMLButtonElement>(null);
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

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (
        mobileNavRef.current &&
        !mobileNavRef.current.contains(target) &&
        mobileMenuToggleRef.current &&
        !mobileMenuToggleRef.current.contains(target)
      ) {
        setIsMobileMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="Navbar">
      <Link to="/" className="Navbar-logo" aria-label="Korn — accueil">
        Korn
      </Link>

      <nav
        className={`Navbar-nav ${isMobileMenuOpen ? "is-open" : ""}`}
        aria-label="Navigation principale"
        ref={mobileNavRef}
      >
        <ul className="Nav-links">
          <li className="nav-link">
            <Link to="/men" onClick={() => setIsMobileMenuOpen(false)}>
              Homme
            </Link>
          </li>
          <li className="nav-link">
            <Link to="/girl" onClick={() => setIsMobileMenuOpen(false)}>
              Femme
            </Link>
          </li>
          <li className="nav-link">
            <Link
              to="/collection/news"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Nouveautés
            </Link>
          </li>
          <li className="nav-link">
            <Link to="/collection" onClick={() => setIsMobileMenuOpen(false)}>
              Collection
            </Link>
          </li>
          {activeSale && (
            <li className="nav-link">
              <Link
                to="/collection/sales"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Soldes
              </Link>
              <span aria-label={`${activeSale.discount_percent}% de réduction`}>
                -{activeSale.discount_percent}%
              </span>
            </li>
          )}
          <li className="nav-link nav-link-auth">
            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
              Connexion / Inscription
            </Link>
          </li>
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

        <button
          className="Nav-menu-toggle"
          type="button"
          ref={mobileMenuToggleRef}
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setIsMobileMenuOpen((open) => !open)}
        >
          {isMobileMenuOpen ? (
            <X size={20} strokeWidth={1.8} />
          ) : (
            <Menu size={20} strokeWidth={1.8} />
          )}
        </button>
      </div>
    </header>
  );
}

export default Navbar;
