import { useState } from "react";
import { useProducts } from "../../../../hooks/useProducts";
import MenFilters from "../MenFilters/MenFilters";
import MenProductCard from "../MenProductCard/MenProductCard";
import "./MenCatalogue.css";

type CatalogProduct = {
  name: string;
  category: string;
  price: string;
  badge?: string;
  categoryFilter: string;
  image: string;
  alt: string;
  variantId?: number | null;
  productId?: number | null;
  size?: string | null;
  color?: string | null;
  stockQuantity?: number;
};

function MenCatalogue() {
  const { products: apiProducts } = useProducts("gender=Homme");
  const [activeFilter, setActiveFilter] = useState("Tout");
  const [sort, setSort] = useState("newest");
  const products: CatalogProduct[] = apiProducts.map((product) => ({
    name: product.name,
    category: product.description ?? "Collection Homme",
    price: `${product.price} €`,
    categoryFilter: product.subcategory_name ?? "Tout",
    image: product.image ?? "",
    alt: product.alt_text ?? product.name,
    variantId: product.id_variant,
    productId: product.id_product,
    size: product.size,
    color: product.color,
    stockQuantity: product.stock_quantity,
  }));
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
            <MenProductCard
              key={`${product.name}-${product.variantId ?? "demo"}`}
              {...product}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default MenCatalogue;
