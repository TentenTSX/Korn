import { useEffect, useState } from "react";
import "./CollectionFilters.css";

const filters = [
  "Tout",
  "Homme",
  "Femme",
  "Nouveautés",
  "Soldes",
  "Bestsellers",
];

type CollectionFiltersProps = {
  initialFilter: string;
  onFilterChange: (filter: string) => void;
  onSortChange: (sort: string) => void;
};

function CollectionFilters({
  initialFilter,
  onFilterChange,
  onSortChange,
}: CollectionFiltersProps) {
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  useEffect(() => {
    setActiveFilter(initialFilter);
  }, [initialFilter]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };

  return (
    <div className="collection-toolbar">
      <p className="collection-breadcrumb">
        Accueil <span aria-hidden="true">›</span> Collection
      </p>
      <div className="collection-filters">
        <ul
          className="collection-filter-list"
          aria-label="Filtrer les produits"
        >
          {filters.map((filter) => (
            <li key={filter}>
              <button
                className={`collection-filter-button ${activeFilter === filter ? "is-active" : ""}`}
                type="button"
                aria-pressed={activeFilter === filter}
                onClick={() => handleFilterChange(filter)}
              >
                {filter}
                {filter === "Tout" && " (8)"}
              </button>
            </li>
          ))}
        </ul>
        <label>
          <span className="sr-only">Trier les produits</span>
          <select
            className="collection-sort-select"
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
  );
}

export default CollectionFilters;
