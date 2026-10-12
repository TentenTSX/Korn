import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { useActiveSale } from "../../../hooks/useActiveSale";
import { useProducts } from "../../../hooks/useProducts";
import { isRecentlyAdded } from "../../../utils/productFreshness";
import CatalogueFilters from "../CatalogueFilters/CatalogueFilters";
import CataloguePagination from "../CataloguePagination/CataloguePagination";
import CatalogueProductCard from "../CatalogueProductCard/CatalogueProductCard";
import "./Catalogue.css";

const PAGE_SIZE = 12;

const SUBCATEGORY_FILTERS: Record<"Homme" | "Femme", string[]> = {
  Homme: ["Tout", "Débardeurs", "Pantalons", "Shorts", "Sweats", "T-shirts"],
  Femme: ["Tout", "Brassières", "Leggings", "Shorts", "Sweats", "T-shirts"],
};

const COLLECTION_FILTERS = [
  "Tout",
  "Homme",
  "Femme",
  "Nouveautés",
  "Soldes",
  "Bestsellers",
];

const filterByRoute: Record<string, string> = {
  bestsellers: "Bestsellers",
  femme: "Femme",
  homme: "Homme",
  news: "Nouveautés",
  nouveautes: "Nouveautés",
  sales: "Soldes",
  soldes: "Soldes",
};

type CatalogueProps = {
  gender?: "Homme" | "Femme";
};

type CatalogueProduct = {
  name: string;
  category: string;
  price: number;
  badge?: string;
  isBestseller: boolean;
  categoryFilter: string;
  image: string;
  alt: string;
  focalPoint?: string | null;
  variantId?: number | null;
  productId?: number | null;
  size?: string | null;
  color?: string | null;
  colors?: string[];
  stockQuantity?: number;
  outOfStock: boolean;
};

function Catalogue({ gender }: CatalogueProps) {
  const activeSale = useActiveSale();
  const { filter } = useParams();
  const [searchParams] = useSearchParams();
  const search = gender ? "" : (searchParams.get("search")?.trim() ?? "");
  const { products: apiProducts } = useProducts(
    gender
      ? `gender=${gender}`
      : search
        ? `search=${encodeURIComponent(search)}`
        : "",
  );
  const { products: bestsellerProducts } = useProducts(
    "sort=bestsellers",
    !gender,
  );
  const routeFilter =
    !gender && filter ? filterByRoute[filter.toLowerCase()] : undefined;
  const [activeFilter, setActiveFilter] = useState(routeFilter ?? "Tout");
  const [sort, setSort] = useState("newest");
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [page, setPage] = useState(1);
  const bestsellerIds = new Set(
    bestsellerProducts.map((product) => product.id_product),
  );
  // The API already returns one row per product (with its full colors
  // list), so no dedup pass is needed here.
  const uniqueProducts: CatalogueProduct[] = apiProducts.map((product) => ({
    name: product.name,
    category:
      product.description ??
      (gender ? `Collection ${gender}` : "Collection Korn"),
    price: Number(product.price),
    categoryFilter:
      (gender ? product.subcategory_name : product.category_name) ?? "Tout",
    image: product.image ?? "",
    alt: product.alt_text ?? product.name,
    focalPoint: product.focal_point,
    badge: isRecentlyAdded(product.created_at) ? "NOUVEAU" : undefined,
    isBestseller: bestsellerIds.has(product.id_product),
    variantId: product.id_variant,
    productId: product.id_product,
    size: product.size,
    color: product.color,
    colors: product.colors ?? [],
    stockQuantity: product.stock_quantity,
    outOfStock: Number(product.total_stock) <= 0,
  }));

  useEffect(() => {
    if (!gender) setActiveFilter(routeFilter ?? "Tout");
  }, [routeFilter, gender]);

  // The sale discount is applied via a promo code entered in the cart, not
  // per product, so there is nothing to list under "Soldes" — the catalogue
  // points shoppers at the code instead.
  const stockFilteredProducts = showOutOfStock
    ? uniqueProducts
    : uniqueProducts.filter((product) => !product.outOfStock);
  const visibleProducts =
    !gender && activeFilter === "Soldes"
      ? []
      : activeFilter === "Tout"
        ? stockFilteredProducts
        : stockFilteredProducts.filter((product) => {
            if (!gender && activeFilter === "Nouveautés") {
              return product.badge === "NOUVEAU";
            }
            if (!gender && activeFilter === "Bestsellers") {
              return product.isBestseller;
            }
            return product.categoryFilter === activeFilter;
          });
  const sortedProducts = [...visibleProducts].sort(
    (firstProduct, secondProduct) => {
      if (sort === "price-low") {
        return firstProduct.price - secondProduct.price;
      }
      if (sort === "price-high") {
        return secondProduct.price - firstProduct.price;
      }
      return 0;
    },
  );
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE));
  // Clamp rather than reset via effect: switching to a filter with fewer
  // pages snaps back into range on its own, without an extra render pass.
  const safePage = Math.min(page, totalPages);
  const paginatedProducts = sortedProducts.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  const filters = gender ? SUBCATEGORY_FILTERS[gender] : COLLECTION_FILTERS;
  const breadcrumbLabel = gender ?? "Collection";

  return (
    <>
      <CatalogueFilters
        filters={filters}
        breadcrumbLabel={breadcrumbLabel}
        initialFilter={routeFilter ?? "Tout"}
        showOutOfStock={showOutOfStock}
        onFilterChange={setActiveFilter}
        onSortChange={setSort}
        onShowOutOfStockChange={setShowOutOfStock}
      />
      <section className="catalogue" aria-labelledby="catalogue-products-title">
        <h2 id="catalogue-products-title" className="catalogue-product-count">
          {visibleProducts.length} produits
        </h2>
        {visibleProducts.length === 0 ? (
          <p className="catalogue-empty-state">
            {!gender && activeFilter === "Soldes"
              ? activeSale
                ? `Utilisez le code ${activeSale.code} dans votre panier pour profiter de -${activeSale.discount_percent}% sur votre commande.`
                : "Nous ne sommes pas en période de solde, veuillez revenir plus tard."
              : search
                ? `Aucun résultat pour "${search}".`
                : "Aucun produit ne correspond à ce filtre."}
          </p>
        ) : (
          <>
            <div className="catalogue-product-grid">
              {paginatedProducts.map((product) => (
                <CatalogueProductCard
                  key={`${product.name}-${product.variantId ?? "demo"}`}
                  {...product}
                />
              ))}
            </div>
            <CataloguePagination
              page={safePage}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </>
  );
}

export default Catalogue;
