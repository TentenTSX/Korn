import { Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useCartContext } from "../../contexts/CartContext";
import { useActiveSale } from "../../hooks/useActiveSale";
import { useSearchSuggestions } from "../../hooks/useSearchSuggestions";
import "../Navbar/Navbar.css";

const money = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
});

function Navbar() {
  const navigate = useNavigate();
  const { itemCount, openCart } = useCartContext();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const activeSale = useActiveSale();
  const searchWrapperRef = useRef<HTMLDivElement>(null);
  const { suggestions, isLoading: areSuggestionsLoading } =
    useSearchSuggestions(isSearchOpen ? search : "");
  const showSuggestions = isSearchOpen && search.trim().length >= 2;

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
        <div className="Navbar-search-wrapper" ref={searchWrapperRef}>
          <form
            className={`Navbar-search ${isSearchOpen ? "is-open" : ""}`}
            aria-label="Recherche"
            onSubmit={(event) => {
              event.preventDefault();
              goToSearchResults(search);
            }}
          >
            <Search
              className="Navbar-search-icon"
              size={16}
              aria-hidden="true"
            />
            <label htmlFor="main-search" className="sr-only">
              Rechercher un article
            </label>
            <input
              id="main-search"
              className="Nav-Search-Inupt"
              type="search"
              aria-label="Rechercher un article"
              placeholder="Rechercher un article..."
              aria-expanded={showSuggestions}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </form>

          {showSuggestions && (
            <div className="Navbar-search-results">
              {areSuggestionsLoading && suggestions.length === 0 && (
                <p className="Navbar-search-status">Recherche...</p>
              )}
              {!areSuggestionsLoading && suggestions.length === 0 && (
                <p className="Navbar-search-status">
                  Aucun article ne correspond à "{search.trim()}".
                </p>
              )}
              {suggestions.map((product) => (
                <Link
                  className="Navbar-search-result"
                  to={`/product/${product.id_product}`}
                  key={product.id_product}
                  onClick={closeSearch}
                >
                  <span className="Navbar-search-result-image">
                    {product.image && <img src={product.image} alt="" />}
                  </span>
                  <span className="Navbar-search-result-info">
                    <span className="Navbar-search-result-name">
                      {product.name}
                    </span>
                    <span className="Navbar-search-result-price">
                      {money.format(Number(product.price))}
                    </span>
                  </span>
                </Link>
              ))}
              {suggestions.length > 0 && (
                <button
                  className="Navbar-search-view-all"
                  type="button"
                  onClick={() => goToSearchResults(search)}
                >
                  Voir tous les résultats pour "{search.trim()}"
                </button>
              )}
            </div>
          )}
        </div>

        <button
          className="Nav-Search-button"
          type="button"
          aria-label={
            isSearchOpen ? "Fermer la recherche" : "Ouvrir la recherche"
          }
          aria-expanded={isSearchOpen}
          aria-controls="main-search"
          onClick={() => {
            if (isSearchOpen) closeSearch();
            else setIsSearchOpen(true);
          }}
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
