import { useState } from "react";
import MenFilters from "../MenFilters/MenFilters";
import MenProductCard from "../MenProductCard/MenProductCard";
import "./MenCatalogue.css";

const products = [
  {
    name: "Training Tank",
    category: "Débardeur performance",
    price: "45 €",
    badge: "NOUVEAU",
    categoryFilter: "Débardeurs",
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&h=1125&fit=crop&auto=format",
    alt: "Homme portant un débardeur noir de sport",
  },
  {
    name: "Motion Pant",
    category: "Pantalon technique",
    price: "95 €",
    badge: "NOUVEAU",
    categoryFilter: "Pantalons",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&h=1125&fit=crop&auto=format",
    alt: "Pantalon technique noir porté pendant un entraînement",
  },
  {
    name: "Core Short",
    category: "Short d'entraînement",
    price: "55 €",
    badge: "BESTSELLER",
    categoryFilter: "Shorts",
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900&h=1125&fit=crop&auto=format",
    alt: "Athlète portant un short noir",
  },
  {
    name: "Essential Tee",
    category: "T-shirt coupe droite",
    price: "39 €",
    categoryFilter: "T-shirts",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&h=1125&fit=crop&auto=format",
    alt: "Homme portant un t-shirt noir",
  },
  {
    name: "Heavy Crewneck",
    category: "Sweat col rond épais",
    price: "79 €",
    categoryFilter: "Sweats",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&h=1125&fit=crop&auto=format",
    alt: "Sweat gris oversize",
  },
  {
    name: "Aero Tank",
    category: "Débardeur respirant",
    price: "42 €",
    categoryFilter: "Débardeurs",
    image:
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=900&h=1125&fit=crop&auto=format",
    alt: "Tenue de sport pour homme en extérieur",
  },
  {
    name: "Relax Cargo",
    category: "Pantalon cargo",
    price: "99 €",
    categoryFilter: "Pantalons",
    image:
      "https://images.unsplash.com/photo-1506629905607-d9c297d7e5b7?w=900&h=1125&fit=crop&auto=format",
    alt: "Pantalon cargo noir",
  },
  {
    name: "Performance Tee",
    category: "T-shirt technique",
    price: "59 €",
    badge: "BESTSELLER",
    categoryFilter: "T-shirts",
    image:
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=900&h=1125&fit=crop&auto=format",
    alt: "T-shirt technique noir pour homme",
  },
];

function MenCatalogue() {
  const [activeFilter, setActiveFilter] = useState("Tout");
  const [sort, setSort] = useState("newest");
  const visibleProducts =
    activeFilter === "Tout"
      ? products
      : products.filter((product) => product.categoryFilter === activeFilter);
  const sortedProducts = [...visibleProducts].sort(
    (firstProduct, secondProduct) => {
      if (sort === "price-low") {
        return (
          Number.parseInt(firstProduct.price, 10) -
          Number.parseInt(secondProduct.price, 10)
        );
      }
      if (sort === "price-high") {
        return (
          Number.parseInt(secondProduct.price, 10) -
          Number.parseInt(firstProduct.price, 10)
        );
      }
      return 0;
    },
  );

  return (
    <>
      <MenFilters onFilterChange={setActiveFilter} onSortChange={setSort} />
      <section className="men-catalogue" aria-labelledby="men-products-title">
        <h2 id="men-products-title" className="men-product-count">
          {visibleProducts.length} produits
        </h2>
        <div className="men-product-grid">
          {sortedProducts.map((product) => (
            <MenProductCard key={product.name} {...product} />
          ))}
        </div>
      </section>
    </>
  );
}

export default MenCatalogue;
