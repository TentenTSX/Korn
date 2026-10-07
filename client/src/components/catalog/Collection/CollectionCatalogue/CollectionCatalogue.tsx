import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { useActiveSale } from "../../../../hooks/useActiveSale";
import { useProducts } from "../../../../hooks/useProducts";
import { isRecentlyAdded } from "../../../../utils/productFreshness";
import CollectionFilters from "../CollectionFilters/CollectionFilters";
import CollectionProductCard from "../CollectionProductCard/CollectionProductCard";
import "./CollectionCatalogue.css";

const filterByRoute: Record<string, string> = {
  bestsellers: "Bestsellers",
  femme: "Femme",
  homme: "Homme",
  news: "Nouveautés",
  nouveautes: "Nouveautés",
  sales: "Soldes",
  soldes: "Soldes",
};

type CollectionProduct = {
  name: string;
  category: string;
  price: string;
  badge?: string;
  sale: boolean;
  isBestseller: boolean;
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

function CollectionCatalogue() {
  const { filter } = useParams();
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search")?.trim() ?? "";
  const { products: apiProducts } = useProducts(
    search ? `search=${encodeURIComponent(search)}` : "",
  );
  const { products: bestsellerProducts } = useProducts("sort=bestsellers");
  const routeFilter = filter ? filterByRoute[filter.toLowerCase()] : undefined;
  const [activeFilter, setActiveFilter] = useState(routeFilter ?? "Tout");
  const [sort, setSort] = useState("newest");
  const activeSale = useActiveSale();
  const bestsellerIds = new Set(
    bestsellerProducts.map((product) => product.id_product),
  );
  const products: CollectionProduct[] = apiProducts.map((product) => ({
    name: product.name,
    category: product.description ?? "Collection Korn",
    price: `${product.price} €`,
    categoryFilter: product.category_name ?? "Tout",
    image: product.image ?? "",
    alt: product.alt_text ?? product.name,
    badge: isRecentlyAdded(product.created_at) ? "NOUVEAU" : undefined,
    sale: Boolean(activeSale),
    isBestseller: bestsellerIds.has(product.id_product),
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

  useEffect(() => {
    setActiveFilter(routeFilter ?? "Tout");
  }, [routeFilter]);

  const visibleProducts =
    activeFilter === "Tout"
      ? uniqueProducts
      : uniqueProducts.filter((product) => {
          if (activeFilter === "Nouveautés") {
            return product.badge === "NOUVEAU";
          }
          if (activeFilter === "Bestsellers") {
            return product.isBestseller;
          }
          if (activeFilter === "Soldes") {
            return product.sale;
          }
          return product.categoryFilter === activeFilter;
        });
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
      <CollectionFilters
        initialFilter={routeFilter ?? "Tout"}
        onFilterChange={setActiveFilter}
        onSortChange={setSort}
      />
      <section
        className="collection-catalogue"
        aria-labelledby="collection-products-title"
      >
        <h2 id="collection-products-title" className="collection-product-count">
          {visibleProducts.length} produits
        </h2>
        {visibleProducts.length === 0 ? (
          <p className="collection-empty-state">
            {search
              ? `Aucun résultat pour "${search}".`
              : "Aucun produit ne correspond à ce filtre."}
          </p>
        ) : (
          <div className="collection-product-grid">
            {sortedProducts.map((product) => (
              <CollectionProductCard
                key={`${product.name}-${product.variantId ?? "demo"}`}
                {...product}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default CollectionCatalogue;
