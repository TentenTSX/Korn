import { useEffect, useState } from "react";
import "./CatalogueFilters.css";

type CatalogueFiltersProps = {
  filters: string[];
  breadcrumbLabel: string;
  initialFilter: string;
  showOutOfStock: boolean;
  onFilterChange: (filter: string) => void;
  onSortChange: (sort: string) => void;
  onShowOutOfStockChange: (showOutOfStock: boolean) => void;
};

function CatalogueFilters({
  filters,
  breadcrumbLabel,
  initialFilter,
  showOutOfStock,
  onFilterChange,
  onSortChange,
  onShowOutOfStockChange,
}: CatalogueFiltersProps) {
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  useEffect(() => {
    setActiveFilter(initialFilter);
  }, [initialFilter]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };

  return (
    <div className="catalogue-toolbar">
      <p className="catalogue-breadcrumb">
        Accueil <span aria-hidden="true">›</span> {breadcrumbLabel}
      </p>
      <div className="catalogue-filters">
        <ul className="catalogue-filter-list" aria-label="Filtrer les produits">
          {filters.map((filter) => (
            <li key={filter}>
              <button
                className={`catalogue-filter-button ${activeFilter === filter ? "is-active" : ""}`}
                type="button"
                aria-pressed={activeFilter === filter}
                onClick={() => handleFilterChange(filter)}
              >
                {filter}
              </button>
            </li>
          ))}
        </ul>
        <div className="catalogue-filter-controls">
          <label className="catalogue-stock-toggle">
            <input
              type="checkbox"
              checked={showOutOfStock}
              onChange={(event) => onShowOutOfStockChange(event.target.checked)}
            />
            Afficher les produits bientôt disponibles
          </label>
          <label>
            <span className="sr-only">Trier les produits</span>
            <select
              className="catalogue-sort-select"
              defaultValue="newest"
              onChange={(event) => onSortChange(event.target.value)}
            >
              <option value="newest">Trier : nouveautés</option>
              <option value="price-low">Prix croissant</option>
              <option value="price-high">Prix décroissant</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}

export default CatalogueFilters;
