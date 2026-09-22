import { useEffect, useState } from "react";
import { useParams } from "react-router";
import CollectionFilters from "../CollectionFilters/CollectionFilters";
import CollectionProductCard from "../CollectionProductCard/CollectionProductCard";

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
  categoryFilter: string;
  image: string;
  alt: string;
};

const products: CollectionProduct[] = [
  {
    name: "Essential Tee",
    category: "T-shirt coupe droite",
    price: "39 €",
    badge: "NOUVEAU",
    sale: false,
    categoryFilter: "Femme",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&h=1125&fit=crop&auto=format",
    alt: "T-shirt blanc de la collection Korn",
  },
  {
    name: "Motion Pant",
    category: "Pantalon technique",
    price: "76 €",
    badge: "NOUVEAU",
    sale: true,
    categoryFilter: "Homme",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&h=1125&fit=crop&auto=format",
    alt: "Pantalon technique noir",
  },
  {
    name: "Contour Legging",
    category: "Legging sculptant",
    price: "60 €",
    badge: "SOLDE",
    sale: true,
    categoryFilter: "Femme",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&h=1125&fit=crop&auto=format",
    alt: "Legging noir de la collection Korn",
  },
  {
    name: "Training Tank",
    category: "Débardeur performance",
    price: "36 €",
    badge: "BESTSELLER",
    sale: true,
    categoryFilter: "Homme",
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&h=1125&fit=crop&auto=format",
    alt: "Débardeur noir de sport pour homme",
  },
  {
    name: "Soft Crewneck",
    category: "Sweat col rond doux",
    price: "79 €",
    sale: false,
    categoryFilter: "Femme",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&h=1125&fit=crop&auto=format",
    alt: "Sweat gris oversize",
  },
  {
    name: "Core Short",
    category: "Short d'entraînement",
    price: "39 €",
    badge: "SOLDE",
    sale: true,
    categoryFilter: "Homme",
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900&h=1125&fit=crop&auto=format",
    alt: "Short noir d'entraînement",
  },
  {
    name: "Motion Bra",
    category: "Brassière maintien moyen",
    price: "39 €",
    badge: "BESTSELLER",
    sale: true,
    categoryFilter: "Femme",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&h=1125&fit=crop&auto=format",
    alt: "Brassière noire de sport",
  },
  {
    name: "Performance Tee",
    category: "T-shirt technique",
    price: "55 €",
    sale: false,
    categoryFilter: "Homme",
    image:
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=900&h=1125&fit=crop&auto=format",
    alt: "T-shirt technique noir",
  },
];

function CollectionCatalogue() {
  const { filter } = useParams();
  const routeFilter = filter ? filterByRoute[filter.toLowerCase()] : undefined;
  const [activeFilter, setActiveFilter] = useState(routeFilter ?? "Tout");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    setActiveFilter(routeFilter ?? "Tout");
  }, [routeFilter]);

  const visibleProducts =
    activeFilter === "Tout"
      ? products
      : products.filter((product) => {
          if (activeFilter === "Nouveautés") {
            return product.badge === "NOUVEAU";
          }
          if (activeFilter === "Bestsellers") {
            return product.badge === "BESTSELLER";
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
        <div className="collection-product-grid">
          {sortedProducts.map((product) => (
            <CollectionProductCard key={product.name} {...product} />
          ))}
        </div>
      </section>
    </>
  );
}

export default CollectionCatalogue;
