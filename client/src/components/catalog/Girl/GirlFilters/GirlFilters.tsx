import { useState } from "react";
import "./GirlFilters.css";

const filters = [
  "Tout",
  "Brassières",
  "Leggings",
  "Shorts",
  "Sweats",
  "T-shirts",
];

type GirlFiltersProps = {
  onFilterChange: (filter: string) => void;
  onSortChange: (sort: string) => void;
};

function GirlFilters({ onFilterChange, onSortChange }: GirlFiltersProps) {
  const [activeFilter, setActiveFilter] = useState("Tout");

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };

  return (
    <div className="girl-toolbar">
      <p className="girl-breadcrumb">
        Accueil <span aria-hidden="true">›</span> Femme
      </p>
      <div className="girl-filters">
        <ul className="girl-filter-list" aria-label="Filtrer les produits">
          {filters.map((filter) => (
            <li key={filter}>
              <button
                className={`girl-filter-button ${activeFilter === filter ? "is-active" : ""}`}
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
            className="girl-sort-select"
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

export default GirlFilters;
