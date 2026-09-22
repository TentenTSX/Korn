import { useState } from "react";
import GirlFilters from "../GirlFilters/GirlFilters";
import GirlProductCard from "../GirlProductCard/GirlProductCard";

const products = [
  {
    name: "Motion Bra",
    category: "Brassière maintien moyen",
    price: "49 €",
    badge: "NOUVEAU",
    categoryFilter: "Brassières",
    image:
      "https://images.unsplash.com/photo-1506629905607-d9c297d7e5b7?w=900&h=1125&fit=crop&auto=format",
    alt: "Femme portant une brassière noire de sport",
  },
  {
    name: "Contour Legging",
    category: "Legging sculptant",
    price: "75 €",
    badge: "NOUVEAU",
    categoryFilter: "Leggings",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&h=1125&fit=crop&auto=format",
    alt: "Femme portant un legging noir",
  },
  {
    name: "Core Short",
    category: "Short d'entraînement",
    price: "49 €",
    badge: "BESTSELLER",
    categoryFilter: "Shorts",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&h=1125&fit=crop&auto=format",
    alt: "Femme portant un short de sport noir",
  },
  {
    name: "Essential Tee",
    category: "T-shirt coupe droite",
    price: "39 €",
    categoryFilter: "T-shirts",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&h=1125&fit=crop&auto=format",
    alt: "Femme portant un t-shirt blanc",
  },
  {
    name: "Soft Crewneck",
    category: "Sweat col rond doux",
    price: "79 €",
    categoryFilter: "Sweats",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&h=1125&fit=crop&auto=format",
    alt: "Sweat oversize gris",
  },
  {
    name: "Flex Bra",
    category: "Brassière dos nageur",
    price: "45 €",
    categoryFilter: "Brassières",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&h=1125&fit=crop&auto=format",
    alt: "Femme portant une tenue de sport",
  },
  {
    name: "Studio Legging",
    category: "Legging haute performance",
    price: "69 €",
    categoryFilter: "Leggings",
    image:
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=900&h=1125&fit=crop&auto=format",
    alt: "Femme portant un legging de sport",
  },
  {
    name: "Performance Tee",
    category: "T-shirt technique",
    price: "55 €",
    badge: "BESTSELLER",
    categoryFilter: "T-shirts",
    image:
      "https://images.unsplash.com/photo-1506629905607-d9c297d7e5b7?w=900&h=1125&fit=crop&auto=format",
    alt: "Femme portant un t-shirt technique noir",
  },
];

function GirlCatalogue() {
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
      <GirlFilters onFilterChange={setActiveFilter} onSortChange={setSort} />
      <section className="girl-catalogue" aria-labelledby="girl-products-title">
        <h2 id="girl-products-title" className="girl-product-count">
          {visibleProducts.length} produits
        </h2>
        <div className="girl-product-grid">
          {sortedProducts.map((product) => (
            <GirlProductCard key={product.name} {...product} />
          ))}
        </div>
      </section>
    </>
  );
}

export default GirlCatalogue;
