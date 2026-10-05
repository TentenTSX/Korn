import { Search, X } from "lucide-react";
import type { RefObject } from "react";
import { Link } from "react-router";
import type { Product } from "../../types/product";
import { currency as money } from "../../utils/currency";

type NavbarSearchProps = {
  searchWrapperRef: RefObject<HTMLDivElement | null>;
  isSearchOpen: boolean;
  search: string;
  suggestions: Product[];
  areSuggestionsLoading: boolean;
  onSearchChange: (value: string) => void;
  onSubmit: (query: string) => void;
  onToggle: () => void;
  onClose: () => void;
};

function NavbarSearch({
  searchWrapperRef,
  isSearchOpen,
  search,
  suggestions,
  areSuggestionsLoading,
  onSearchChange,
  onSubmit,
  onToggle,
  onClose,
}: NavbarSearchProps) {
  const showSuggestions = isSearchOpen && search.trim().length >= 2;

  return (
    <div className="Navbar-search-wrapper" ref={searchWrapperRef}>
      <form
        className={`Navbar-search ${isSearchOpen ? "is-open" : ""}`}
        aria-label="Recherche"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit(search);
        }}
      >
        <Search className="Navbar-search-icon" size={16} aria-hidden="true" />
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
          onChange={(event) => onSearchChange(event.target.value)}
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
              onClick={onClose}
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
              onClick={() => onSubmit(search)}
            >
              Voir tous les résultats pour "{search.trim()}"
            </button>
          )}
        </div>
      )}

      <button
        className="Nav-Search-button"
        type="button"
        aria-label={
          isSearchOpen ? "Fermer la recherche" : "Ouvrir la recherche"
        }
        aria-expanded={isSearchOpen}
        aria-controls="main-search"
        onClick={onToggle}
      >
        {isSearchOpen ? <X size={18} /> : <Search size={18} />}
      </button>
    </div>
  );
}

export default NavbarSearch;
