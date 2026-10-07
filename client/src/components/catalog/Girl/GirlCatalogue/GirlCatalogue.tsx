import { useState } from "react";
import { useProducts } from "../../../../hooks/useProducts";
import GirlFilters from "../GirlFilters/GirlFilters";
import GirlProductCard from "../GirlProductCard/GirlProductCard";
import "./GirlCatalogue.css";

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
  colors?: string[];
  stockQuantity?: number;
};

function GirlCatalogue() {
  const { products: apiProducts } = useProducts("gender=Femme");
  const [activeFilter, setActiveFilter] = useState("Tout");
  const [sort, setSort] = useState("newest");
  const products: CatalogProduct[] = apiProducts.map((product) => ({
    name: product.name,
    category: product.description ?? "Collection Femme",
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
  // Each product can have many color/size variants; the grid shows one card
  // per product (its first variant), color and size selection happens on
  // the product page instead of duplicating a card per variant. Each card
  // still lists the product's distinct colors as small pins.
  const seenProductIds = new Set<number | null | undefined>();
  const uniqueProducts = products
    .filter((product) => {
      if (seenProductIds.has(product.productId)) return false;
      seenProductIds.add(product.productId);
      return true;
    })
    .map((product) => ({
      ...product,
      colors: Array.from(
        new Set(
          products
            .filter((variant) => variant.productId === product.productId)
            .map((variant) => variant.color)
            .filter((color): color is string => Boolean(color)),
        ),
      ),
    }));
  const visibleProducts =
    activeFilter === "Tout"
      ? uniqueProducts
      : uniqueProducts.filter(
          (product) => product.categoryFilter === activeFilter,
        );
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
            <GirlProductCard
              key={`${product.name}-${product.variantId ?? "demo"}`}
              {...product}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export default GirlCatalogue;
