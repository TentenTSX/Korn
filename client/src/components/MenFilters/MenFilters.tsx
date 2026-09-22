import { useState } from "react";

const filters = [
  "Tout",
  "Débardeurs",
  "Pantalons",
  "Shorts",
  "Sweats",
  "T-shirts",
];

type MenFiltersProps = {
  onFilterChange: (filter: string) => void;
};

function MenFilters({ onFilterChange }: MenFiltersProps) {
  const [activeFilter, setActiveFilter] = useState("Tout");

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };

  return (
    <div className="men-toolbar">
      <p className="men-breadcrumb">
        Accueil <span aria-hidden="true">›</span> Homme
      </p>
      <div className="men-filters">
        <ul className="men-filter-list" aria-label="Filtrer les produits">
          {filters.map((filter) => (
            <li key={filter}>
              <button
                className={`men-filter-button ${activeFilter === filter ? "is-active" : ""}`}
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
          <select className="men-sort-select" defaultValue="newest">
            <option value="newest">Trier : nouveautés</option>
            <option value="price-low">Prix croissant</option>
            <option value="price-high">Prix décroissant</option>
          </select>
        </label>
      </div>
    </div>
  );
}

export default MenFilters;
